import { TimelockDeployParams, timelockDeploySchema, DeployTimelockReturn } from "./schemas";
import { getGovernanceDeployer } from "../context";
import { TimelockController__factory } from "../../typechain-types";

export async function deployTimelock(params: Omit<TimelockDeployParams, 'signer'>): Promise<DeployTimelockReturn> {
  timelockDeploySchema.parse(params);
  
  const deployer = getGovernanceDeployer();
  // Optional check for token - warn but don't block
  if (!deployer.hasContract('token')) {
    console.warn('Warning: Deploying timelock before token. This is valid but may require additional setup later.');
  }
  const signer = deployer.getSigner();

  const timelockFactory = new TimelockController__factory(signer);
  const timelock = await timelockFactory.deploy(
    params.minDelay,
    params.proposers,
    params.executors,
    params.admin
  );
  
  await timelock.waitForDeployment();
  const address = await timelock.getAddress();

  deployer.setDeployedContract('timelock', address, timelock);
  
  return { contract: timelock, address };
} 