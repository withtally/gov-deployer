import { expect } from "chai";
import { ethers } from "hardhat";
import { deployToken } from "../functions";
import { initializeGovernanceDeployer } from "../context";

describe("Token Deployment", () => {
  beforeEach(async () => {
    const [signer] = await ethers.getSigners();
    initializeGovernanceDeployer(signer, "hardhat");
  });

  it("should deploy token with correct parameters", async () => {
    const [signer] = await ethers.getSigners();
    const params = {
      name: "Test Token",
      symbol: "TEST",
      defaultAdmin: await signer.getAddress(),
      pauser: await signer.getAddress(),
      minter: await signer.getAddress()
    };

    const { contract, address } = await deployToken(params);
    
    expect(address).to.be.properAddress;
    expect(await contract.name()).to.equal(params.name);
    expect(await contract.symbol()).to.equal(params.symbol);
  });
}); 