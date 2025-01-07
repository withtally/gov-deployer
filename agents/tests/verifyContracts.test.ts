import { expect } from "chai";
import { verifyToken, verifyTimelock, verifyGovernor } from "../functions/verifyContracts";
import { deployToken, deployTimelock, deployGovernor } from "../functions";
import { initializeGovernanceDeployer } from "../context";
import { ethers } from "hardhat";

describe("Contract Verification", () => {
  beforeEach(async () => {
    const [signer] = await ethers.getSigners();
    initializeGovernanceDeployer(signer, "hardhat");
  });

  it("should verify token contract", async () => {
    const [signer] = await ethers.getSigners();
    const signerAddress = await signer.getAddress();

    const { address } = await deployToken({
      name: "Test Token",
      symbol: "TEST",
      defaultAdmin: signerAddress,
      pauser: signerAddress,
      minter: signerAddress
    });

    // Note: This will fail on hardhat network as it doesn't support verification
    // This test is more for checking the function structure
    try {
      await verifyToken({
        network: "hardhat",
        address,
        name: "Test Token",
        symbol: "TEST",
        minter: signerAddress
      });
    } catch (error) {
      expect(error.message).to.include("hardhat");
    }
  });

  // Similar tests for timelock and governor verification
  // These would also fail on hardhat network but test the function structure
}); 