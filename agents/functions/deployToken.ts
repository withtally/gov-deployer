import { TokenDeployParams, tokenDeploySchema, DeployTokenReturn } from "./schemas";
import { getGovernanceDeployer } from "../context";
import { ERC20Token__factory } from "../../typechain-types";

export async function deployToken(params: Omit<TokenDeployParams, 'signer'>): Promise<DeployTokenReturn> {
  tokenDeploySchema.parse(params);
  
  const deployer = getGovernanceDeployer();
  const signer = deployer.getSigner();

  const tokenFactory = new ERC20Token__factory(signer);
  const token = await tokenFactory.deploy(
    params.name,
    params.symbol,
    params.defaultAdmin,
    params.pauser,
    params.minter
  );
  
  await token.waitForDeployment();
  const address = await token.getAddress();

  // Store in context
  deployer.setDeployedContract('token', address, token);
  
  return { contract: token, address };
} 