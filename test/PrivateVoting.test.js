import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

// Import hardhat chai matchers
import "@nomicfoundation/hardhat-chai-matchers";

describe("PrivateVoting", function () {
  let votingContract;
  let owner;
  let voter1;
  let voter2;
  let voter3;
  let voter4;

  beforeEach(async function () {
    [owner, voter1, voter2, voter3, voter4] = await ethers.getSigners();
    
    const PrivateVoting = await ethers.getContractFactory("PrivateVoting");
    votingContract = await PrivateVoting.deploy();
    await votingContract.waitForDeployment();
  });

  describe("Contract Initialization", function () {
    it("should initialize with correct voting question", async function () {
      const question = await votingContract.getVotingQuestion();
      expect(question).to.equal("What is your favorite food?");
    });

    it("should initialize with correct voting options", async function () {
      const options = await votingContract.getVotingOptions();
      expect(options).to.have.length(4);
      expect(Number(options[0].id)).to.equal(1);
      expect(options[0].label).to.equal("Chocolate");
      expect(Number(options[1].id)).to.equal(2);
      expect(options[1].label).to.equal("Raspberry");
      expect(Number(options[2].id)).to.equal(3);
      expect(options[2].label).to.equal("Sandwich");
      expect(Number(options[3].id)).to.equal(4);
      expect(options[3].label).to.equal("Mango");
    });

    it("should initialize with election opened", async function () {
      const isOpen = await votingContract.electionOpened();
      expect(isOpen).to.be.true;
    });

    it("should set deployer as owner", async function () {
      const [isOpen, voterCount, electionOwner] = await votingContract.getElectionStatus();
      expect(electionOwner).to.equal(owner.address);
    });
  });

  describe("Voter Registration", function () {
    it("should allow owner to register voters", async function () {
      await expect(votingContract.addVoter("Alice", voter1.address))
        .to.emit(votingContract, "VoterRegistered")
        .withArgs(voter1.address, "Alice");

      const isRegistered = await votingContract.isVoterRegistered(voter1.address);
      expect(isRegistered).to.be.true;

      const [name, registered] = await votingContract.getVoterInfo(voter1.address);
      expect(name).to.equal("Alice");
      expect(registered).to.be.true;
    });

    it("should register multiple voters", async function () {
      await votingContract.addVoter("Alice", voter1.address);
      await votingContract.addVoter("Bob", voter2.address);
      await votingContract.addVoter("Charlie", voter3.address);

      expect(await votingContract.isVoterRegistered(voter1.address)).to.be.true;
      expect(await votingContract.isVoterRegistered(voter2.address)).to.be.true;
      expect(await votingContract.isVoterRegistered(voter3.address)).to.be.true;
    });

    it("should prevent duplicate voter registration", async function () {
      await votingContract.addVoter("Alice", voter1.address);
      
      await expect(votingContract.addVoter("Alice Again", voter1.address))
        .to.be.revertedWithCustomError(votingContract, "VoterAlreadyRegistered")
        .withArgs(voter1.address);
    });

    it("should prevent registration with invalid address", async function () {
      await expect(votingContract.addVoter("Invalid", ethers.ZeroAddress))
        .to.be.revertedWithCustomError(votingContract, "InvalidVoterAddress");
    });

    it("should prevent registration with empty name", async function () {
      await expect(votingContract.addVoter("", voter1.address))
        .to.be.revertedWithCustomError(votingContract, "EmptyVoterName");
    });

    it("should prevent registration with whitespace-only name", async function () {
      await expect(votingContract.addVoter("   ", voter1.address))
        .to.be.revertedWithCustomError(votingContract, "EmptyVoterName");
    });

    it("should prevent non-owner from registering voters", async function () {
      await expect(votingContract.connect(voter1).addVoter("Alice", voter2.address))
        .to.be.revertedWithCustomError(votingContract, "OnlyOwnerAllowed");
    });

    it("should track registered voter count", async function () {
      expect(Number(await votingContract.getRegisteredVoterCount())).to.equal(0);
      
      await votingContract.addVoter("Alice", voter1.address);
      expect(Number(await votingContract.getRegisteredVoterCount())).to.equal(1);
      
      await votingContract.addVoter("Bob", voter2.address);
      expect(Number(await votingContract.getRegisteredVoterCount())).to.equal(2);
      
      await votingContract.addVoter("Charlie", voter3.address);
      expect(Number(await votingContract.getRegisteredVoterCount())).to.equal(3);
    });

    it("should return voter addresses list", async function () {
      await votingContract.addVoter("Alice", voter1.address);
      await votingContract.addVoter("Bob", voter2.address);
      
      const addresses = await votingContract.getVoterAddresses();
      expect(addresses).to.have.length(2);
      expect(addresses[0]).to.equal(voter1.address);
      expect(addresses[1]).to.equal(voter2.address);
    });
  });

  describe("Election State Management", function () {
    beforeEach(async function () {
      // Register a voter for election state tests
      await votingContract.addVoter("Alice", voter1.address);
    });

    it("should prevent non-owner from toggling election", async function () {
      await expect(votingContract.connect(voter1).toggleElection())
        .to.be.revertedWithCustomError(votingContract, "OnlyOwnerAllowed");
    });

    it("should prevent closing election without voters", async function () {
      // Deploy fresh contract without voters
      const PrivateVoting = await ethers.getContractFactory("PrivateVoting");
      const freshContract = await PrivateVoting.deploy();
      await freshContract.waitForDeployment();
      
      await expect(freshContract.toggleElection())
        .to.be.revertedWithCustomError(freshContract, "CannotCloseElectionWithoutVoters");
    });

    it("should return correct election status", async function () {
      const [isOpen, voterCount, electionOwner] = await votingContract.getElectionStatus();
      expect(isOpen).to.be.true;
      expect(Number(voterCount)).to.equal(1);
      expect(electionOwner).to.equal(owner.address);
    });
  });

  describe("Owner Authorization", function () {
    beforeEach(async function () {
      await votingContract.addVoter("Alice", voter1.address);
    });

    it("should allow registered voter to authorize owner", async function () {
      await expect(votingContract.connect(voter1).authorizeOwnerToReadVote())
        .to.emit(votingContract, "OwnerAuthorized")
        .withArgs(voter1.address);
    });

    it("should prevent unregistered voter from authorizing owner", async function () {
      await expect(votingContract.connect(voter2).authorizeOwnerToReadVote())
        .to.be.revertedWithCustomError(votingContract, "VoterNotRegistered")
        .withArgs(voter2.address);
    });

    it("should prevent duplicate authorization", async function () {
      await votingContract.connect(voter1).authorizeOwnerToReadVote();
      
      await expect(votingContract.connect(voter1).authorizeOwnerToReadVote())
        .to.be.revertedWith("Owner already authorized");
    });
  });

  describe("Vote Option Validation", function () {
    it("should validate correct vote options", async function () {
      expect(await votingContract.validateVoteOption(1)).to.be.true;
      expect(await votingContract.validateVoteOption(2)).to.be.true;
      expect(await votingContract.validateVoteOption(3)).to.be.true;
      expect(await votingContract.validateVoteOption(4)).to.be.true;
    });

    it("should reject invalid vote options", async function () {
      expect(await votingContract.validateVoteOption(0)).to.be.false;
      expect(await votingContract.validateVoteOption(5)).to.be.false;
      expect(await votingContract.validateVoteOption(255)).to.be.false;
    });
  });

  describe("Access Control", function () {
    beforeEach(async function () {
      await votingContract.addVoter("Alice", voter1.address);
    });

    it("should prevent accessing results when election is open", async function () {
      await expect(votingContract.getResults())
        .to.be.revertedWithCustomError(votingContract, "ElectionStillOpen");
    });

    it("should prevent viewing results when election is open", async function () {
      await expect(votingContract.viewResults())
        .to.be.revertedWithCustomError(votingContract, "ElectionStillOpen");
    });

    it("should prevent aggregating votes when election is open", async function () {
      await expect(votingContract.aggregateVotes())
        .to.be.revertedWithCustomError(votingContract, "ElectionStillOpen");
    });

    it("should prevent non-owner from accessing getResults", async function () {
      await votingContract.toggleElection();
      
      await expect(votingContract.connect(voter1).getResults())
        .to.be.revertedWithCustomError(votingContract, "OnlyOwnerAllowed");
    });

    it("should prevent non-owner from accessing getEncryptedResult", async function () {
      await votingContract.toggleElection();
      
      await expect(votingContract.connect(voter1).getEncryptedResult(1))
        .to.be.revertedWithCustomError(votingContract, "OnlyOwnerAllowed");
    });

    it("should verify voter registration is required", async function () {
      const isRegistered = await votingContract.isVoterRegistered(voter2.address);
      expect(isRegistered).to.be.false;
      
      await votingContract.addVoter("Bob", voter2.address);
      const isNowRegistered = await votingContract.isVoterRegistered(voter2.address);
      expect(isNowRegistered).to.be.true;
    });
  });

  describe("Error Handling", function () {
    it("should handle results request with no voters registered", async function () {
      // Deploy fresh contract without voters
      const PrivateVoting = await ethers.getContractFactory("PrivateVoting");
      const freshContract = await PrivateVoting.deploy();
      await freshContract.waitForDeployment();
      
      // Try to close election (should fail)
      await expect(freshContract.toggleElection())
        .to.be.revertedWithCustomError(freshContract, "CannotCloseElectionWithoutVoters");
    });

    it("should handle results request with registered voters but no votes cast", async function () {
      // Add voters but don't have them vote
      await votingContract.addVoter("Alice", voter1.address);
      await votingContract.addVoter("Bob", voter2.address);
      
      // Close election
      await votingContract.toggleElection();
      
      // Should revert with NoVotesCast error since no votes were cast
      await expect(votingContract.getResults())
        .to.be.revertedWithCustomError(votingContract, "NoVotesCast");
    });

    it("should handle aggregateVotes with no voters registered", async function () {
      // Deploy fresh contract, try to force close, then aggregate
      const PrivateVoting = await ethers.getContractFactory("PrivateVoting");
      const freshContract = await PrivateVoting.deploy();
      await freshContract.waitForDeployment();
      
      // Can't even close election without voters
      await expect(freshContract.toggleElection())
        .to.be.revertedWithCustomError(freshContract, "CannotCloseElectionWithoutVoters");
    });

    it("should handle viewResults before aggregation", async function () {
      await votingContract.addVoter("Alice", voter1.address);
      await votingContract.toggleElection();
      
      // viewResults should revert if aggregation hasn't happened
      await expect(votingContract.viewResults())
        .to.be.revertedWith("Votes have not been aggregated yet. Call aggregateVotes() first.");
    });

    it("should reject invalid option ID in getEncryptedResult", async function () {
      await votingContract.addVoter("Alice", voter1.address);
      await votingContract.toggleElection();
      
      await expect(votingContract.getEncryptedResult(0))
        .to.be.revertedWith("Invalid option ID");
      
      await expect(votingContract.getEncryptedResult(5))
        .to.be.revertedWith("Invalid option ID");
    });
  });

  describe("Voter Information Retrieval", function () {
    beforeEach(async function () {
      await votingContract.addVoter("Alice", voter1.address);
      await votingContract.addVoter("Bob", voter2.address);
    });

    it("should retrieve voter info correctly", async function () {
      const [name, isRegistered] = await votingContract.getVoterInfo(voter1.address);
      expect(name).to.equal("Alice");
      expect(isRegistered).to.be.true;
    });

    it("should return empty info for unregistered voters", async function () {
      const [name, isRegistered] = await votingContract.getVoterInfo(voter3.address);
      expect(name).to.equal("");
      expect(isRegistered).to.be.false;
    });

    it("should verify voter registration status", async function () {
      expect(await votingContract.isVoterRegistered(voter1.address)).to.be.true;
      expect(await votingContract.isVoterRegistered(voter2.address)).to.be.true;
      expect(await votingContract.isVoterRegistered(voter3.address)).to.be.false;
    });
  });

  describe("Multiple Voter Scenarios", function () {
    it("should handle registration of many voters", async function () {
      const voterCount = 10;
      const signers = await ethers.getSigners();
      
      for (let i = 0; i < voterCount && i < signers.length - 1; i++) {
        await votingContract.addVoter(`Voter${i}`, signers[i + 1].address);
      }
      
      expect(Number(await votingContract.getRegisteredVoterCount())).to.equal(voterCount);
    });

    it("should track all voter addresses correctly", async function () {
      await votingContract.addVoter("Alice", voter1.address);
      await votingContract.addVoter("Bob", voter2.address);
      await votingContract.addVoter("Charlie", voter3.address);
      
      const addresses = await votingContract.getVoterAddresses();
      expect(addresses).to.include(voter1.address);
      expect(addresses).to.include(voter2.address);
      expect(addresses).to.include(voter3.address);
    });
  });

  describe("Getter Methods", function () {
    it("should return correct voting question", async function () {
      const question = await votingContract.getVotingQuestion();
      expect(question).to.be.a("string");
      expect(question.length).to.be.greaterThan(0);
    });

    it("should return voting options array", async function () {
      const options = await votingContract.getVotingOptions();
      expect(options).to.have.length(4);
      
      for (let i = 0; i < 4; i++) {
        expect(Number(options[i].id)).to.equal(i + 1);
        expect(options[i].label).to.be.a("string");
        expect(options[i].label.length).to.be.greaterThan(0);
      }
    });

    it("should return election status with correct fields", async function () {
      await votingContract.addVoter("Alice", voter1.address);
      
      const [isOpen, voterCount, electionOwner] = await votingContract.getElectionStatus();
      
      expect(typeof isOpen).to.equal("boolean");
      expect(Number(voterCount)).to.be.a("number");
      expect(ethers.isAddress(electionOwner)).to.be.true;
    });
  });

  describe("Edge Cases", function () {
    it("should handle voter with very long name", async function () {
      const longName = "A".repeat(100);
      await expect(votingContract.addVoter(longName, voter1.address))
        .to.emit(votingContract, "VoterRegistered");
      
      const [name, isRegistered] = await votingContract.getVoterInfo(voter1.address);
      expect(name).to.equal(longName);
      expect(isRegistered).to.be.true;
    });

    it("should handle voter with unicode name", async function () {
      const unicodeName = "Alice 🗳️ 投票";
      await expect(votingContract.addVoter(unicodeName, voter1.address))
        .to.emit(votingContract, "VoterRegistered");
      
      const [name, isRegistered] = await votingContract.getVoterInfo(voter1.address);
      expect(name).to.equal(unicodeName);
      expect(isRegistered).to.be.true;
    });

    it("should handle querying non-existent voter", async function () {
      const randomAddress = ethers.Wallet.createRandom().address;
      const [name, isRegistered] = await votingContract.getVoterInfo(randomAddress);
      
      expect(name).to.equal("");
      expect(isRegistered).to.be.false;
    });
  });

  describe("Security Checks", function () {
    it("should prevent owner from being registered as voter by themselves", async function () {
      // This should work - owner can register themselves
      await expect(votingContract.addVoter("Owner", owner.address))
        .to.emit(votingContract, "VoterRegistered");
    });

    it("should enforce owner-only methods", async function () {
      await votingContract.addVoter("Alice", voter1.address);
      
      // Non-owner cannot add voters
      await expect(votingContract.connect(voter1).addVoter("Bob", voter2.address))
        .to.be.revertedWithCustomError(votingContract, "OnlyOwnerAllowed");
      
      // Non-owner cannot toggle election
      await expect(votingContract.connect(voter1).toggleElection())
        .to.be.revertedWithCustomError(votingContract, "OnlyOwnerAllowed");
    });

    it("should enforce voter-only methods", async function () {
      // Non-registered voter cannot authorize owner
      await expect(votingContract.connect(voter1).authorizeOwnerToReadVote())
        .to.be.revertedWithCustomError(votingContract, "VoterNotRegistered");
    });
  });
});
