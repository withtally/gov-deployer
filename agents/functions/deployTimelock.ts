import { Signer } from "ethers";
import { TimelockController__factory } from "../../typechain-types";
import { TimelockDeployParams, timelockDeploySchema, DeployTimelockReturn } from "./schemas";

export async function deployTimelock(params: TimelockDeployParams): Promise<DeployTimelockReturn> {
  // Validate inputs
  timelockDeploySchema.parse(params);

  const timelockFactory = new TimelockController__factory(params.signer);
  const timelock = await timelockFactory.deploy(
    params.minDelay,
    params.proposers,
    params.executors,
    params.admin
  );
  await timelock.waitForDeployment();
  const address = await timelock.getAddress();
  
  return { contract: timelock, address };
} 