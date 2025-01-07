import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { z } from 'zod';

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
  
  const command = `npx hardhat verify --network ${params.network} ${params.address} "${params.name}" "${params.symbol}" ${params.minter} ${params.minter} ${params.minter}`;
  
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export async function verifyTimelock(params: z.infer<typeof verifyTimelockSchema>) {
  verifyTimelockSchema.parse(params);
  
  // Create arguments file
  const argsContent = `module.exports = [${params.minDelay},${JSON.stringify(params.proposers)},${JSON.stringify(params.executors)},"${params.admin}"];`;
  const argsFile = `arguments_${params.address}.js`;
  writeFileSync(argsFile, argsContent);
  
  const command = `npx hardhat verify --network ${params.network} --contract "contracts/TimelockController.sol:TimelockController" --constructor-args ${argsFile} ${params.address}`;
  
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('Timelock verification failed:', error);
    return false;
  }
}

export async function verifyGovernor(params: z.infer<typeof verifyGovernorSchema>) {
  verifyGovernorSchema.parse(params);
  
  const command = `npx hardhat verify --network ${params.network} ${params.address} "${params.name}" ${params.token} ${params.timelock} ${params.votingDelay} ${params.votingPeriod} ${params.proposalThreshold} ${params.quorumNumerator} ${params.voteExtension}`;
  
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('Governor verification failed:', error);
    return false;
  }
} 