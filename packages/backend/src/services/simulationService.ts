import { 
  InterventionType, 
  Metrics, 
  SegmentType, 
  SimulationResult 
} from 'shared';
import { getMetrics } from './metricsService';

/**
 * Simulate an intervention on a segment
 */
export async function simulateIntervention(
  interventionType: InterventionType,
  segmentType: SegmentType,
  segmentValue: string
): Promise<SimulationResult> {
  try {
    // Get current metrics for the segment
    const currentMetrics = await getMetrics(segmentType, segmentValue);
    
    // Extract the metrics we need for simulation
    const { financialHealth, earlyWarning, revenueImpact } = currentMetrics;
    
    // Calculate impact based on intervention type
    const impact = calculateInterventionImpact(
      interventionType,
      segmentType,
      segmentValue,
      currentMetrics
    );
    
    // Calculate projected metrics
    const projectedMetrics = {
      financialHealth: {
        averageRevenuePerAgent: financialHealth.averageRevenuePerAgent + impact.financialHealth.averageRevenuePerAgent,
        customerAcquisitionCost: financialHealth.customerAcquisitionCost + impact.financialHealth.customerAcquisitionCost,
        lifetimeValue: financialHealth.lifetimeValue + impact.financialHealth.lifetimeValue
      },
      earlyWarning: {
        churnPredictionScore: Math.max(0, earlyWarning.churnPredictionScore + impact.earlyWarning.churnPredictionScore),
        engagementDeclinePercentage: Math.max(0, earlyWarning.engagementDeclinePercentage + impact.earlyWarning.engagementDeclinePercentage),
        satisfactionTrendValue: earlyWarning.satisfactionTrendValue + impact.earlyWarning.satisfactionTrendValue,
        priceSensitivityScore: Math.max(0, earlyWarning.priceSensitivityScore + impact.earlyWarning.priceSensitivityScore)
      },
      revenueImpact: {
        revenueRetentionRate: Math.min(100, revenueImpact.revenueRetentionRate + impact.revenueImpact.revenueRetentionRate),
        revenueAtRisk: Math.max(0, revenueImpact.revenueAtRisk + impact.revenueImpact.revenueAtRisk),
        revenueGrowthRate: revenueImpact.revenueGrowthRate + impact.revenueImpact.revenueGrowthRate
      }
    };
    
    // Get intervention details
    const interventionDetails = getInterventionDetails(interventionType);
    
    return {
      currentMetrics: {
        financialHealth,
        earlyWarning,
        revenueImpact
      },
      projectedMetrics,
      impact,
      interventionDetails
    };
  } catch (error) {
    console.error('Error simulating intervention:', error);
    throw error;
  }
}

/**
 * Calculate the impact of an intervention on metrics
 */
function calculateInterventionImpact(
  interventionType: InterventionType,
  segmentType: SegmentType,
  segmentValue: string,
  currentMetrics: Metrics
): any {
  // Get current metrics for the financial health, early warning, and revenue impact
  const { financialHealth, earlyWarning, revenueImpact } = currentMetrics;
  
  // Initialize impact with zeros
  const impact = {
    financialHealth: {
      averageRevenuePerAgent: 0,
      customerAcquisitionCost: 0,
      lifetimeValue: 0
    },
    earlyWarning: {
      churnPredictionScore: 0,
      engagementDeclinePercentage: 0,
      satisfactionTrendValue: 0,
      priceSensitivityScore: 0
    },
    revenueImpact: {
      revenueRetentionRate: 0,
      revenueAtRisk: 0,
      revenueGrowthRate: 0
    }
  };
  
  // Apply intervention effects based on intervention type
  switch (interventionType) {
    case 'discount-offer':
      impact.financialHealth.averageRevenuePerAgent = -financialHealth.averageRevenuePerAgent * 0.05;
      impact.financialHealth.lifetimeValue = financialHealth.lifetimeValue * 0.1;
      impact.earlyWarning.churnPredictionScore = -earlyWarning.churnPredictionScore * 0.33;
      impact.earlyWarning.engagementDeclinePercentage = -earlyWarning.engagementDeclinePercentage * 0.38;
      impact.earlyWarning.satisfactionTrendValue = earlyWarning.satisfactionTrendValue * 1.5;
      impact.earlyWarning.priceSensitivityScore = -earlyWarning.priceSensitivityScore * 0.29;
      impact.revenueImpact.revenueRetentionRate = revenueImpact.revenueRetentionRate * 0.03;
      impact.revenueImpact.revenueAtRisk = -revenueImpact.revenueAtRisk * 0.4;
      impact.revenueImpact.revenueGrowthRate = revenueImpact.revenueGrowthRate * 0.6;
      break;
    case 'bundled-service':
      impact.financialHealth.averageRevenuePerAgent = financialHealth.averageRevenuePerAgent * 0.15;
      impact.financialHealth.lifetimeValue = financialHealth.lifetimeValue * 0.2;
      impact.earlyWarning.churnPredictionScore = -earlyWarning.churnPredictionScore * 0.2;
      impact.earlyWarning.engagementDeclinePercentage = -earlyWarning.engagementDeclinePercentage * 0.25;
      impact.earlyWarning.satisfactionTrendValue = earlyWarning.satisfactionTrendValue * 1.0;
      impact.earlyWarning.priceSensitivityScore = -earlyWarning.priceSensitivityScore * 0.15;
      impact.revenueImpact.revenueRetentionRate = revenueImpact.revenueRetentionRate * 0.05;
      impact.revenueImpact.revenueAtRisk = -revenueImpact.revenueAtRisk * 0.3;
      impact.revenueImpact.revenueGrowthRate = revenueImpact.revenueGrowthRate * 0.4;
      break;
    case 'personalized-training':
      impact.financialHealth.averageRevenuePerAgent = financialHealth.averageRevenuePerAgent * 0.05;
      impact.financialHealth.lifetimeValue = financialHealth.lifetimeValue * 0.15;
      impact.earlyWarning.churnPredictionScore = -earlyWarning.churnPredictionScore * 0.25;
      impact.earlyWarning.engagementDeclinePercentage = -earlyWarning.engagementDeclinePercentage * 0.5;
      impact.earlyWarning.satisfactionTrendValue = earlyWarning.satisfactionTrendValue * 2.0;
      impact.earlyWarning.priceSensitivityScore = -earlyWarning.priceSensitivityScore * 0.1;
      impact.revenueImpact.revenueRetentionRate = revenueImpact.revenueRetentionRate * 0.04;
      impact.revenueImpact.revenueAtRisk = -revenueImpact.revenueAtRisk * 0.25;
      impact.revenueImpact.revenueGrowthRate = revenueImpact.revenueGrowthRate * 0.3;
      break;
    case 'account-manager':
      impact.financialHealth.averageRevenuePerAgent = financialHealth.averageRevenuePerAgent * 0.1;
      impact.financialHealth.lifetimeValue = financialHealth.lifetimeValue * 0.25;
      impact.earlyWarning.churnPredictionScore = -earlyWarning.churnPredictionScore * 0.4;
      impact.earlyWarning.engagementDeclinePercentage = -earlyWarning.engagementDeclinePercentage * 0.3;
      impact.earlyWarning.satisfactionTrendValue = earlyWarning.satisfactionTrendValue * 1.8;
      impact.earlyWarning.priceSensitivityScore = -earlyWarning.priceSensitivityScore * 0.05;
      impact.revenueImpact.revenueRetentionRate = revenueImpact.revenueRetentionRate * 0.07;
      impact.revenueImpact.revenueAtRisk = -revenueImpact.revenueAtRisk * 0.45;
      impact.revenueImpact.revenueGrowthRate = revenueImpact.revenueGrowthRate * 0.35;
      break;
    case 'usage-incentive':
      impact.financialHealth.averageRevenuePerAgent = financialHealth.averageRevenuePerAgent * 0.08;
      impact.financialHealth.lifetimeValue = financialHealth.lifetimeValue * 0.12;
      impact.earlyWarning.churnPredictionScore = -earlyWarning.churnPredictionScore * 0.15;
      impact.earlyWarning.engagementDeclinePercentage = -earlyWarning.engagementDeclinePercentage * 0.6;
      impact.earlyWarning.satisfactionTrendValue = earlyWarning.satisfactionTrendValue * 1.2;
      impact.earlyWarning.priceSensitivityScore = -earlyWarning.priceSensitivityScore * 0.2;
      impact.revenueImpact.revenueRetentionRate = revenueImpact.revenueRetentionRate * 0.03;
      impact.revenueImpact.revenueAtRisk = -revenueImpact.revenueAtRisk * 0.2;
      impact.revenueImpact.revenueGrowthRate = revenueImpact.revenueGrowthRate * 0.25;
      break;
    case 'targeted-content':
      impact.financialHealth.averageRevenuePerAgent = financialHealth.averageRevenuePerAgent * 0.03;
      impact.financialHealth.lifetimeValue = financialHealth.lifetimeValue * 0.08;
      impact.earlyWarning.churnPredictionScore = -earlyWarning.churnPredictionScore * 0.1;
      impact.earlyWarning.engagementDeclinePercentage = -earlyWarning.engagementDeclinePercentage * 0.4;
      impact.earlyWarning.satisfactionTrendValue = earlyWarning.satisfactionTrendValue * 0.8;
      impact.earlyWarning.priceSensitivityScore = -earlyWarning.priceSensitivityScore * 0.05;
      impact.revenueImpact.revenueRetentionRate = revenueImpact.revenueRetentionRate * 0.02;
      impact.revenueImpact.revenueAtRisk = -revenueImpact.revenueAtRisk * 0.15;
      impact.revenueImpact.revenueGrowthRate = revenueImpact.revenueGrowthRate * 0.15;
      break;
    case 'performance-review':
      impact.financialHealth.averageRevenuePerAgent = financialHealth.averageRevenuePerAgent * 0.12;
      impact.financialHealth.lifetimeValue = financialHealth.lifetimeValue * 0.18;
      impact.earlyWarning.churnPredictionScore = -earlyWarning.churnPredictionScore * 0.3;
      impact.earlyWarning.engagementDeclinePercentage = -earlyWarning.engagementDeclinePercentage * 0.35;
      impact.earlyWarning.satisfactionTrendValue = earlyWarning.satisfactionTrendValue * 1.5;
      impact.earlyWarning.priceSensitivityScore = -earlyWarning.priceSensitivityScore * 0.15;
      impact.revenueImpact.revenueRetentionRate = revenueImpact.revenueRetentionRate * 0.05;
      impact.revenueImpact.revenueAtRisk = -revenueImpact.revenueAtRisk * 0.35;
      impact.revenueImpact.revenueGrowthRate = revenueImpact.revenueGrowthRate * 0.45;
      break;
  }
  
  // Adjust impact based on segment
  adjustImpactBySegment(impact, interventionType, segmentType, segmentValue);
  
  return impact;
}

/**
 * Adjust impact based on segment type and value
 */
function adjustImpactBySegment(
  impact: any,
  interventionType: InterventionType,
  segmentType: SegmentType,
  segmentValue: string
): void {
  // Apply segment-specific adjustments
  let multiplier = 1.0;
  
  switch (segmentType) {
    case 'experienceLevel':
      if (segmentValue === 'rookie') {
        // Rookies respond better to engagement and satisfaction improvements
        impact.earlyWarning.engagementDeclinePercentage *= 1.2;
        impact.earlyWarning.satisfactionTrendValue *= 1.2;
        impact.financialHealth.averageRevenuePerAgent *= 0.8;
      } else if (segmentValue === 'veteran') {
        // Veterans respond better to revenue improvements
        impact.financialHealth.averageRevenuePerAgent *= 1.2;
        impact.earlyWarning.engagementDeclinePercentage *= 0.8;
      }
      break;
    case 'businessModel':
      if (segmentValue === 'individual') {
        // Individuals respond better to satisfaction and churn improvements
        impact.earlyWarning.satisfactionTrendValue *= 1.2;
        impact.earlyWarning.churnPredictionScore *= 1.2;
        impact.financialHealth.averageRevenuePerAgent *= 0.8;
      } else if (segmentValue === 'brokerage') {
        // Brokerages respond better to revenue improvements
        impact.financialHealth.averageRevenuePerAgent *= 1.2;
        impact.earlyWarning.satisfactionTrendValue *= 0.8;
      }
      break;
    case 'platformEngagement':
      if (segmentValue === 'low') {
        // Low engagement users respond better to engagement and churn improvements
        impact.earlyWarning.engagementDeclinePercentage *= 1.3;
        impact.earlyWarning.churnPredictionScore *= 1.3;
        impact.financialHealth.averageRevenuePerAgent *= 0.7;
      } else if (segmentValue === 'high') {
        // High engagement users respond better to revenue improvements
        impact.financialHealth.averageRevenuePerAgent *= 1.3;
        impact.earlyWarning.engagementDeclinePercentage *= 0.7;
      }
      break;
    case 'spendLevel':
      if (segmentValue === 'lessThan1k') {
        // Low spenders respond better to engagement and satisfaction improvements
        impact.earlyWarning.engagementDeclinePercentage *= 1.3;
        impact.earlyWarning.satisfactionTrendValue *= 1.3;
        impact.financialHealth.averageRevenuePerAgent *= 0.7;
      } else if (segmentValue === 'moreThan10k') {
        // High spenders respond better to revenue improvements
        impact.financialHealth.averageRevenuePerAgent *= 1.3;
        impact.earlyWarning.churnPredictionScore *= 0.7;
      }
      break;
    // Add other segment types as needed
  }
  
  // Apply intervention-specific adjustments
  if (interventionType === 'discount-offer' && segmentType === 'spendLevel') {
    // Discount offers have stronger effect on spend level segments
    multiplier = 1.2;
  } else if (interventionType === 'personalized-training' && segmentType === 'experienceLevel') {
    // Training has stronger effect on experience level segments
    multiplier = 1.2;
  }
  
  // Apply the multiplier to all impact values
  if (multiplier !== 1.0) {
    Object.keys(impact).forEach(category => {
      Object.keys(impact[category]).forEach(metric => {
        impact[category][metric] *= multiplier;
      });
    });
  }
}

/**
 * Get intervention details
 */
function getInterventionDetails(interventionType: InterventionType): any {
  const interventionDetails = {
    'discount-offer': {
      name: 'Discount Offer',
      description: '10% discount on premium features',
      costToImplement: 25000,
      estimatedRoi: 2.5,
      timeToImpact: '1-3 months'
    },
    'bundled-service': {
      name: 'Bundled Service Package',
      description: 'Combine multiple services at a reduced price',
      costToImplement: 35000,
      estimatedRoi: 3.0,
      timeToImpact: '1-2 months'
    },
    'personalized-training': {
      name: 'Personalized Training',
      description: 'Custom training sessions for specific needs',
      costToImplement: 40000,
      estimatedRoi: 2.2,
      timeToImpact: '2-4 months'
    },
    'account-manager': {
      name: 'Account Manager Assignment',
      description: 'Dedicated account manager for premium support',
      costToImplement: 60000,
      estimatedRoi: 3.5,
      timeToImpact: '1-2 months'
    },
    'usage-incentive': {
      name: 'Usage Incentive Program',
      description: 'Rewards for platform engagement',
      costToImplement: 30000,
      estimatedRoi: 2.0,
      timeToImpact: '1-3 months'
    },
    'targeted-content': {
      name: 'Targeted Content Delivery',
      description: 'Personalized content based on interests',
      costToImplement: 15000,
      estimatedRoi: 1.8,
      timeToImpact: '2-4 months'
    },
    'performance-review': {
      name: 'Personalized Performance Review',
      description: 'In-depth analysis of agent performance',
      costToImplement: 45000,
      estimatedRoi: 2.8,
      timeToImpact: '2-3 months'
    }
  };
  
  return interventionDetails[interventionType];
}