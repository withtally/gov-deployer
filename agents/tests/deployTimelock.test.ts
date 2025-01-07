import { expect } from "chai";
import { ethers } from "hardhat";
import { deployTimelock } from "../functions";
import { initializeGovernanceDeployer } from "../context";

describe("Timelock Deployment", () => {
  beforeEach(async () => {
    const [signer] = await ethers.getSigners();
    initializeGovernanceDeployer(signer, "hardhat");
  });

  it("should deploy timelock with correct parameters", async () => {
    const [signer] = await ethers.getSigners();
    const signerAddress = await signer.getAddress();
    
    const params = {
      minDelay: 60 * 60 * 24, // 1 day
      proposers: [signerAddress],
      executors: [signerAddress],
      admin: signerAddress
    };

    const { contract, address } = await deployTimelock(params);
    
    expect(address).to.be.properAddress;
    expect(await contract.getMinDelay()).to.equal(params.minDelay);
  });
}); 