import { writeFileSync } from 'fs';
import { z } from 'zod';
import { run } from "hardhat";

// Validation schemas
const verifyTokenSchema = z.object({
  network: z.string(),
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  minter: z.string()
});

const verifyTimelockSchema = z.object({
  network: z.string(),
  address: z.string(),
  minDelay: z.number(),
  proposers: z.array(z.string()),
  executors: z.array(z.string()),
  admin: z.string()
});

const verifyGovernorSchema = z.object({
  network: z.string(),
  address: z.string(),
  name: z.string(),
  token: z.string(),
  timelock: z.string(),
  votingDelay: z.number(),
  votingPeriod: z.number(),
  proposalThreshold: z.string(), // bigint as string
  quorumNumerator: z.number(),
  voteExtension: z.number()
});

export async function verifyToken(params: z.infer<typeof verifyTokenSchema>) {
  verifyTokenSchema.parse(params);
  
  try {
    await run("verify:verify", {
      address: params.address,
      constructorArguments: [
        params.name,
        params.symbol,
        params.minter,
        params.minter,
        params.minter
      ],
    });
    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export async function verifyTimelock(params: z.infer<typeof verifyTimelockSchema>) {
  verifyTimelockSchema.parse(params);
  
  try {
    await run("verify:verify", {
      address: params.address,
      contract: "contracts/TimelockController.sol:TimelockController",
      constructorArguments: [
        params.minDelay,
        params.proposers,
        params.executors,
        params.admin
      ],
    });
    return true;
  } catch (error) {
    console.error('Timelock verification failed:', error);
    return false;
  }
}

export async function verifyGovernor(params: z.infer<typeof verifyGovernorSchema>) {
  verifyGovernorSchema.parse(params);
  
  try {
    await run("verify:verify", {
      address: params.address,
      constructorArguments: [
        params.name,
        params.token,
        params.timelock,
        params.votingDelay,
        params.votingPeriod,
        params.proposalThreshold,
        params.quorumNumerator,
        params.voteExtension
      ],
    });
    return true;
  } catch (error) {
    console.error('Governor verification failed:', error);
    return false;
  }
} 