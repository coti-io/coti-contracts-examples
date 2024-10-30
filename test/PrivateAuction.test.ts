import hre from "hardhat"
import { expect } from "chai"
import { itUint, Wallet } from "@coti-io/coti-ethers"
import { setupAccounts } from "./utils/accounts"

const gasLimit = 12000000

async function deploy() {
  const [owner, otherAccount] = await setupAccounts()

  const tokenContract = await hre.ethers.getContractFactory("PrivateToken")
  const { name, symbol, initialSupply } = { name: "My Private Token", symbol: "PTOK", initialSupply: 500000000n } as const
  const token = await tokenContract
    .connect(owner)
    .deploy(name, symbol, { gasLimit, from: owner.address })

  await token.waitForDeployment()

  await (
    await token
      .connect(owner)
      .mint(owner.address, initialSupply)
  ).wait()

  const factory = await hre.ethers.getContractFactory("PrivateAuction")
  const contract = await factory
    .connect(owner)
    .deploy(otherAccount.address, await token.getAddress(), 60 * 60 * 24, true, { gasLimit })

  await contract.waitForDeployment()

  return {
    token,
    tokenAddress: await token.getAddress(),
    contract,
    contractAddress: await contract.getAddress(),
    owner,
    otherAccount
  }
}

async function expectBalance(
  token: Awaited<ReturnType<typeof deploy>>["token"],
  amount: number,
  user: Wallet
) {
  const ctBalance = await token["balanceOf(address)"](user.address)
  let balance = await user.decryptValue(ctBalance)
  expect(balance).to.equal(amount)
}

async function expectBid(
  contract: Awaited<ReturnType<typeof deploy>>["contract"],
  amount: number,
  user: Wallet
) {
  const ctBalance = await contract.connect(user).getBid.staticCall()
  let bid = await user.decryptValue(ctBalance)
  expect(bid).to.equal(amount)
}

describe("Private Auction", function () {
  let deployment: Awaited<ReturnType<typeof deploy>>

  before(async function () {
    deployment = await deploy()
  })

  describe("Deployment", function () {
    it("Deployed address should not be undefined", async function () {
      expect(deployment.contractAddress).to.not.equal(undefined)
    })

    it("Function 'bidCounter' should be correct", async function () {
      expect(await deployment.contract.bidCounter()).to.equal(0)
    })

    it("Function 'endTime' should be correct", async function () {
      expect(await deployment.contract.endTime()).not.to.equal(0)
    })

    it("Function 'contractOwner' should be correct", async function () {
      expect(await deployment.contract.contractOwner()).to.equal(deployment.owner.address)
    })

    it("Function 'beneficiary' should be correct", async function () {
      expect(await deployment.contract.beneficiary()).to.equal(deployment.otherAccount.address)
    })
  })

  describe("Bidding", function () {
    const bidAmount = 5
    it(`Bid ${bidAmount}`, async function () {
      const { token, tokenAddress, contract, contractAddress, owner } = deployment

      const initialBalance = Number(await owner.decryptValue(await token["balanceOf(address)"](owner.address)))

      let itBidAmount = await owner.encryptValue(
        bidAmount,
        tokenAddress,
        token["approve(address,(uint256,bytes))"].fragment.selector
      ) as itUint

      await (
        await token
          .connect(owner)
          ["approve(address,(uint256,bytes))"]
          (contractAddress, itBidAmount, { gasLimit })
      ).wait()

      const func = contract.connect(owner).bid
      const selector = func.fragment.selector
      itBidAmount = await owner.encryptValue(BigInt(bidAmount), contractAddress, selector) as itUint
      await (await func(itBidAmount, { gasLimit })).wait()

      await expectBalance(token, initialBalance - bidAmount, owner)

      expectBid(contract, bidAmount, owner)
    })

    it(`Increase Bid ${bidAmount * 2}`, async function () {
      const { token, tokenAddress, contract, contractAddress, owner } = deployment

      const initialBalance = Number(await owner.decryptValue(await token["balanceOf(address)"](owner.address)))

      let itBidAmount = await owner.encryptValue(
        bidAmount * 2,
        tokenAddress,
        token["approve(address,(uint256,bytes))"].fragment.selector
      ) as itUint

      await (
        await token
          .connect(owner)
          ["approve(address,(uint256,bytes))"]
          (contractAddress, itBidAmount, { gasLimit })
      ).wait()

      const func = contract.connect(owner).bid
      const selector = func.fragment.selector
      itBidAmount = await owner.encryptValue(BigInt(bidAmount * 2), contractAddress, selector) as itUint
      await (await func(itBidAmount, { gasLimit })).wait()

      await expectBalance(token, initialBalance - bidAmount, owner)

      expectBid(contract, bidAmount * 2, owner)
    })

    it(`Winner`, async function () {
      const { contract, owner } = deployment

      await (await contract.connect(owner).stop({ gasLimit })).wait()

      const receipt = await (await contract.connect(owner).doIHaveHighestBid({ gasLimit })).wait()

      const ctBool = (receipt!.logs[0] as any).args[0]

      let isHighestBid = await owner.decryptValue(ctBool)
      expect(isHighestBid).to.eq(1)
    })
  })
})