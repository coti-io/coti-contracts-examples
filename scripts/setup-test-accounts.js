const { CotiNetwork, getDefaultProvider, Wallet, parseEther } = require("@coti-io/coti-ethers");
const fs = require("fs");
require("dotenv").config();

async function setupTestAccounts() {
  console.log("Setting up test accounts...");
  
  const provider = getDefaultProvider(CotiNetwork.Testnet);
  
  // Your main funded account
  const privateKey = process.env.PRIVATE_KEY.startsWith('0x') ? process.env.PRIVATE_KEY : '0x' + process.env.PRIVATE_KEY;
  const mainWallet = new Wallet(privateKey, provider);
  console.log(`Main account: ${mainWallet.address}`);
  
  const balance = await provider.getBalance(mainWallet.address);
  console.log(`Main account balance: ${balance.toString()} wei`);
  
  if (balance === 0n) {
    throw new Error("Main account has no balance. Please fund it first.");
  }
  
  // Create a second account
  const secondWallet = Wallet.createRandom(provider);
  console.log(`Created second account: ${secondWallet.address}`);
  
  // Fund the second account from the main account
  console.log("Funding second account...");
  const fundingTx = await mainWallet.sendTransaction({
    to: secondWallet.address,
    value: parseEther("2.0"),
    gasLimit: 21000
  });
  
  await fundingTx.wait();
  console.log(`✅ Funded second account with 2 COTI`);
  
  // Update .env file
  const envContent = `# COTI Private Key for deployment
# Replace with your actual private key (without 0x prefix)
PRIVATE_KEY=${process.env.PRIVATE_KEY}

# Test accounts
PUBLIC_KEYS=${mainWallet.address},${secondWallet.address}
SIGNING_KEYS=${mainWallet.privateKey.slice(2)},${secondWallet.privateKey.slice(2)}
`;

  fs.writeFileSync('.env', envContent);
  console.log("✅ Updated .env file with new accounts");
  
  console.log("\n=== Test Account Setup Complete ===");
  console.log(`Account 1: ${mainWallet.address}`);
  console.log(`Account 2: ${secondWallet.address}`);
  console.log("\nYou can now run the tests!");
}

setupTestAccounts().catch(console.error);
