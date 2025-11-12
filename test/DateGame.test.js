import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { Wallet as CotiWallet } from "@coti-io/coti-ethers";

// Import hardhat chai matchers
import "@nomicfoundation/hardhat-chai-matchers";

// Helper: create encrypted value for COTI MPC calls
async function createEncryptedValue(value, wallet, contractAddress, functionSelector) {
  return await wallet.encryptValue(value, contractAddress, functionSelector);
}

// Small retry helper for flaky network operations (used on testnet)
async function retryContractCall(fn, maxRetries = 5, baseDelay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fn();
      if (res && typeof res.wait === 'function') {
        await res.wait();
      }
      return res;
    } catch (err) {
      const last = i === maxRetries - 1;
      const retryable = /timeout|network|pending|nonce|replacement/i.test(err.message || "");
      if (!retryable || last) throw err;
      const delay = baseDelay + i * 1000;
      console.log(`  Call failed (attempt ${i + 1}/${maxRetries}), retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// Wrap contract to auto-add high gas options on COTI testnet
function wrapContractForCotiTestnet(contract) {
  const gasOptions = {
    gasLimit: 15000000,
    gasPrice: ethers.parseUnits("10", "gwei")
  };

  const viewFns = ["isAgeSet", "comparisonResult", "comparisonResult()", "interface"];

  return new Proxy(contract, {
    get(target, prop) {
      const original = target[prop];
      if (prop === 'connect') {
        return function(signer) {
          const connected = original.call(target, signer);
          return wrapContractForCotiTestnet(connected);
        };
      }

      if (typeof original === 'function' && !viewFns.includes(prop)) {
        return async function(...args) {
          const lastArg = args[args.length - 1];
          const hasOptions = lastArg && typeof lastArg === 'object' && !Array.isArray(lastArg) && (lastArg.gasLimit !== undefined || lastArg.gasPrice !== undefined);
          if (!hasOptions) args.push(gasOptions);
          return original.apply(target, args);
        };
      }

      return original;
    }
  });
}

describe("DateGame - core behavior and MPC tests", function () {
  let DateGame;
  let contract;
  let ownerSigner;
  let playerSigner;
  let isCotiTestnet = false;
  let ownerWallet; // CotiWallet when on testnet
  let playerWallet;

  before(async function () {
    const network = await ethers.provider.getNetwork();
    isCotiTestnet = network.chainId === 7082400n;
    if (!isCotiTestnet) {
      console.log("⚠️  COTI MPC tests will be skipped (not on chainId 7082400)");
    } else {
      console.log("✓ Running MPC tests on COTI testnet");
    }
  });

  beforeEach(async function () {
    // Deploy contract using a signer
    [ownerSigner, playerSigner] = await ethers.getSigners();

    // If on COTI testnet, construct COTI wallets from env vars (ADMIN_PK/PLAYER_PK + AES keys)
    if (isCotiTestnet) {
      const adminPK = process.env.ADMIN_PK || process.env.ALICE_PK || process.env.VITE_ADMIN_PK;
      const adminAES = process.env.ADMIN_AES_KEY || process.env.ALICE_AES_KEY || process.env.VITE_ADMIN_AES_KEY;
      const playerPK = process.env.PLAYER_PK || process.env.BOB_PK || process.env.VITE_PLAYER_PK;
      const playerAES = process.env.PLAYER_AES_KEY || process.env.BOB_AES_KEY || process.env.VITE_PLAYER_AES_KEY;

      if (!adminPK || !adminAES || !playerPK || !playerAES) {
        throw new Error("Missing required env vars for COTI testnet tests: ADMIN_PK, ADMIN_AES_KEY, PLAYER_PK, PLAYER_AES_KEY");
      }

      ownerWallet = new CotiWallet(adminPK, ethers.provider);
      ownerWallet.setUserOnboardInfo({ aesKey: adminAES });

      playerWallet = new CotiWallet(playerPK, ethers.provider);
      playerWallet.setUserOnboardInfo({ aesKey: playerAES });
    }

    DateGame = await ethers.getContractFactory("DateGame", ownerSigner);

    if (isCotiTestnet) {
      contract = await DateGame.deploy({ gasLimit: 3000000, gasPrice: ethers.parseUnits("10", "gwei") });
      await contract.waitForDeployment();
      contract = wrapContractForCotiTestnet(contract);
    } else {
      contract = await DateGame.deploy();
      await contract.waitForDeployment();
    }
  });

  it("should start with isAgeSet == false", async function () {
    const v = await contract.isAgeSet();
    expect(v).to.equal(false);
  });

  describe("MPC-dependent flows (only on COTI testnet)", function () {
    before(function () {
      if (!isCotiTestnet) this.skip();
    });

    it("admin can setAge (encrypted) and isAgeSet becomes true", async function () {
      const contractAddress = await contract.getAddress();
      const selector = contract.interface.getFunction("setAge").selector;

      // Encrypt value 30 as age
      const itValue = await createEncryptedValue(30, ownerWallet, contractAddress, selector);

      // Call setAge with retry
      await retryContractCall(() => contract.connect(ownerSigner).setAge(itValue));

      expect(await contract.isAgeSet()).to.equal(true);
    }).timeout(180000);

    it("player can call greaterThan/lessThan and retrieve decrypted result", async function () {
      const contractAddress = await contract.getAddress();
      const setSelector = contract.interface.getFunction("setAge").selector;
      const greaterSelector = contract.interface.getFunction("greaterThan").selector;
      const lessSelector = contract.interface.getFunction("lessThan").selector;

      // Admin sets age = 40
      const itAdmin = await createEncryptedValue(40, ownerWallet, contractAddress, setSelector);
      await retryContractCall(() => contract.connect(ownerSigner).setAge(itAdmin));

      // Player guesses 30 for greaterThan (is stored > guess ? true)
      const itGuess30 = await createEncryptedValue(30, playerWallet, contractAddress, greaterSelector);
      await retryContractCall(() => contract.connect(playerSigner).greaterThan(itGuess30));

      // Read encrypted result and decrypt off-chain using player's wallet
      const ct = await contract.comparisonResult();
      const decrypted = await playerWallet.decryptValue(ct);
      // decrypted should be 1 (true) because 40 > 30
      expect(BigInt(decrypted)).to.equal(1n);

      // Now test lessThan: guess 50 -> stored < 50 ? true
      const itGuess50 = await createEncryptedValue(50, playerWallet, contractAddress, lessSelector);
      await retryContractCall(() => contract.connect(playerSigner).lessThan(itGuess50));
      const ct2 = await contract.comparisonResult();
      const dec2 = await playerWallet.decryptValue(ct2);
      expect(BigInt(dec2)).to.equal(1n);
    }).timeout(240000);
  });
});
