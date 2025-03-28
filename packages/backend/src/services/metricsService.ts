import { Agent, Metrics, SegmentBreakdown, SegmentType } from 'shared';
import { getAllAgents, getAgentsBySegment } from './dynamoDbService';

/**
 * Calculate metrics for a set of agents
 */
export function calculateMetrics(agents: Agent[]): Metrics {
  // Calculate financial health metrics
  const financialHealth = {
    averageRevenuePerAgent: calculateAverage(agents, 'revenue'),
    customerAcquisitionCost: calculateAverage(agents, 'acquisitionCost'),
    lifetimeValue: calculateAverage(agents, 'estimatedLifetimeValue')
  };

  // Calculate listing activity metrics
  const listingActivity = {
    newListings: calculateSum(agents, 'newListingsCount'),
    listingUpdates: calculateSum(agents, 'listingUpdatesCount'),
    timeToSell: calculateAverage(agents, 'averageTimeToSell')
  };

  // Calculate lead management metrics
  const leadManagement = {
    responseTime: calculateAverage(agents, 'averageResponseTime'),
    conversionRate: calculateAverage(agents, 'leadConversionRate')
  };

  // Calculate customer satisfaction metrics
  const customerSatisfaction = {
    supportTicketVolume: calculateSum(agents, 'supportTicketsCount'),
    supportNPS: calculateAverage(agents, 'npsScore'),
    supportResolutionTimes: calculateAverage(agents, 'averageResolutionTime')
  };

  // Calculate early warning metrics
  const earlyWarning = {
    churnPredictionScore: calculateAverage(agents, 'churnRisk'),
    engagementDeclinePercentage: calculateAverage(agents, 'engagementTrend', true),
    satisfactionTrendValue: calculateAverage(agents, 'satisfactionTrend'),
    priceSensitivityScore: calculateAverage(agents, 'priceSensitivity')
  };

  // Calculate revenue impact metrics
  const revenueImpact = {
    revenueRetentionRate: calculateAverage(agents, 'retentionProbability'),
    revenueAtRisk: calculateSum(agents, 'revenueAtRisk'),
    revenueGrowthRate: calculateAverage(agents, 'growthRate')
  };

  // Calculate segment breakdown
  const segmentBreakdown = calculateSegmentBreakdown(agents);

  return {
    financialHealth,
    listingActivity,
    leadManagement,
    customerSatisfaction,
    earlyWarning,
    revenueImpact,
    segmentBreakdown
  };
}

/**
 * Get metrics for all agents or a specific segment
 */
export async function getMetrics(segmentType?: SegmentType, segmentValue?: string): Promise<Metrics> {
  try {
    let agents: Agent[];

    if (segmentType && segmentValue) {
      agents = await getAgentsBySegment(segmentType, segmentValue);
    } else {
      agents = await getAllAgents();
    }

    return calculateMetrics(agents);
  } catch (error) {
    console.error('Error getting metrics:', error);
    throw error;
  }
}

/**
 * Calculate the average value of a property across agents
 */
function calculateAverage(agents: Agent[], property: keyof Agent, invertNegative = false): number {
  if (agents.length === 0) return 0;

  const sum = agents.reduce((total, agent) => {
    const value = agent[property] as number;
    return total + (value || 0);
  }, 0);

  const average = sum / agents.length;
  
  // For metrics where negative values indicate decline, we can invert to show the decline percentage
  return invertNegative && average < 0 ? Math.abs(average) : average;
}

/**
 * Calculate the sum of a property across agents
 */
function calculateSum(agents: Agent[], property: keyof Agent): number {
  return agents.reduce((total, agent) => {
    const value = agent[property] as number;
    return total + (value || 0);
  }, 0);
}

/**
 * Calculate segment breakdown percentages
 */
function calculateSegmentBreakdown(agents: Agent[]): SegmentBreakdown {
  const totalAgents = agents.length;
  if (totalAgents === 0) {
    return getEmptySegmentBreakdown();
  }

  // Count agents in each segment
  const experienceLevelCounts = countBySegment(agents, 'experienceLevel');
  const businessModelCounts = countBySegment(agents, 'businessModel');
  const specializationCounts = countBySegment(agents, 'specialization');
  const platformEngagementCounts = countBySegment(agents, 'platformEngagement');
  const spendLevelCounts = countBySegment(agents, 'spendLevel');
  const marketTypeLocationCounts = countBySegment(agents, 'marketTypeLocation');
  const marketTypeConditionCounts = countBySegment(agents, 'marketTypeCondition');

  // Convert counts to percentages
  return {
    experienceLevel: convertToPercentages(experienceLevelCounts, totalAgents),
    businessModel: convertToPercentages(businessModelCounts, totalAgents),
    specialization: convertToPercentages(specializationCounts, totalAgents),
    platformEngagement: convertToPercentages(platformEngagementCounts, totalAgents),
    spendLevel: convertToPercentages(spendLevelCounts, totalAgents),
    marketTypeLocation: convertToPercentages(marketTypeLocationCounts, totalAgents),
    marketTypeCondition: convertToPercentages(marketTypeConditionCounts, totalAgents)
  };
}

/**
 * Count agents by segment value
 */
function countBySegment(agents: Agent[], segmentType: keyof Agent): Record<string, number> {
  const counts: Record<string, number> = {};

  agents.forEach(agent => {
    const segmentValue = agent[segmentType] as string;
    if (segmentValue) {
      counts[segmentValue] = (counts[segmentValue] || 0) + 1;
    }
  });

  return counts;
}

/**
 * Convert counts to percentages
 */
function convertToPercentages(counts: Record<string, number>, total: number): Record<string, number> {
  const percentages: Record<string, number> = {};

  Object.entries(counts).forEach(([key, count]) => {
    percentages[key] = Math.round((count / total) * 100);
  });

  return percentages;
}

/**
 * Get empty segment breakdown with zero values
 */
function getEmptySegmentBreakdown(): SegmentBreakdown {
  return {
    experienceLevel: {
      rookie: 0,
      established: 0,
      veteran: 0
    },
    businessModel: {
      individual: 0,
      team: 0,
      brokerage: 0
    },
    specialization: {
      residential: 0,
      residentialInvestor: 0,
      luxury: 0,
      commercial: 0
    },
    platformEngagement: {
      low: 0,
      medium: 0,
      high: 0
    },
    spendLevel: {
      lessThan1k: 0,
      lessThan10k: 0,
      moreThan10k: 0
    },
    marketTypeLocation: {
      suburban: 0,
      urban: 0,
      rural: 0
    },
    marketTypeCondition: {
      warm: 0,
      hot: 0,
      cooling: 0
    }
  };
}