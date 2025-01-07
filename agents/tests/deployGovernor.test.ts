import { expect } from "chai";
import { ethers } from "hardhat";
import { deployGovernor, deployToken, deployTimelock } from "../functions";
import { initializeGovernanceDeployer } from "../context";

describe("Governor Deployment", () => {
  beforeEach(async () => {
    const [signer] = await ethers.getSigners();
    initializeGovernanceDeployer(signer, "hardhat");
  });

  it("should deploy governor with correct parameters", async () => {
    const [signer] = await ethers.getSigners();
    const signerAddress = await signer.getAddress();

    // First deploy token and timelock
    const { address: tokenAddress } = await deployToken({
      name: "Test Token",
      symbol: "TEST",
      defaultAdmin: signerAddress,
      pauser: signerAddress,
      minter: signerAddress
    });

    const { address: timelockAddress } = await deployTimelock({
      minDelay: 60 * 60 * 24,
      proposers: [signerAddress],
      executors: [signerAddress],
      admin: signerAddress
    });

    const params = {
      name: "Test Governor",
      token: tokenAddress,
      timelock: timelockAddress,
      initialVotingDelay: 1,
      initialVotingPeriod: 50400,
      initialProposalThreshold: BigInt(0),
      quorumNumeratorValue: 4,
      initialVoteExtension: 1
    };

    const { contract, address } = await deployGovernor(params);
    
    expect(address).to.be.properAddress;
    expect(await contract.name()).to.equal(params.name);
    expect(await contract.token()).to.equal(tokenAddress);
    expect(await contract.timelock()).to.equal(timelockAddress);
  });
}); 