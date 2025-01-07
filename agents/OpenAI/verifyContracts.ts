import { type ChatCompletionCreateParams } from 'openai/resources/chat';
import { verifyToken, verifyTimelock, verifyGovernor } from '../functions/verifyContracts';

type OpenAIFunction = ChatCompletionCreateParams.Function;

export const verifyTokenFunction: OpenAIFunction = {
  name: "verifyToken",
  description: "Verify the deployed ERC20 token contract on Etherscan",
  parameters: {
    type: "object",
    properties: {
      network: {
        type: "string",
        description: "Network name (e.g., mainnet, sepolia)"
      },
      address: {
        type: "string",
        description: "Deployed token contract address"
      },
      name: {
        type: "string",
        description: "Token name"
      },
      symbol: {
        type: "string",
        description: "Token symbol"
      },
      minter: {
        type: "string",
        description: "Address with minting rights"
      }
    },
    required: ["network", "address", "name", "symbol", "minter"]
  }
};

export const verifyTimelockFunction: OpenAIFunction = {
  name: "verifyTimelock",
  description: "Verify the deployed Timelock controller contract on Etherscan",
  parameters: {
    type: "object",
    properties: {
      network: {
        type: "string",
        description: "Network name (e.g., mainnet, sepolia)"
      },
      address: {
        type: "string",
        description: "Deployed timelock contract address"
      },
      minDelay: {
        type: "number",
        description: "Minimum delay in seconds"
      },
      proposers: {
        type: "array",
        items: { type: "string" },
        description: "Array of proposer addresses"
      },
      executors: {
        type: "array",
        items: { type: "string" },
        description: "Array of executor addresses"
      },
      admin: {
        type: "string",
        description: "Admin address"
      }
    },
    required: ["network", "address", "minDelay", "proposers", "executors", "admin"]
  }
};

export const verifyGovernorFunction: OpenAIFunction = {
  name: "verifyGovernor",
  description: "Verify the deployed Governor contract on Etherscan",
  parameters: {
    type: "object",
    properties: {
      network: {
        type: "string",
        description: "Network name (e.g., mainnet, sepolia)"
      },
      address: {
        type: "string",
        description: "Deployed governor contract address"
      },
      name: {
        type: "string",
        description: "Governor name"
      },
      token: {
        type: "string",
        description: "Governance token contract address"
      },
      timelock: {
        type: "string",
        description: "Timelock controller contract address"
      },
      votingDelay: {
        type: "number",
        description: "Voting delay in blocks/seconds"
      },
      votingPeriod: {
        type: "number",
        description: "Voting period in blocks/seconds"
      },
      proposalThreshold: {
        type: "string",
        description: "Proposal threshold (as string due to bigint)"
      },
      quorumNumerator: {
        type: "number",
        description: "Quorum percentage (0-100)"
      },
      voteExtension: {
        type: "number",
        description: "Vote extension period"
      }
    },
    required: ["network", "address", "name", "token", "timelock", "votingDelay", "votingPeriod", "proposalThreshold", "quorumNumerator", "voteExtension"]
  }
};

export const verificationFunctions = [
  verifyTokenFunction,
  verifyTimelockFunction,
  verifyGovernorFunction
];

export { verifyToken, verifyTimelock, verifyGovernor }; 