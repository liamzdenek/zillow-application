import { 
  ExperienceLevel, 
  BusinessModel, 
  Specialization, 
  PlatformEngagement, 
  SpendLevel, 
  MarketTypeLocation, 
  MarketTypeCondition 
} from 'shared';
import { pickWeighted } from '../utils/random';

/**
 * Generate an experience level segment value
 * Distribution:
 * - Rookie: 25%
 * - Established: 45%
 * - Veteran: 30%
 */
export function generateExperienceLevel(): ExperienceLevel {
  return pickWeighted<ExperienceLevel>(
    ['rookie', 'established', 'veteran'],
    [0.25, 0.45, 0.3]
  );
}

/**
 * Generate a business model segment value
 * Distribution:
 * - Individual: 60%
 * - Team: 30%
 * - Brokerage: 10%
 */
export function generateBusinessModel(): BusinessModel {
  return pickWeighted<BusinessModel>(
    ['individual', 'team', 'brokerage'],
    [0.6, 0.3, 0.1]
  );
}

/**
 * Generate a specialization segment value
 * Distribution:
 * - Residential: 65%
 * - Residential Investor: 15%
 * - Luxury: 12%
 * - Commercial: 8%
 */
export function generateSpecialization(): Specialization {
  return pickWeighted<Specialization>(
    ['residential', 'residentialInvestor', 'luxury', 'commercial'],
    [0.65, 0.15, 0.12, 0.08]
  );
}

/**
 * Generate a platform engagement segment value
 * Distribution:
 * - Low: 20%
 * - Medium: 50%
 * - High: 30%
 */
export function generatePlatformEngagement(): PlatformEngagement {
  return pickWeighted<PlatformEngagement>(
    ['low', 'medium', 'high'],
    [0.2, 0.5, 0.3]
  );
}

/**
 * Generate a spend level segment value
 * Distribution:
 * - Less Than $1k/yr: 40%
 * - Less Than $10k/yr: 45%
 * - More Than $10k/yr: 15%
 */
export function generateSpendLevel(): SpendLevel {
  return pickWeighted<SpendLevel>(
    ['lessThan1k', 'lessThan10k', 'moreThan10k'],
    [0.4, 0.45, 0.15]
  );
}

/**
 * Generate a market type location segment value
 * Distribution:
 * - Suburban: 55%
 * - Urban: 35%
 * - Rural: 10%
 */
export function generateMarketTypeLocation(): MarketTypeLocation {
  return pickWeighted<MarketTypeLocation>(
    ['suburban', 'urban', 'rural'],
    [0.55, 0.35, 0.1]
  );
}

/**
 * Generate a market type condition segment value
 * Distribution:
 * - Warm: 40%
 * - Hot: 35%
 * - Cooling: 25%
 */
export function generateMarketTypeCondition(): MarketTypeCondition {
  return pickWeighted<MarketTypeCondition>(
    ['warm', 'hot', 'cooling'],
    [0.4, 0.35, 0.25]
  );
}

/**
 * Generate correlated segments
 * Some segments are correlated with each other in the real world
 */
export function generateCorrelatedSegments() {
  // Start with random segments
  const experienceLevel = generateExperienceLevel();
  let businessModel = generateBusinessModel();
  let platformEngagement = generatePlatformEngagement();
  let spendLevel = generateSpendLevel();
  
  // Apply correlations
  
  // Veterans are more likely to be in teams or brokerages
  if (experienceLevel === 'veteran') {
    if (Math.random() < 0.4) {
      businessModel = Math.random() < 0.7 ? 'team' : 'brokerage';
    }
  }
  
  // Rookies are more likely to be individuals
  if (experienceLevel === 'rookie') {
    if (Math.random() < 0.8) {
      businessModel = 'individual';
    }
  }
  
  // Veterans and teams/brokerages are more likely to have high engagement
  if (experienceLevel === 'veteran' || businessModel !== 'individual') {
    if (Math.random() < 0.5) {
      platformEngagement = 'high';
    } else if (Math.random() < 0.7) {
      platformEngagement = 'medium';
    }
  }
  
  // Rookies and individuals are more likely to have low/medium engagement
  if (experienceLevel === 'rookie' && businessModel === 'individual') {
    if (Math.random() < 0.4) {
      platformEngagement = 'low';
    } else if (Math.random() < 0.8) {
      platformEngagement = 'medium';
    }
  }
  
  // Veterans, teams/brokerages, and high engagement are more likely to spend more
  if ((experienceLevel === 'veteran' || businessModel !== 'individual' || platformEngagement === 'high') && Math.random() < 0.6) {
    spendLevel = Math.random() < 0.3 ? 'moreThan10k' : 'lessThan10k';
  }
  
  // Rookies, individuals, and low engagement are more likely to spend less
  if ((experienceLevel === 'rookie' || businessModel === 'individual' || platformEngagement === 'low') && Math.random() < 0.7) {
    spendLevel = Math.random() < 0.6 ? 'lessThan1k' : 'lessThan10k';
  }
  
  // Generate the remaining segments without correlations
  const specialization = generateSpecialization();
  const marketTypeLocation = generateMarketTypeLocation();
  const marketTypeCondition = generateMarketTypeCondition();
  
  return {
    experienceLevel,
    businessModel,
    specialization,
    platformEngagement,
    spendLevel,
    marketTypeLocation,
    marketTypeCondition
  };
}