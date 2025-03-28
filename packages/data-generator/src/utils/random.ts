/**
 * Generate a random factor within a range
 */
export function randomFactor(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Pick a random item from an array based on weights
 */
export function pickWeighted<T>(options: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < options.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return options[i];
    }
  }
  
  return options[options.length - 1];
}

/**
 * Generate a normally distributed random number
 * Using Box-Muller transform
 */
export function randomNormal(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  
  return z0 * stdDev + mean;
}

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

/**
 * Generate a random boolean with a given probability of being true
 */
export function randomBoolean(probability = 0.5): boolean {
  return Math.random() < probability;
}

/**
 * Generate a random date between start and end dates
 */
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate a random element from an array
 */
export function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a random subset of an array
 */
export function randomSubset<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}