const { CotiNetwork, getDefaultProvider, Wallet } = require("@coti-io/coti-ethers");
const hre = require("hardhat");

const GAS_LIMIT = 12000000;

async function main() {
  console.log("Deploying PrivateToken contract using COTI ethers...");

  // Use COTI provider instead of regular ethers
  const provider = getDefaultProvider(CotiNetwork.Testnet);
  
  // Create wallet with COTI provider
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log(`Deploying from account: ${wallet.address}`);
  
  // Check account balance
  const balance = await provider.getBalance(wallet.address);
  console.log(`Account balance: ${hre.ethers.formatEther(balance)} COTI`);
  
  if (balance === 0n) {
    throw new Error("Account balance is 0. Please fund your account with COTI tokens.");
  }

  // Get the ContractFactory for PrivateToken
  const PrivateToken = await hre.ethers.getContractFactory("PrivateToken");

  // Constructor parameters for the PrivateToken
  const tokenName = "COTI Private Token";
  const tokenSymbol = "CPT";

  console.log(`Deploying with parameters:`);
  console.log(`- Name: ${tokenName}`);
  console.log(`- Symbol: ${tokenSymbol}`);
  console.log(`- Gas Limit: ${GAS_LIMIT}`);

  try {
    // Deploy the contract with COTI-specific settings
    const privateToken = await PrivateToken
      .connect(wallet)
      .deploy(tokenName, tokenSymbol, { gasLimit: GAS_LIMIT });

    console.log("✅ Contract deployment transaction sent, waiting for confirmation...");

    // Wait for the deployment to be mined
    const contract = await privateToken.waitForDeployment();
    const contractAddress = await contract.getAddress();

    console.log(`🎉 PrivateToken deployed successfully!`);

    // Display contract information
    console.log("\n=== Deployment Summary ===");
    console.log(`Contract: PrivateToken`);
    console.log(`Address: ${contractAddress}`);
    console.log(`Name: ${tokenName}`);
    console.log(`Symbol: ${tokenSymbol}`);
    console.log(`Network: COTI Testnet`);
    console.log(`Deployer: ${wallet.address}`);
    console.log(`Gas Limit Used: ${GAS_LIMIT}`);

    return contractAddress;

  } catch (error) {
    console.error("Deployment failed:", error.message);
    throw error;
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then((address) => {
    console.log(`\n🚀 Deployment completed successfully!`);
    console.log(`Contract address: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.error("\n📝 To fix this:");
      console.error("1. Add COTI tokens to your account");
      console.error("2. For testnet, use the COTI faucet: https://faucet.coti.io");
    } else if (error.message.includes("Account balance is 0")) {
      console.error("\n📝 To fix this:");
      console.error("1. Fund your account with COTI tokens");
      console.error("2. For testnet, use the COTI faucet: https://faucet.coti.io");
    } else if (!process.env.PRIVATE_KEY) {
      console.error("\n📝 To fix this:");
      console.error("1. Make sure PRIVATE_KEY is set in your .env file");
      console.error("2. Copy .env.example to .env and add your private key");
    }
    
    process.exit(1);
  });
