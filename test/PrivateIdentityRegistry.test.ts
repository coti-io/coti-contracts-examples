import hre from "hardhat"
import { expect } from "chai"
import { itUint} from "@coti-io/coti-ethers"
import { setupAccounts } from "./utils/accounts"

const gasLimit = 12000000

async function deploy() {
  const [owner, otherAccount] = await setupAccounts()

  const factory = await hre.ethers.getContractFactory("PrivateIdentityRegistry")
  const contract = await factory.connect(owner).deploy({ gasLimit })
  
  await contract.waitForDeployment()

  return { contract, contractAddress: await contract.getAddress(), owner, otherAccount }
}

describe("Private Identity Registry", function () {
  let deployment: Awaited<ReturnType<typeof deploy>>

  before(async function () {
    deployment = await deploy()

    const tx1 = await deployment.contract.addRegistrar(deployment.owner.address, 1, { gasLimit })
    const tx2 = await deployment.contract.addDid(deployment.owner.address, { gasLimit })
    const tx3 = await deployment.contract.addDid(deployment.otherAccount.address, { gasLimit })
    await Promise.all([tx1, tx2, tx3].map((tx) => tx.wait()))
  })

  const idAge = 18
  it(`Set Age Id ${idAge}`, async function () {
    const { contract, contractAddress, owner } = deployment

    const func = contract.connect(owner).setIdentifier
    const selector = func.fragment.selector
    const itAge = await owner.encryptValue(BigInt(idAge), contractAddress, selector) as itUint
    await (await func(owner.address, "age", itAge, { gasLimit })).wait()

    await (await contract.grantAccess(deployment.owner.address, ["age"], { gasLimit })).wait()

    const receipt = await (await contract.getIdentifier(deployment.owner.address, "age", { gasLimit })).wait()

    const ctAge = (receipt!.logs[0] as any).args[0]

    expect(await owner.decryptValue(ctAge)).to.eq(idAge)
  })

  it("Should revert when trying to get identifier without access", async function () {
    const { contract, otherAccount, owner } = deployment

    await expect(
      contract
        .connect(otherAccount)
        .getIdentifier.staticCall(owner.address, "age", { gasLimit, from: otherAccount.address })
    ).to.be.revertedWith("User didn't give you permission to access this identifier.")
  })

  it("Should get identifier if access is granted", async function () {
    const { contract, otherAccount, owner } = deployment

    await (await contract.connect(owner).grantAccess(otherAccount.address, ["age"], { gasLimit })).wait()

    const receipt = await (await contract
      .connect(otherAccount)
      .getIdentifier(owner.address, "age", { gasLimit, from: otherAccount.address })).wait()

    const ctAge = (receipt!.logs[0] as any).args[0]

    expect(await otherAccount.decryptValue(ctAge)).to.eq(idAge)
  })
})