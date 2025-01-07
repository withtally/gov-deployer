import { expect } from "chai";
import { ethers, network } from "hardhat";
import { verifyToken, verifyTimelock, verifyGovernor } from "../../agents/functions/verifyContracts";
import { deployToken, deployTimelock, deployGovernor } from "../../agents/functions";
import { initializeGovernanceDeployer } from "../../agents/context";

describe("Contract Verification", () => {
  // Skip all verification tests on local networks
  const isLocalNetwork = ['hardhat', 'localhost'].includes(network.name);
  
  if (isLocalNetwork) {
    it("skips verification tests on local networks", () => {
      console.log("Skipping verification tests on local network");
    });
    return;
  }

  beforeEach(async () => {
    const [signer] = await ethers.getSigners();
    initializeGovernanceDeployer(signer, network.name);
  });

  describe("Token Verification", () => {
    it("should verify token contract", async function() {
      const [signer] = await ethers.getSigners();
      const signerAddress = await signer.getAddress();

      // Deploy token
      const { contract: token, address } = await deployToken({
        name: "Test Token",
        symbol: "TEST",
        defaultAdmin: signerAddress,
        pauser: signerAddress,
        minter: signerAddress
      });

      // Wait for deployment to be mined
      await token.waitForDeployment();
      // Wait for 5 block confirmations
      await (await token.deploymentTransaction())?.wait(5);

      // Verify
      const result = await verifyToken({
        network: network.name,
        address,
        name: "Test Token",
        symbol: "TEST",
        minter: signerAddress
      });

      expect(result).to.be.true;
    });
  });

  describe("Timelock Verification", () => {
    it("should verify timelock contract", async function() {
      const [signer] = await ethers.getSigners();
      const signerAddress = await signer.getAddress();

      // Deploy timelock
      const { contract: timelock, address } = await deployTimelock({
        minDelay: 60 * 60 * 24, // 1 day
        proposers: [signerAddress],
        executors: [signerAddress],
        admin: signerAddress
      });

      // Wait for deployment to be mined
      await timelock.waitForDeployment();
      // Wait for 5 block confirmations
      await (await timelock.deploymentTransaction())?.wait(5);

      // Verify
      const result = await verifyTimelock({
        network: network.name,
        address,
        minDelay: 60 * 60 * 24,
        proposers: [signerAddress],
        executors: [signerAddress],
        admin: signerAddress
      });

      expect(result).to.be.true;
    });
  });

  describe("Governor Verification", () => {
    it("should verify governor contract", async function() {
      // This test requires token and timelock to be deployed first
      const [signer] = await ethers.getSigners();
      const signerAddress = await signer.getAddress();

      // Deploy prerequisites
      const { contract: token, address: tokenAddress } = await deployToken({
        name: "Test Token",
        symbol: "TEST",
        defaultAdmin: signerAddress,
        pauser: signerAddress,
        minter: signerAddress
      });

      await token.waitForDeployment();

      const { contract: timelock, address: timelockAddress } = await deployTimelock({
        minDelay: 60 * 60 * 24,
        proposers: [signerAddress],
        executors: [signerAddress],
        admin: signerAddress
      });

      await timelock.waitForDeployment();

      // Deploy governor
      const { contract: governor, address } = await deployGovernor({
        name: "Test Governor",
        token: tokenAddress,
        timelock: timelockAddress,
        initialVotingDelay: 1,
        initialVotingPeriod: 50400,
        initialProposalThreshold: BigInt(0),
        quorumNumeratorValue: 4,
        initialVoteExtension: 1
      });

      await governor.waitForDeployment();
      // Wait for 5 block confirmations
      await (await governor.deploymentTransaction())?.wait(5);

      // Verify
      const result = await verifyGovernor({
        network: network.name,
        address,
        name: "Test Governor",
        token: tokenAddress,
        timelock: timelockAddress,
        votingDelay: 1,
        votingPeriod: 50400,
        proposalThreshold: "0",
        quorumNumerator: 4,
        voteExtension: 1
      });

      expect(result).to.be.true;
    });
  });
}); 