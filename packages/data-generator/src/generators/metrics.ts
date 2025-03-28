import { 
  ExperienceLevel, 
  BusinessModel, 
  Specialization, 
  PlatformEngagement, 
  SpendLevel, 
  MarketTypeLocation, 
  MarketTypeCondition 
} from 'shared';
import { randomFactor, randomInt } from '../utils/random';
import { correlatedValue, inverseCorrelatedValue, multiCorrelatedValue } from '../utils/correlation';

/**
 * Generate revenue based on segments
 */
export function generateRevenue(
  experienceLevel: ExperienceLevel,
  businessModel: BusinessModel,
  specialization: Specialization
): number {
  // Base revenue
  let base = 5000;
  
  // Adjust based on experience level
  if (experienceLevel === 'rookie') base *= 0.6;
  if (experienceLevel === 'established') base *= 1.0;
  if (experienceLevel === 'veteran') base *= 1.6;
  
  // Adjust based on business model
  if (businessModel === 'individual') base *= 0.8;
  if (businessModel === 'team') base *= 1.2;
  if (businessModel === 'brokerage') base *= 2.4;
  
  // Adjust based on specialization
  if (specialization === 'residential') base *= 0.9;
  if (specialization === 'residentialInvestor') base *= 1.2;
  if (specialization === 'luxury') base *= 2.0;
  if (specialization === 'commercial') base *= 2.4;
  
  // Add randomness
  return Math.round(base * randomFactor(0.8, 1.2));
}

/**
 * Generate acquisition cost based on segments
 */
export function generateAcquisitionCost(
  spendLevel: SpendLevel,
  businessModel: BusinessModel
): number {
  // Base acquisition cost
  let base = 1200;
  
  // Adjust based on spend level
  if (spendLevel === 'lessThan1k') base *= 0.8;
  if (spendLevel === 'lessThan10k') base *= 1.0;
  if (spendLevel === 'moreThan10k') base *= 1.3;
  
  // Adjust based on business model
  if (businessModel === 'individual') base *= 0.9;
  if (businessModel === 'team') base *= 1.1;
  if (businessModel === 'brokerage') base *= 1.4;
  
  // Add randomness
  return Math.round(base * randomFactor(0.85, 1.15));
}

/**
 * Generate lifetime value based on segments and revenue
 */
export function generateLifetimeValue(
  revenue: number,
  experienceLevel: ExperienceLevel,
  platformEngagement: PlatformEngagement
): number {
  // Base multiplier (years of expected relationship)
  let multiplier = 5;
  
  // Adjust based on experience level
  if (experienceLevel === 'rookie') multiplier *= 0.8;
  if (experienceLevel === 'established') multiplier *= 1.0;
  if (experienceLevel === 'veteran') multiplier *= 1.3;
  
  // Adjust based on platform engagement
  if (platformEngagement === 'low') multiplier *= 0.7;
  if (platformEngagement === 'medium') multiplier *= 1.0;
  if (platformEngagement === 'high') multiplier *= 1.4;
  
  // Calculate lifetime value
  const lifetimeValue = revenue * multiplier;
  
  // Add randomness
  return Math.round(lifetimeValue * randomFactor(0.9, 1.1));
}

/**
 * Generate listings count based on segments
 */
export function generateListingsCount(
  experienceLevel: ExperienceLevel,
  businessModel: BusinessModel
): number {
  // Base listings count
  let base = 10;
  
  // Adjust based on experience level
  if (experienceLevel === 'rookie') base *= 0.6;
  if (experienceLevel === 'established') base *= 1.0;
  if (experienceLevel === 'veteran') base *= 1.5;
  
  // Adjust based on business model
  if (businessModel === 'individual') base *= 0.8;
  if (businessModel === 'team') base *= 1.5;
  if (businessModel === 'brokerage') base *= 3.0;
  
  // Add randomness
  return Math.round(base * randomFactor(0.7, 1.3));
}

/**
 * Generate time to sell based on segments
 */
export function generateTimeToSell(
  marketTypeCondition: MarketTypeCondition,
  marketTypeLocation: MarketTypeLocation,
  specialization: Specialization
): number {
  // Base time to sell (days)
  let base = 30;
  
  // Adjust based on market condition
  if (marketTypeCondition === 'hot') base *= 0.6;
  if (marketTypeCondition === 'warm') base *= 1.0;
  if (marketTypeCondition === 'cooling') base *= 1.5;
  
  // Adjust based on market location
  if (marketTypeLocation === 'urban') base *= 0.8;
  if (marketTypeLocation === 'suburban') base *= 1.0;
  if (marketTypeLocation === 'rural') base *= 1.3;
  
  // Adjust based on specialization
  if (specialization === 'residential') base *= 0.9;
  if (specialization === 'residentialInvestor') base *= 1.1;
  if (specialization === 'luxury') base *= 1.3;
  if (specialization === 'commercial') base *= 1.5;
  
  // Add randomness
  return Math.round(base * randomFactor(0.8, 1.2));
}

/**
 * Generate response time based on segments
 */
export function generateResponseTime(
  platformEngagement: PlatformEngagement,
  experienceLevel: ExperienceLevel
): number {
  // Base response time (hours)
  let base = 4;
  
  // Adjust based on platform engagement
  if (platformEngagement === 'low') base *= 1.5;
  if (platformEngagement === 'medium') base *= 1.0;
  if (platformEngagement === 'high') base *= 0.7;
  
  // Adjust based on experience level
  if (experienceLevel === 'rookie') base *= 1.2;
  if (experienceLevel === 'established') base *= 1.0;
  if (experienceLevel === 'veteran') base *= 0.8;
  
  // Add randomness
  return parseFloat((base * randomFactor(0.8, 1.2)).toFixed(1));
}

/**
 * Generate conversion rate based on segments
 */
export function generateConversionRate(
  experienceLevel: ExperienceLevel,
  platformEngagement: PlatformEngagement
): number {
  // Base conversion rate (percentage)
  let base = 12;
  
  // Adjust based on experience level
  if (experienceLevel === 'rookie') base *= 0.7;
  if (experienceLevel === 'established') base *= 1.0;
  if (experienceLevel === 'veteran') base *= 1.3;
  
  // Adjust based on platform engagement
  if (platformEngagement === 'low') base *= 0.8;
  if (platformEngagement === 'medium') base *= 1.0;
  if (platformEngagement === 'high') base *= 1.2;
  
  // Add randomness
  return parseFloat((base * randomFactor(0.9, 1.1)).toFixed(1));
}

/**
 * Generate support tickets count based on segments
 */
export function generateSupportTickets(
  platformEngagement: PlatformEngagement,
  experienceLevel: ExperienceLevel
): number {
  // Base support tickets count
  let base = 5;
  
  // Adjust based on platform engagement
  if (platformEngagement === 'low') base *= 0.6;
  if (platformEngagement === 'medium') base *= 1.0;
  if (platformEngagement === 'high') base *= 1.4;
  
  // Adjust based on experience level
  if (experienceLevel === 'rookie') base *= 1.5;
  if (experienceLevel === 'established') base *= 1.0;
  if (experienceLevel === 'veteran') base *= 0.7;
  
  // Add randomness
  return Math.round(base * randomFactor(0.7, 1.3));
}

/**
 * Generate NPS score based on segments
 */
export function generateNpsScore(
  platformEngagement: PlatformEngagement,
  experienceLevel: ExperienceLevel
): number {
  // Base NPS score
  let base = 70;
  
  // Adjust based on platform engagement
  if (platformEngagement === 'low') base *= 0.8;
  if (platformEngagement === 'medium') base *= 1.0;
  if (platformEngagement === 'high') base *= 1.2;
  
  // Adjust based on experience level
  if (experienceLevel === 'rookie') base *= 0.9;
  if (experienceLevel === 'established') base *= 1.0;
  if (experienceLevel === 'veteran') base *= 1.1;
  
  // Add randomness and clamp to 0-100
  const nps = Math.round(base * randomFactor(0.9, 1.1));
  return Math.min(Math.max(nps, 0), 100);
}

/**
 * Generate resolution time based on segments
 */
export function generateResolutionTime(
  supportTicketsCount: number,
  platformEngagement: PlatformEngagement
): number {
  // Base resolution time (hours)
  let base = 8;
  
  // Adjust based on support tickets count (more tickets = longer resolution time)
  base *= (1 + (supportTicketsCount - 5) * 0.05);
  
  // Adjust based on platform engagement
  if (platformEngagement === 'low') base *= 1.2;
  if (platformEngagement === 'medium') base *= 1.0;
  if (platformEngagement === 'high') base *= 0.8;
  
  // Add randomness
  return parseFloat((base * randomFactor(0.8, 1.2)).toFixed(1));
}

/**
 * Generate churn risk based on segments
 */
export function generateChurnRisk(
  platformEngagement: PlatformEngagement,
  spendLevel: SpendLevel,
  experienceLevel: ExperienceLevel
): number {
  // Base churn risk (percentage)
  let base = 15;
  
  // Adjust based on platform engagement
  if (platformEngagement === 'low') base *= 1.8;
  if (platformEngagement === 'medium') base *= 1.0;
  if (platformEngagement === 'high') base *= 0.5;
  
  // Adjust based on spend level
  if (spendLevel === 'lessThan1k') base *= 1.3;
  if (spendLevel === 'lessThan10k') base *= 1.0;
  if (spendLevel === 'moreThan10k') base *= 0.7;
  
  // Adjust based on experience level
  if (experienceLevel === 'rookie') base *= 1.4;
  if (experienceLevel === 'established') base *= 1.0;
  if (experienceLevel === 'veteran') base *= 0.7;
  
  // Add randomness and clamp to 0-100
  const churnRisk = Math.round(base * randomFactor(0.8, 1.2));
  return Math.min(Math.max(churnRisk, 0), 100);
}

/**
 * Generate engagement trend based on segments
 */
export function generateEngagementTrend(
  platformEngagement: PlatformEngagement,
  churnRisk: number
): number {
  // Base engagement trend (percentage change)
  let base = 0;
  
  // Adjust based on platform engagement
  if (platformEngagement === 'low') base -= 15;
  if (platformEngagement === 'medium') base -= 5;
  if (platformEngagement === 'high') base += 5;
  
  // Adjust based on churn risk (higher churn risk = more negative engagement trend)
  base -= (churnRisk - 15) * 0.2;
  
  // Add randomness
  return parseFloat((base * randomFactor(0.8, 1.2)).toFixed(1));
}

/**
 * Generate satisfaction trend based on segments
 */
export function generateSatisfactionTrend(
  npsScore: number,
  churnRisk: number
): number {
  // Base satisfaction trend (percentage change)
  let base = 0;
  
  // Adjust based on NPS score
  base += (npsScore - 70) * 0.1;
  
  // Adjust based on churn risk (higher churn risk = more negative satisfaction trend)
  base -= (churnRisk - 15) * 0.15;
  
  // Add randomness
  return parseFloat((base * randomFactor(0.8, 1.2)).toFixed(1));
}

/**
 * Generate price sensitivity based on segments
 */
export function generatePriceSensitivity(
  spendLevel: SpendLevel,
  businessModel: BusinessModel
): number {
  // Base price sensitivity (0-100)
  let base = 35;
  
  // Adjust based on spend level
  if (spendLevel === 'lessThan1k') base *= 1.4;
  if (spendLevel === 'lessThan10k') base *= 1.0;
  if (spendLevel === 'moreThan10k') base *= 0.6;
  
  // Adjust based on business model
  if (businessModel === 'individual') base *= 1.2;
  if (businessModel === 'team') base *= 1.0;
  if (businessModel === 'brokerage') base *= 0.8;
  
  // Add randomness and clamp to 0-100
  const sensitivity = Math.round(base * randomFactor(0.9, 1.1));
  return Math.min(Math.max(sensitivity, 0), 100);
}

/**
 * Generate growth rate based on segments
 */
export function generateGrowthRate(
  experienceLevel: ExperienceLevel,
  platformEngagement: PlatformEngagement,
  marketTypeCondition: MarketTypeCondition
): number {
  // Base growth rate (percentage)
  let base = 5;
  
  // Adjust based on experience level
  if (experienceLevel === 'rookie') base *= 1.6;
  if (experienceLevel === 'established') base *= 1.0;
  if (experienceLevel === 'veteran') base *= 0.7;
  
  // Adjust based on platform engagement
  if (platformEngagement === 'low') base *= 0.7;
  if (platformEngagement === 'medium') base *= 1.0;
  if (platformEngagement === 'high') base *= 1.4;
  
  // Adjust based on market condition
  if (marketTypeCondition === 'hot') base *= 1.3;
  if (marketTypeCondition === 'warm') base *= 1.0;
  if (marketTypeCondition === 'cooling') base *= 0.7;
  
  // Add randomness
  return parseFloat((base * randomFactor(0.8, 1.2)).toFixed(1));
}