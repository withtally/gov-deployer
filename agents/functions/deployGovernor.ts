import { Signer } from "ethers";
import { OZGovernor__factory } from "../../typechain-types";
import { GovernorDeployParams, governorDeploySchema, DeployGovernorReturn } from "./schemas";

export async function deployGovernor(params: GovernorDeployParams): Promise<DeployGovernorReturn> {
  // Validate inputs
  governorDeploySchema.parse(params);

  const governorFactory = new OZGovernor__factory(params.signer);
  const governor = await governorFactory.deploy(
    params.name,
    params.token,
    params.timelock,
    params.initialVotingDelay,
    params.initialVotingPeriod,
    params.initialProposalThreshold,
    params.quorumNumeratorValue,
    params.initialVoteExtension
  );
  await governor.waitForDeployment();
  const address = await governor.getAddress();
  
  return { contract: governor, address };
} 