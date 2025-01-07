import { formatUnits, parseUnits } from "ethers";

type EthUnit = 
  | "wei"
  | "gwei"
  | "ether"
  | number; // For arbitrary decimal places

/**
 * Convert between Ethereum units
 * @param amount The amount to convert
 * @param fromUnit The unit to convert from
 * @param toUnit The unit to convert to
 * @returns The converted amount as a string
 * 
 * @example
 * convertUnits("1", "ether", "wei") // "1000000000000000000"
 * convertUnits("1000000000000000000", "wei", "ether") // "1.0"
 * convertUnits("1000", "gwei", "ether") // "0.000000001"
 */
export function convertUnits(
  amount: string | number,
  fromUnit: EthUnit,
  toUnit: EthUnit
): string {
  try {
    // First convert to wei
    const inWei = parseUnits(amount.toString(), fromUnit);
    
    // Then convert from wei to target unit
    return formatUnits(inWei, toUnit);
  } catch (error) {
    throw new Error(`Failed to convert ${amount} from ${fromUnit} to ${toUnit}: ${error}`);
  }
}

/**
 * Convert to Wei
 * @param amount The amount to convert
 * @param fromUnit The unit to convert from
 * @returns The amount in wei as a string
 */
export function toWei(amount: string | number, fromUnit: EthUnit = "ether"): string {
  return convertUnits(amount, fromUnit, "wei");
}

/**
 * Convert from Wei
 * @param amount The amount in wei
 * @param toUnit The unit to convert to
 * @returns The converted amount as a string
 */
export function fromWei(amount: string | number, toUnit: EthUnit = "ether"): string {
  return convertUnits(amount, "wei", toUnit);
} 