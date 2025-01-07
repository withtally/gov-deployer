import { Signer } from "ethers";
import { ERC20Token__factory } from "../../typechain-types";
import { TokenDeployParams, tokenDeploySchema, DeployTokenReturn } from "./schemas";

export async function deployToken(params: TokenDeployParams): Promise<DeployTokenReturn> {
  // Validate inputs
  tokenDeploySchema.parse(params);

  const tokenFactory = new ERC20Token__factory(params.signer);
  const token = await tokenFactory.deploy(
    params.name,
    params.symbol,
    params.defaultAdmin,
    params.pauser,
    params.minter
  );
  
  // Wait for deployment and get address
  await token.waitForDeployment();
  const address = await token.getAddress();
  
  return { contract: token, address };
} 