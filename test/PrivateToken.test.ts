import hre from "hardhat"
import { expect } from "chai"

import { setupAccounts } from "./utils/accounts"
import { PrivateToken } from "../typechain-types"
import { itUint, Wallet, ZeroAddress } from "@coti-io/coti-ethers"

const GAS_LIMIT = 12000000

async function deploy() {
    const [owner, otherAccount] = await setupAccounts()

    const tokenContract = await hre.ethers.getContractFactory("PrivateToken")

    const token = await tokenContract
        .connect(owner)
        .deploy("Private Token", "PTOK", { gasLimit: GAS_LIMIT })

    const contract = await token.waitForDeployment()

    return {
        contract,
        contractAddress: await contract.getAddress(),
        owner,
        otherAccount
    }
}

describe("Private Token", function () {
    let contract: PrivateToken
    let contractAddress: string
    let owner: Wallet
    let otherAccount: Wallet

    before(async function () {
        const deployment = await deploy()

        contract = deployment.contract
        contractAddress = deployment.contractAddress
        owner = deployment.owner
        otherAccount = deployment.otherAccount
    })

    describe("deploy", function () {
        it('has a name', async function () {
            await expect(await contract.name()).to.equal("Private Token");
        })

        it('has a symbol', async function () {
            await expect(await contract.symbol()).to.equal("PTOK");
        })

        it('has 6 decimals', async function () {
            await expect(await contract.decimals()).to.equal(6n);
        })
    })

    describe("mint", function () {
        const value = 5000n

        describe("successful mint", async function () {
            before("minting", async function () {
                this.tx = await contract
                    .connect(owner)
                    .mint(owner.address, value, { gasLimit: GAS_LIMIT })
                
                await this.tx.wait()
            })
            
            it('increments totalSupply', async function () {
                await expect(await contract.totalSupply()).to.equal(5000n)
            })
            
            it('increments recipient balance', async function () {
                const ctBalance = await contract["balanceOf(address)"](owner.address)
                
                const balance = await owner.decryptValue(ctBalance)
                
                await expect(balance).to.equal(value)
            })
            
            it('emits Transfer event', async function () {
                await expect(this.tx).to.emit(contract, "Transfer")
            })
        })
        
        describe('failed mint', async function () {
            it('rejects minting to the zero address', async function () {
                await expect(
                    contract
                        .connect(owner)
                        .mint(ZeroAddress, value)
                    )
                    .to.be.revertedWithCustomError(contract, "ERC20InvalidReceiver")
                    .withArgs(ZeroAddress)
            })
        })
    })

    describe("burn", function () {
        const value = 5000n
        
        describe('failed burn', async function () {
            it('rejects burning from the zero address', async function () {
                await expect(
                    contract
                        .connect(owner)
                        .burn(ZeroAddress, value)
                    )
                    .to.be.revertedWithCustomError(contract, "ERC20InvalidSender")
                    .withArgs(ZeroAddress)
            })

            it('does not update balance when burning more than balance', async function () {
                const tx = await contract
                    .connect(owner)
                    .burn(owner.address, value + 1n, { gasLimit: GAS_LIMIT })
                
                await tx.wait()
                
                const ctBalance = await contract["balanceOf(address)"](owner.address)

                const balance = await owner.decryptValue(ctBalance)
    
                await expect(balance).to.equal(value)
            })
        })

        describe('successful burn', async function () {
            before("burning", async function () {
                this.tx = await contract
                    .connect(owner)
                    .burn(owner.address, value, { gasLimit: GAS_LIMIT })
                
                await this.tx.wait()
            })

            it('decrements totalSupply', async function () {
                await expect(await contract.totalSupply()).to.equal(0n)
            })

            it('decrements the senders balance', async function () {
                const ctBalance = await contract["balanceOf(address)"](owner.address)

                const balance = await owner.decryptValue(ctBalance)
    
                await expect(balance).to.equal(0n)
            })

            it('emits Transfer event', async function () {
                await expect(this.tx).to.emit(contract, "Transfer")
            })
        })
    })

    describe("transfer", function () {
        const value = 10000n

        before("minting", async function () {
            this.tx = await contract
                .connect(owner)
                .mint(owner.address, value, { gasLimit: GAS_LIMIT })
            
            await this.tx.wait()
        })

        describe("failed transfer", async function () {
            it('rejects transferring to the zero address', async function () {
                const itValue = await owner.encryptValue(value, contractAddress, contract["transfer(address,(uint256,bytes))"].fragment.selector) as itUint
    
                await expect(
                    contract
                        .connect(owner)
                        ["transfer(address,(uint256,bytes))"]
                        (ZeroAddress, itValue)
                    )
                    .to.be.revertedWithCustomError(contract, "ERC20InvalidReceiver")
                    .withArgs(ZeroAddress)
            })

            it('does not transfer tokens when amount exceeds balance', async function () {
                const itValue = await owner.encryptValue(value + 1n, contractAddress, contract["transfer(address,(uint256,bytes))"].fragment.selector) as itUint

                const tx = await contract
                    .connect(owner)
                    ["transfer(address,(uint256,bytes))"]
                    (otherAccount.address, itValue, { gasLimit: GAS_LIMIT })
                
                await tx.wait()

                let ctBalance = await contract["balanceOf(address)"](owner.address)

                let balance = await owner.decryptValue(ctBalance)
    
                await expect(balance).to.equal(value)

                ctBalance = await contract["balanceOf(address)"](otherAccount.address)

                balance = await otherAccount.decryptValue(ctBalance)
    
                await expect(balance).to.equal(0n)
            })
        })

        describe("successful transfer", async function () {
            before("transferring", async function () {
                const itValue = await owner.encryptValue(value / 2n, contractAddress, contract["transfer(address,(uint256,bytes))"].fragment.selector) as itUint

                const tx = await contract
                    .connect(owner)
                    ["transfer(address,(uint256,bytes))"]
                    (otherAccount.address, itValue, { gasLimit: GAS_LIMIT })
                
                await tx.wait()
            })

            it('decrements the senders balance', async function () {
                const ctBalance = await contract["balanceOf(address)"](owner.address)

                const balance = await owner.decryptValue(ctBalance)
    
                await expect(balance).to.equal(value / 2n)
            })

            it('increments the receivers balance', async function () {
                const ctBalance = await contract["balanceOf(address)"](otherAccount.address)

                const balance = await otherAccount.decryptValue(ctBalance)
    
                await expect(balance).to.equal(value / 2n)
            })
        })
    })

    describe("approve", function () {
        const value = 5000n

        describe("failed approval", async function () {
            it('rejects when approving the zero address', async function () {
                const itValue = await owner.encryptValue(value, contractAddress, contract["transfer(address,(uint256,bytes))"].fragment.selector) as itUint
    
                await expect(
                    contract
                        .connect(owner)
                        ["approve(address,(uint256,bytes))"]
                        (ZeroAddress, itValue)
                    )
                    .to.be.revertedWithCustomError(contract, "ERC20InvalidSpender")
                    .withArgs(ZeroAddress)
            })
        })

        describe("successful approval", async function () {
            before('approving', async function () {
                const itValue = await owner.encryptValue(value, contractAddress, contract["approve(address,(uint256,bytes))"].fragment.selector) as itUint

                const tx = await contract
                    .connect(owner)
                    ["approve(address,(uint256,bytes))"]
                    (otherAccount.address, itValue, { gasLimit: GAS_LIMIT })
    
                await tx.wait()
            })

            it('increment the allowance encrypted with the owners key', async function () {
                const ctAllowance = await contract
                    ["allowance(address,address)"]
                    (owner.address, otherAccount.address)
                
                const allowance = await owner.decryptValue(ctAllowance[1])

                await expect(allowance).to.equal(value)
            })

            it('increment the allowance encrypted with the spenders key', async function () {
                const ctAllowance = await contract
                    ["allowance(address,address)"]
                    (owner.address, otherAccount.address)
                
                const allowance = await otherAccount.decryptValue(ctAllowance[2])

                await expect(allowance).to.equal(value)
            })
        })
    })

    describe('transferFrom', function () {
        const value = 3000n

        describe('failed transferFrom', async function () {
            it('rejects transferring to the zero address', async function () {
                const itValue = await otherAccount.encryptValue(value, contractAddress, contract["transferFrom(address,address,(uint256,bytes))"].fragment.selector) as itUint
    
                await expect(
                    contract
                        .connect(otherAccount)
                        ["transferFrom(address,address,(uint256,bytes))"]
                        (owner.address, ZeroAddress, itValue)
                    )
                    .to.be.revertedWithCustomError(contract, "ERC20InvalidReceiver")
                    .withArgs(ZeroAddress)
            })

            describe("transferring more than the owners balance", async function () {
                before("transferring", async function () {
                    const itValue = await otherAccount.encryptValue(2n * value, contractAddress, contract["transferFrom(address,address,(uint256,bytes))"].fragment.selector) as itUint

                    const tx = await contract
                        .connect(otherAccount)
                        ["transferFrom(address,address,(uint256,bytes))"]
                        (owner.address, "0x0000000000000000000000000000000000000001", itValue)
                    
                    await tx.wait()
                })

                it("does not decrement the owners balance", async function () {
                    const ctBalance = await contract["balanceOf(address)"](owner.address)

                    const balance = await owner.decryptValue(ctBalance)
        
                    await expect(balance).to.equal(5000n)
                })

                it("does not decrement the spenders allowance", async function () {
                    const ctAllowance = await contract["allowance(address,address)"](owner.address, otherAccount.address)

                    const allowance = await owner.decryptValue(ctAllowance[1])
        
                    await expect(allowance).to.equal(5000n)
                })
            })
        })

        describe('successful transferFrom', async function () {
            before('transferring', async function () {
                const itValue = await otherAccount.encryptValue(value, contractAddress, contract["transferFrom(address,address,(uint256,bytes))"].fragment.selector) as itUint

                const tx = await contract
                    .connect(otherAccount)
                    ["transferFrom(address,address,(uint256,bytes))"]
                    (owner.address, otherAccount.address, itValue)
                
                await tx.wait()
            })

            it('decrement the owners balance', async function () {
                const ctBalance = await contract["balanceOf(address)"](owner.address)

                const balance = await owner.decryptValue(ctBalance)
    
                await expect(balance).to.equal(2000n)
            })

            it('increment the recipients balance', async function () {
                const ctBalance = await contract["balanceOf(address)"](otherAccount.address)

                const balance = await otherAccount.decryptValue(ctBalance)
    
                await expect(balance).to.equal(8000n)
            })

            it('decrement the spenders allowance', async function () {
                const ctAllowance = await contract["allowance(address,address)"](owner.address, otherAccount.address)

                const allowance = await otherAccount.decryptValue(ctAllowance[2])
    
                await expect(allowance).to.equal(2000n)
            })
        })
    })

    describe("maximum allowance", function () {
        const value = (2n ** 64n) - 1n

        before("transferring", async function () {
            let itValue = await owner.encryptValue(value, contractAddress, contract["approve(address,(uint256,bytes))"].fragment.selector) as itUint

            let tx = await contract
                .connect(owner)
                ["approve(address,(uint256,bytes))"]
                (otherAccount.address, itValue)
            
            await tx.wait()

            itValue = await otherAccount.encryptValue(7000n, contractAddress, contract["transferFrom(address,address,(uint256,bytes))"].fragment.selector) as itUint

            tx = await contract
                .connect(otherAccount)
                ["transferFrom(address,address,(uint256,bytes))"]
                (owner.address, "0x0000000000000000000000000000000000000001", itValue)
            
            await tx.wait()
        })

        it("decrement the owners balance", async function () {
            const ctBalance = await contract["balanceOf(address)"](owner.address)

            const balance = await owner.decryptValue(ctBalance)

            await expect(balance).to.equal(2000n)
        })

        it("does not decrement the spenders allowance", async function () {
            const ctAllowance = await contract["allowance(address,address)"](owner.address, otherAccount.address)

            const allowance = await owner.decryptValue(ctAllowance[1])

            await expect(allowance).to.equal(value)
        })
    })
})
