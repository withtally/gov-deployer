import { GovernorDeployParams, governorDeploySchema, DeployGovernorReturn } from "./schemas";
import { getGovernanceDeployer } from "../context";
import { OZGovernor__factory } from "../../typechain-types";

export async function deployGovernor(params: Omit<GovernorDeployParams, 'signer'>): Promise<DeployGovernorReturn> {
  governorDeploySchema.parse(params);
  
  const deployer = getGovernanceDeployer();
  // Optional checks - warn but don't block
  if (!deployer.hasContract('token')) {
    console.warn('Warning: Deploying governor before token. This is valid but requires token address to be provided.');
  }
  if (!deployer.hasContract('timelock')) {
    console.warn('Warning: Deploying governor before timelock. This is valid but requires timelock address to be provided.');
  }
  const signer = deployer.getSigner();

  const governorFactory = new OZGovernor__factory(signer);
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

  deployer.setDeployedContract('governor', address, governor);
  
  return { contract: governor, address };
} 