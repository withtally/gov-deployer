import { expect } from "chai";
import { ethers } from "hardhat";
import { deployGovernor, deployToken, deployTimelock } from "../functions";
import { initializeGovernanceDeployer } from "../context";
import { getExpectedContractAddress } from "../../helpers/expected_contract";

describe("Governor Deployment", () => {
  beforeEach(async () => {
    const [signer] = await ethers.getSigners();
    initializeGovernanceDeployer(signer, "hardhat");
  });

  it("should deploy governor with correct parameters and address", async () => {
    const [signer] = await ethers.getSigners();
    const signerAddress = await signer.getAddress();

    // Get expected addresses for all contracts
    const expectedTokenAddress = await getExpectedContractAddress(signer, 0);
    const expectedTimelockAddress = await getExpectedContractAddress(signer, 1);
    const expectedGovernorAddress = await getExpectedContractAddress(signer, 2);

    // Deploy token and verify address
    const { address: tokenAddress } = await deployToken({
      name: "Test Token",
      symbol: "TEST",
      defaultAdmin: signerAddress,
      pauser: signerAddress,
      minter: signerAddress
    });
    expect(tokenAddress).to.equal(expectedTokenAddress);

    // Deploy timelock and verify address
    const { address: timelockAddress } = await deployTimelock({
      minDelay: 60 * 60 * 24,
      proposers: [signerAddress],
      executors: [signerAddress],
      admin: signerAddress
    });
    expect(timelockAddress).to.equal(expectedTimelockAddress);

    // Deploy governor and verify address
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
    
    expect(address).to.equal(expectedGovernorAddress);
    expect(await contract.name()).to.equal(params.name);
    expect(await contract.token()).to.equal(tokenAddress);
    expect(await contract.timelock()).to.equal(timelockAddress);
  });
}); 