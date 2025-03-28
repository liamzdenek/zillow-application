import { randomFactor, randomNormal } from './random';

/**
 * Generate a value correlated with a base value
 * @param baseValue The base value to correlate with (0-1)
 * @param correlation The correlation strength (0-1)
 * @param min The minimum possible value
 * @param max The maximum possible value
 * @returns A value correlated with the base value
 */
export function correlatedValue(
  baseValue: number,
  correlation: number,
  min: number,
  max: number
): number {
  // Normalize base value to 0-1 range if needed
  const normalizedBase = baseValue < 0 || baseValue > 1 
    ? (baseValue - min) / (max - min)
    : baseValue;
  
  // Generate a random value
  const random = Math.random();
  
  // Mix the base value and random value based on correlation strength
  const mixed = normalizedBase * correlation + random * (1 - correlation);
  
  // Scale back to the original range
  return min + mixed * (max - min);
}

/**
 * Generate a value inversely correlated with a base value
 * @param baseValue The base value to correlate with (0-1)
 * @param correlation The correlation strength (0-1)
 * @param min The minimum possible value
 * @param max The maximum possible value
 * @returns A value inversely correlated with the base value
 */
export function inverseCorrelatedValue(
  baseValue: number,
  correlation: number,
  min: number,
  max: number
): number {
  // Invert the base value
  const invertedBase = 1 - baseValue;
  
  // Use the regular correlation function with the inverted base
  return correlatedValue(invertedBase, correlation, min, max);
}

/**
 * Generate a value with a positive or negative correlation to a base value
 * @param baseValue The base value to correlate with
 * @param correlation The correlation strength (-1 to 1)
 * @param min The minimum possible value
 * @param max The maximum possible value
 * @returns A value correlated with the base value
 */
export function signedCorrelatedValue(
  baseValue: number,
  correlation: number,
  min: number,
  max: number
): number {
  if (correlation >= 0) {
    return correlatedValue(baseValue, Math.abs(correlation), min, max);
  } else {
    return inverseCorrelatedValue(baseValue, Math.abs(correlation), min, max);
  }
}

/**
 * Generate a value with multiple correlations
 * @param correlations Array of [value, weight] pairs
 * @param min The minimum possible value
 * @param max The maximum possible value
 * @returns A value correlated with the weighted inputs
 */
export function multiCorrelatedValue(
  correlations: [number, number][],
  min: number,
  max: number
): number {
  // Calculate the weighted sum of inputs
  const totalWeight = correlations.reduce((sum, [_, weight]) => sum + weight, 0);
  const weightedSum = correlations.reduce(
    (sum, [value, weight]) => sum + value * (weight / totalWeight),
    0
  );
  
  // Add some randomness
  const randomness = 0.2; // 20% randomness
  const random = Math.random();
  
  const result = weightedSum * (1 - randomness) + random * randomness;
  
  // Scale to the desired range
  return min + result * (max - min);
}

/**
 * Scale a value from one range to another
 * @param value The value to scale
 * @param fromMin The minimum of the original range
 * @param fromMax The maximum of the original range
 * @param toMin The minimum of the target range
 * @param toMax The maximum of the target range
 * @returns The scaled value
 */
export function scaleValue(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number {
  const normalizedValue = (value - fromMin) / (fromMax - fromMin);
  return toMin + normalizedValue * (toMax - toMin);
}