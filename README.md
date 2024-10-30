# COTI Contracts Examples

All repositories specified below contain smart contracts that implement confidentiality features using the COTI V2 protocol.
The contracts provide examples for various use cases, such as Non-Fungible Tokens (NFTs), ERC20 tokens, Auction, and Identity management.

These contracts demonstrate how to leverage the confidentiality features of the COTI V2 protocol to enhance privacy and security in decentralized applications.
The contracts are of Solidity and can be compiled and deployed using popular development tools like Hardhat and Foundry (Work in progress).

#### Important Links

[Docs](https://docs.coti.io) | [Discord](https://discord.gg/cuCykh8P4m) | [Faucet](https://faucet.coti.io)

#### Network-Specific Links

[Devnet Explorer](https://explorer-devnet.coti.io) | [Testnet Explorer](https://testnet.coti.io)

Interact with the contract using any of the following:

1. [Python SDK](https://github.com/coti-io/coti-sdk-python) | [Python SDK Examples](https://github.com/coti-io/coti-sdk-python-examples)
2. [Typescript SDK](https://github.com/coti-io/coti-sdk-typescript) | [Typescript SDK Examples](https://github.com/coti-io/coti-sdk-typescript-examples)

The following contracts are available in each of the packages:

| Contract                       |            | python sdk  | hardhat sdk | typescript sdk | Contract Description                                                                                                                          |
|--------------------------------|------------|-------------|-------------|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `PrivateToken`                 | deployment | ✅          | ✅           | ❌              | Confidential ERC20 - deploy and transfer encrypted amount of funds                                                                            |
| `PrivateToken`                 | execution  | ✅          | ✅           | ✅              | "                                                                                                                                             |
| `PrivateNFT`                   | deployment | ❌          | ✅           | ❌              | Confidential NFT example - saving encrypted data                                                                                              |
| `PrivateNFT`                   | execution  | ❌          | ✅           | ❌              | "                                                                                                                                             |
| `PrivateAuction`          | deployment | ❌          | ✅           | ❌              | Confidential auction - encrypted bid amount                                                                                                   |
| `PrivateAuction`          | execution  | ❌          | ✅           | ❌              | "                                                                                                                                             |
| `PrivateIdentityRegistry` | deployment | ❌          | ✅           | ❌              | Confidential Identity Registry - Encrypted identity data                                                                                      |
| `PrivateIdentityRegistry` | execution  | ❌          | ✅           | ❌              | "                                                                                                                                             |
| `DataOnChain`                  | deployment | ✅          | ❌           | ❌              | Basic encryption and decryption - Good place to start exploring network capabilties                                                         |
| `DataOnChain`                  | execution  | ✅          | ❌           | ✅              | "                                                                                                                                             |
(*) no deployment needed (system contract)

> [!NOTE]  
> Due to the nature of ongoing development, future version might break existing functionality

### Faucet

🤖 To request devnet/testnet funds use our [faucet](https://faucet.coti.io)

# Hardhat ([coti-contracts-examples](https://github.com/coti-io/coti-contracts-examples))

The `coti-contracts-examples` project is composed of two main components:

1. **gcEVM Precompiles** (located in `contracts/precompiles`): These are a set of examples that make use of the gcEVM core libraries. For a full description of these precompiles visit the [precompiles readme](contracts/precompiles/README.md).

2. **Example contracts** (located in `contracts`): the examples folder contain Solidity contracts that perform various use cases, such as Non-Fungible Tokens (NFTs), ERC20 tokens, Auction, and Identity management. It contains smart contracts that implement confidentiality features using the COTI V2 protocol.

The following example contracts are available for Hardhat Runtime Environment for deployment and execution:

| Contract                     | Contract Description                                                                                                                          |
|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| PrivateToken                 | Confidential ERC20 - deploy and transfer encrypted amount of funds                                                                            |
| PrivateNFT                   | Confidential NFT example - saving encrypted data                                                                                              |
| PrivateAuction               | Confidential auction - encrypted bid amount                                                                                                   |
| PrivateIdentityRegistry      | Confidential Identity Registry - Encrypted identity data                                                                                      |
| DataOnChain                  | Basic encryption and decryption                                                                                                               |

## Usage

### Private ERC20 Token

The following process will help you run the [**PrivateToken.sol**](/contracts/PrivateToken.sol) example from the [**COTI contracts examples**](https://github.com/coti-io/coti-contracts-examples) project. The contract defines a custom ERC20 token called `PrivateToken` that extends the functionality of the PrivateERC20 token. Additionally it will:

* Create a EOA (Externally Owned Account)
* Validate minimum balance

The contract is compiled and deployed with Hardhat using the [`PrivateToken.test.ts`](/test/PrivateToken.test.ts) test suite contained in the [`test`](/test) directory of the project.

> [!NOTE]  
> Ensure your environment meets all the pre-requisites. Visit the [pre-requisites section of the readme](/README.md).

1.  Clone the confidentiality-contracts  repo

    ```bash
    git clone https://github.com/coti-io/coti-contracts-examples.git
    ```


2.  Change directory to the newly create one

    ```bash
    cd coti-contracts-examples
    ```


3.  Install dependencies

    ```bash
    npm install
    ```


4.  Build and compile contracts

    ```bash
    npx hardhat compile
    ```


5.  Run the `test-erc20` test suite

    ```bash
    npm run test-private-token
    ```

    Running this test will automatically create an account and a key/value pair with name: `SIGNING_KEYS` (visible in the .env file). The script will output something like this:


    ```bash
    yarn run v1.22.22

      Private Token
        1) "before all" hook in "Private Token"

      0 passing (39ms)
      1 failing

      1) Confidential ERC20
           "before all" hook in "Private Token":
         Error: Created new random account 0x17EDB982c3569D29EbaF407F72aDD05722d5f179.
         Please use faucet to fund it.
    ```

    \
    It is normal to receive the exception `Error: Created new random account [...] Please use faucet to fund it.` on the first run. This will be resolved once the account is funded.  

6. Head to the faucet at [**https://faucet.coti.io**](https://faucet.coti.io) to get devnet funds. \
   Send the following message to the BOT using your newly created account, visible in the last part of the response.\
   \
   `devnet <account address>`\
   \
   The bot will reply with the message:\
   \
   `<username> faucet transferred 10 COTIv2 (devnet)` \
   &#x20;
7.  Run the `test-private-token` test suite once more.

    ```bash
    npm run test-private-token
    ```

    \
    The script output will look like this:  


    ```bash
    Private Token
    ************* Onboarding user  0x17EDB982c3569D29EbaF407F72aDD05722d5f179  *************
    ************* Onboarding user  0xe1E7315F6970F353661fc84FFd9238133cED3677  *************
    ************* Onboarded! created user key and saved into .env file *************
    ************* Onboarded! created user key and saved into .env file *************
        Deployment
          ✔ Deployed address should not be undefined
          ✔ Owner initial balance (123ms)
          ✔ Function 'name' should be correct (130ms)
          ✔ Function 'symbol' should be correct (123ms)
          ✔ Function 'decimals' should be correct (119ms)
          ✔ Function 'totalSupply' should be correct (117ms)
        Transfer 5
          ✔ Transfer - clear (9469ms)
          ✔ Transfer - Confidential (5260ms)
          ✔ TransferFrom - clear without giving allowance should fail (9905ms)
          ✔ TransferFrom - clear (9770ms)
          ✔ TransferFrom - Confidential (10265ms)
          ✔ Approve/Allowance - Confidential (10255ms)

      12 passing (1m)

    ✨  Done in 69.69s.
    ```


Running the test suite does the following:

* **Deploys the `PrivateToken` contract**: Sets up the token with specific details (name, symbol, initial supply).
* **Tests the deployment**: Verifies the contract address, initial balance, and token details (name, symbol, decimals, total supply).
* **Tests transfers**: Both clear and confidential transfers, including `transferFrom` functionality with and without prior allowance.
* **Tests approvals and allowances**: Ensures that the contract correctly handles approvals and allowances, both clear and confidential.

8. You may also run specific tests

   ```
   npm run test-private-nft
   ```

   or

   ```
   npm run test-private-token
   ```

   or

   ```
   npm run test-private-auction
   ```

   or

   ```
   npm run test-private-identity-registry
   ```
   
   or

   ```
   npm run test-precompiles
   ```
### Add contracts to your Hardhat project

```shell
npm install git@github.com:coti-io/coti-contracts.git
```

This command installs the confidentiality contracts from the specified Git repository using the Yarn package manager for Hardhat projects. After installation, you can import and use the contracts in your Solidity code.

#### To report issues, please create a [github issue](https://github.com/coti-io/coti-contracts/issues)