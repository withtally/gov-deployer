import { z } from "zod";
import { isAddress } from "ethers";
import { ERC20Token, TimelockController, OZGovernor } from "../../typechain-types";

// Custom validator for Ethereum addresses
const addressSchema = z.string().refine(
  (val) => isAddress(val),
  (val) => ({ message: `${val} is not a valid Ethereum address` })
);

// Token deployment schema
export const tokenDeploySchema = z.object({
  name: z.string().min(1),
  symbol: z.string().min(1),
  defaultAdmin: addressSchema,
  pauser: addressSchema,
  minter: addressSchema,
});

// Timelock deployment schema
export const timelockDeploySchema = z.object({
  minDelay: z.number().nonnegative(),
  proposers: z.array(addressSchema),
  executors: z.array(addressSchema),
  admin: addressSchema,
});

// Governor deployment schema
export const governorDeploySchema = z.object({
  name: z.string().min(1),
  token: addressSchema,
  timelock: addressSchema,
  initialVotingDelay: z.number().nonnegative(),
  initialVotingPeriod: z.number().nonnegative(),
  initialProposalThreshold: z.bigint(),
  quorumNumeratorValue: z.number().min(0).max(100),
  initialVoteExtension: z.number().nonnegative(),
});

// Define return types
export type DeployTokenReturn = {
  contract: ERC20Token;
  address: string;
};

export type DeployTimelockReturn = {
  contract: TimelockController;
  address: string;
};

export type DeployGovernorReturn = {
  contract: OZGovernor;
  address: string;
};

// Export types
export type TokenDeployParams = z.infer<typeof tokenDeploySchema>;
export type TimelockDeployParams = z.infer<typeof timelockDeploySchema>;
export type GovernorDeployParams = z.infer<typeof governorDeploySchema>; 