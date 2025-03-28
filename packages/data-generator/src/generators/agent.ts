// @ts-ignore
const faker = require('faker');
import { Agent } from 'shared';
import { randomInt, randomSubset } from '../utils/random';
import { generateCorrelatedSegments } from './segments';
import {
  generateRevenue,
  generateAcquisitionCost,
  generateLifetimeValue,
  generateListingsCount,
  generateTimeToSell,
  generateResponseTime,
  generateConversionRate,
  generateSupportTickets,
  generateNpsScore,
  generateResolutionTime,
  generateChurnRisk,
  generateEngagementTrend,
  generateSatisfactionTrend,
  generatePriceSensitivity,
  generateGrowthRate
} from './metrics';

/**
 * Generate a single agent record
 */
export function generateAgent(index: number): Agent {
  // Generate basic information
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName);
  const phone = faker.phone.phoneNumber();
  
  // Generate segments with correlations
  const segments = generateCorrelatedSegments();
  const {
    experienceLevel,
    businessModel,
    specialization,
    platformEngagement,
    spendLevel,
    marketTypeLocation,
    marketTypeCondition
  } = segments;
  
  // Generate metrics with correlations
  const revenue = generateRevenue(experienceLevel, businessModel, specialization);
  const acquisitionCost = generateAcquisitionCost(spendLevel, businessModel);
  const estimatedLifetimeValue = generateLifetimeValue(revenue, experienceLevel, platformEngagement);
  
  const newListingsCount = generateListingsCount(experienceLevel, businessModel);
  const listingUpdatesCount = newListingsCount * randomInt(2, 6);
  const averageTimeToSell = generateTimeToSell(marketTypeCondition, marketTypeLocation, specialization);
  
  const averageResponseTime = generateResponseTime(platformEngagement, experienceLevel);
  const leadConversionRate = generateConversionRate(experienceLevel, platformEngagement);
  
  const supportTicketsCount = generateSupportTickets(platformEngagement, experienceLevel);
  const npsScore = generateNpsScore(platformEngagement, experienceLevel);
  const averageResolutionTime = generateResolutionTime(supportTicketsCount, platformEngagement);
  
  const churnRisk = generateChurnRisk(platformEngagement, spendLevel, experienceLevel);
  const engagementTrend = generateEngagementTrend(platformEngagement, churnRisk);
  const satisfactionTrend = generateSatisfactionTrend(npsScore, churnRisk);
  const priceSensitivity = generatePriceSensitivity(spendLevel, businessModel);
  
  const retentionProbability = 100 - churnRisk;
  const revenueAtRisk = Math.round(revenue * (churnRisk / 100));
  const growthRate = generateGrowthRate(experienceLevel, platformEngagement, marketTypeCondition);
  
  // Generate dates
  const joinDate = faker.date.past(5).toISOString();
  const lastActivityDate = faker.date.recent(30).toISOString();
  
  // Generate subscription and features
  const subscriptionTier = spendLevel === 'moreThan10k' ? 'premium' : 
                           spendLevel === 'lessThan10k' ? 'standard' : 'basic';
  
  const availableFeatures = [
    'listings', 'analytics', 'crm', 'marketing', 'leads', 'reports', 'mobile', 'api'
  ];
  
  const featureCount = spendLevel === 'moreThan10k' ? randomInt(6, 8) :
                       spendLevel === 'lessThan10k' ? randomInt(4, 6) :
                       randomInt(2, 4);
  
  const activeFeatures = randomSubset(availableFeatures, featureCount);
  
  return {
    id: `agent-${index}`,
    name: `${firstName} ${lastName}`,
    email,
    phone,
    experienceLevel,
    businessModel,
    specialization,
    platformEngagement,
    spendLevel,
    marketTypeLocation,
    marketTypeCondition,
    revenue,
    acquisitionCost,
    estimatedLifetimeValue,
    newListingsCount,
    listingUpdatesCount,
    averageTimeToSell,
    averageResponseTime,
    leadConversionRate,
    supportTicketsCount,
    npsScore,
    averageResolutionTime,
    churnRisk,
    engagementTrend,
    satisfactionTrend,
    priceSensitivity,
    retentionProbability,
    revenueAtRisk,
    growthRate,
    joinDate,
    lastActivityDate,
    subscriptionTier,
    activeFeatures
  };
}

/**
 * Generate multiple agent records
 */
export function generateAgents(count: number): Agent[] {
  console.log(`Generating ${count} agent records...`);
  
  const agents: Agent[] = [];
  
  for (let i = 0; i < count; i++) {
    if (i > 0 && i % 100 === 0) {
      console.log(`Generated ${i} agent records...`);
    }
    
    agents.push(generateAgent(i));
  }
  
  console.log(`Generated ${count} agent records.`);
  
  return agents;
}