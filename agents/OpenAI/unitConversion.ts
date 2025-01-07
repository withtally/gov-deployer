import { type ChatCompletionCreateParams } from 'openai/resources/chat';
import { convertUnits, toWei, fromWei } from '../functions';

type OpenAIFunction = ChatCompletionCreateParams.Function;

export const convertUnitsFunction: OpenAIFunction = {
  name: "convertUnits",
  description: "Convert between different Ethereum units (wei, gwei, ether)",
  parameters: {
    type: "object",
    properties: {
      amount: {
        type: "string",
        description: "The amount to convert (as a string to handle large numbers)"
      },
      fromUnit: {
        type: "string",
        enum: ["wei", "gwei", "ether"],
        description: "The unit to convert from"
      },
      toUnit: {
        type: "string",
        enum: ["wei", "gwei", "ether"],
        description: "The unit to convert to"
      }
    },
    required: ["amount", "fromUnit", "toUnit"]
  }
};

export const toWeiFunction: OpenAIFunction = {
  name: "toWei",
  description: "Convert from any unit to wei (smallest Ethereum unit)",
  parameters: {
    type: "object",
    properties: {
      amount: {
        type: "string",
        description: "The amount to convert to wei (as a string to handle large numbers)"
      },
      fromUnit: {
        type: "string",
        enum: ["wei", "gwei", "ether"],
        description: "The unit to convert from",
        default: "ether"
      }
    },
    required: ["amount"]
  }
};

export const fromWeiFunction: OpenAIFunction = {
  name: "fromWei",
  description: "Convert from wei to any other Ethereum unit",
  parameters: {
    type: "object",
    properties: {
      amount: {
        type: "string",
        description: "The amount in wei to convert (as a string to handle large numbers)"
      },
      toUnit: {
        type: "string",
        enum: ["wei", "gwei", "ether"],
        description: "The unit to convert to",
        default: "ether"
      }
    },
    required: ["amount"]
  }
};

// Export all unit conversion functions as an array
export const unitConversionFunctions: OpenAIFunction[] = [
  convertUnitsFunction,
  toWeiFunction,
  fromWeiFunction
];

// Export the implementation functions
export { convertUnits, toWei, fromWei }; 