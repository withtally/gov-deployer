import { OpenAIFunction } from './types';
import { deployToken, deployTimelock, deployGovernor } from '../functions';

export const deployTokenFunction: OpenAIFunction = {
  name: "deployToken",
  description: "Deploy an ERC20 token contract with governance capabilities. Returns the contract instance and address.",
  parameters: {
    type: "object",
    properties: {
      params: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the token"
          },
          symbol: {
            type: "string",
            description: "The symbol of the token"
          },
          defaultAdmin: {
            type: "string",
            description: "Ethereum address of the default admin"
          },
          pauser: {
            type: "string",
            description: "Ethereum address that can pause the token"
          },
          minter: {
            type: "string",
            description: "Ethereum address that can mint new tokens"
          }
        },
        required: ["name", "symbol", "defaultAdmin", "pauser", "minter"]
      }
    },
    required: ["params"]
  }
};

export const deployTimelockFunction: OpenAIFunction = {
  name: "deployTimelock",
  description: "Deploy a TimelockController contract for governance. Returns the contract instance and address.",
  parameters: {
    type: "object",
    properties: {
      params: {
        type: "object",
        properties: {
          minDelay: {
            type: "number",
            description: "Minimum delay in seconds before execution"
          },
          proposers: {
            type: "array",
            items: {
              type: "string"
            },
            description: "Array of Ethereum addresses that can propose"
          },
          executors: {
            type: "array",
            items: {
              type: "string"
            },
            description: "Array of Ethereum addresses that can execute"
          },
          admin: {
            type: "string",
            description: "Ethereum address of the admin"
          }
        },
        required: ["minDelay", "proposers", "executors", "admin"]
      }
    },
    required: ["params"]
  }
};

export const deployGovernorFunction: OpenAIFunction = {
  name: "deployGovernor",
  description: "Deploy a Governor contract for DAO governance. Returns the contract instance and address.",
  parameters: {
    type: "object",
    properties: {
      params: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the governor contract"
          },
          token: {
            type: "string",
            description: "Address of the governance token contract"
          },
          timelock: {
            type: "string",
            description: "Address of the timelock controller contract"
          },
          initialVotingDelay: {
            type: "number",
            description: "Initial voting delay in blocks/seconds"
          },
          initialVotingPeriod: {
            type: "number",
            description: "Initial voting period in blocks/seconds"
          },
          initialProposalThreshold: {
            type: "string",
            description: "Initial proposal threshold in token amount (as string due to bigint)"
          },
          quorumNumeratorValue: {
            type: "number",
            description: "The percentage of total supply required for quorum (0-100)"
          },
          initialVoteExtension: {
            type: "number",
            description: "Initial vote extension period in blocks/seconds"
          }
        },
        required: [
          "name",
          "token",
          "timelock",
          "initialVotingDelay",
          "initialVotingPeriod",
          "initialProposalThreshold",
          "quorumNumeratorValue",
          "initialVoteExtension"
        ]
      }
    },
    required: ["params"]
  }
};

export const governanceDeploymentFunctions = [
  deployTokenFunction,
  deployTimelockFunction,
  deployGovernorFunction
];

export { deployToken, deployTimelock, deployGovernor }; 