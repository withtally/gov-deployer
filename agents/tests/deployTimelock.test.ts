import { expect } from "chai";
import { ethers } from "hardhat";
import { deployTimelock } from "../functions";
import { initializeGovernanceDeployer } from "../context";
import { getExpectedContractAddress } from "../../helpers/expected_contract";

describe("Timelock Deployment", () => {
  beforeEach(async () => {
    const [signer] = await ethers.getSigners();
    initializeGovernanceDeployer(signer, "hardhat");
  });

  it("should deploy timelock with correct parameters and address", async () => {
    const [signer] = await ethers.getSigners();
    const signerAddress = await signer.getAddress();
    const expectedAddress = await getExpectedContractAddress(signer, 0);
    
    const params = {
      minDelay: 60 * 60 * 24,
      proposers: [signerAddress],
      executors: [signerAddress],
      admin: signerAddress
    };

    const { contract, address } = await deployTimelock(params);
    
    expect(address).to.equal(expectedAddress);
    expect(await contract.getMinDelay()).to.equal(params.minDelay);
  });
}); 