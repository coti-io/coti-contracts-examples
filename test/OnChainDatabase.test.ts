// Data Privacy Framework (last updated v0.1.0)

import hre from "hardhat"
import { expect } from "chai"
import { setupAccounts } from "./utils/accounts"
import { DataPrivacyFramework } from "../typechain-types"
import { itUint } from "@coti-io/coti-ethers"

async function deploy() {
  const [owner, otherAccount] = await setupAccounts()

  const OnChainDatabaseFactory = await hre.ethers.getContractFactory("OnChainDatabase")

  const onChainDatabase = await OnChainDatabaseFactory
    .connect(owner)
    .deploy({ gasLimit: 15000000 })

  const contract = await onChainDatabase.waitForDeployment()
  
  return { contract, contractAddress: await contract.getAddress(), owner, otherAccount }
}

describe("On-chain Database", function () {
    let deployment: Awaited<ReturnType<typeof deploy>>
  
    before(async function () {
      deployment = await deploy()
    })

    describe("Deployment", function () {
        it("Deployed address should not be undefined", async function () {
          const { contractAddress } = deployment
    
          expect(contractAddress).to.not.equal(undefined)
        })

        it("'op_get_clear_coti_usd_price' should be an allowed operation", async function () {
            const { contract, otherAccount } = deployment
      
            const isAllowed = await contract["isOperationAllowed(address,string)"](otherAccount, "op_get_clear_coti_usd_price")

            expect(isAllowed).to.equal(true)
        })
    })

    describe("Reading items", function () {
        it("Should emit the encrypted value of 'coti_usd_price' in an event", async function () {
            const { contract, otherAccount } = deployment

            const tx = await contract
                .connect(otherAccount)
                .getItem("coti_usd_price", { gasLimit: 15000000 });

            const result = await tx.wait()

            const encryptedValue = result?.logs[0]['args'][1]

            const decryptedValue = await otherAccount.decryptValue(encryptedValue)

            expect(decryptedValue).to.equal(5)
        })

        it("Should emit the clear value of 'oil_usd_price' in an event", async function () {
            const { contract, otherAccount } = deployment

            const tx = await contract
                .connect(otherAccount)
                .getClearOilUsdPrice({ gasLimit: 15000000 });

            const result = await tx.wait()

            const clearValue = result?.logs[0]['args'][1]

            expect(clearValue).to.equal(100)
        })

        it("Should emit the clear value of 'coti_usd_price' in an event", async function () {
            const { contract, otherAccount } = deployment

            const tx = await contract
                .connect(otherAccount)
                .getClearCotiUsdPrice({ gasLimit: 15000000 });

            const result = await tx.wait()

            const clearValue = result?.logs[0]['args'][1]

            expect(clearValue).to.equal(5)
        })

        it("Should emit the clear value of 'oil_coti_price' in an event", async function () {
            const { contract, otherAccount } = deployment

            const tx = await contract
                .connect(otherAccount)
                .getClearOilCotiPrice({ gasLimit: 15000000 });

            const result = await tx.wait()

            const clearValue = result?.logs[0]['args'][1]

            expect(clearValue).to.equal(20)
        })

        it("Should revert when the contract owner tries to emit the clear value of 'oil_coti_price' in an event", async function () {
            const { contract, owner } = deployment

            const tx = await contract
                .connect(owner)
                .getClearOilCotiPrice({ gasLimit: 15000000 });

            expect(tx).to.be.revertedWith("No Permission!")
        })
    })

    describe("Setting items", function () {
        it("Should allow the owner to set a new value in the database", async function () {
            const { contract, contractAddress, owner } = deployment

            const itValue = await owner.encryptValue(
                123,
                contractAddress,
                contract.setItem.fragment.selector
            ) as itUint

            const tx = await contract
                .connect(owner)
                .setItem("test_value", itValue, { gasLimit: 15000000 })
            
            await tx.wait()
        })

        it("Should emit the encrypted value of 'test_value' in an event", async function () {
            const { contract, otherAccount } = deployment

            const tx = await contract
                .connect(otherAccount)
                .getItem("test_value", { gasLimit: 15000000 });

            const result = await tx.wait()

            const encryptedValue = result?.logs[0]['args'][1]

            const decryptedValue = await otherAccount.decryptValue(encryptedValue)

            expect(decryptedValue).to.equal(123)
        })
    })

    describe("Setting permissions", function () {
        it("'op_get_clear_coti_usd_price' should not be an allowed operation", async function () {
            const { contract, owner } = deployment

            let inputData: DataPrivacyFramework.InputDataStruct = {
                caller: "0x0000000000000000000000000000000000000001",
                operation: "*",
                active: false,
                timestampBefore: "0",
                timestampAfter: "0",
                falseKey: false,
                trueKey: true,
                uintParameter: "0",
                addressParameter: owner,
                stringParameter: ""
            }

            const tx = await contract.setPermission(inputData)
      
            await tx.wait()
      
            const isAllowed = await contract["isOperationAllowed(address,string)"](owner, "op_get_clear_coti_usd_price")

            expect(isAllowed).to.equal(false)
        })
    })
})