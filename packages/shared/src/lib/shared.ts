/**
 * Agent segment types
 */
export type ExperienceLevel = 'rookie' | 'established' | 'veteran';
export type BusinessModel = 'individual' | 'team' | 'brokerage';
export type Specialization = 'residential' | 'residentialInvestor' | 'luxury' | 'commercial';
export type PlatformEngagement = 'low' | 'medium' | 'high';
export type SpendLevel = 'lessThan1k' | 'lessThan10k' | 'moreThan10k';
export type MarketTypeLocation = 'suburban' | 'urban' | 'rural';
export type MarketTypeCondition = 'warm' | 'hot' | 'cooling';

/**
 * Intervention types
 */
export type InterventionType =
  | 'discount-offer'
  | 'bundled-service'
  | 'personalized-training'
  | 'account-manager'
  | 'usage-incentive'
  | 'targeted-content'
  | 'performance-review';

/**
 * Agent interface representing a real estate professional
 */
export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  
  // Segments
  experienceLevel: ExperienceLevel;
  businessModel: BusinessModel;
  specialization: Specialization;
  platformEngagement: PlatformEngagement;
  spendLevel: SpendLevel;
  marketTypeLocation: MarketTypeLocation;
  marketTypeCondition: MarketTypeCondition;
  
  // Financial metrics
  revenue: number;
  acquisitionCost: number;
  estimatedLifetimeValue: number;
  
  // Listing activity
  newListingsCount: number;
  listingUpdatesCount: number;
  averageTimeToSell: number;
  
  // Lead management
  averageResponseTime: number;
  leadConversionRate: number;
  
  // Customer satisfaction
  supportTicketsCount: number;
  npsScore: number;
  averageResolutionTime: number;
  
  // Early warning indicators
  churnRisk: number;
  engagementTrend: number;
  satisfactionTrend: number;
  priceSensitivity: number;
  
  // Revenue impact
  retentionProbability: number;
  revenueAtRisk: number;
  growthRate: number;
  
  // Additional data
  joinDate: string;
  lastActivityDate: string;
  subscriptionTier: string;
  activeFeatures: string[];
}

/**
 * Financial health metrics
 */
export interface FinancialHealthMetrics {
  averageRevenuePerAgent: number;
  customerAcquisitionCost: number;
  lifetimeValue: number;
}

/**
 * Listing activity metrics
 */
export interface ListingActivityMetrics {
  newListings: number;
  listingUpdates: number;
  timeToSell: number;
}

/**
 * Lead management metrics
 */
export interface LeadManagementMetrics {
  responseTime: number;
  conversionRate: number;
}

/**
 * Customer satisfaction metrics
 */
export interface CustomerSatisfactionMetrics {
  supportTicketVolume: number;
  supportNPS: number;
  supportResolutionTimes: number;
}

/**
 * Early warning metrics
 */
export interface EarlyWarningMetrics {
  churnPredictionScore: number;
  engagementDeclinePercentage: number;
  satisfactionTrendValue: number;
  priceSensitivityScore: number;
}

/**
 * Revenue impact metrics
 */
export interface RevenueImpactMetrics {
  revenueRetentionRate: number;
  revenueAtRisk: number;
  revenueGrowthRate: number;
}

/**
 * Segment breakdown
 */
export interface SegmentBreakdown {
  experienceLevel: Record<ExperienceLevel, number>;
  businessModel: Record<BusinessModel, number>;
  specialization: Record<Specialization, number>;
  platformEngagement: Record<PlatformEngagement, number>;
  spendLevel: Record<SpendLevel, number>;
  marketTypeLocation: Record<MarketTypeLocation, number>;
  marketTypeCondition: Record<MarketTypeCondition, number>;
}

/**
 * Aggregated metrics for a group of agents
 */
export interface Metrics {
  financialHealth: FinancialHealthMetrics;
  listingActivity: ListingActivityMetrics;
  leadManagement: LeadManagementMetrics;
  customerSatisfaction: CustomerSatisfactionMetrics;
  earlyWarning: EarlyWarningMetrics;
  revenueImpact: RevenueImpactMetrics;
  segmentBreakdown: SegmentBreakdown;
}

/**
 * Intervention details
 */
export interface InterventionDetails {
  type: InterventionType;
  description: string;
  costToImplement: number;
  estimatedROI: number;
  timeToImpact: string;
}

/**
 * Simulation result
 */
export interface SimulationResult {
  currentMetrics: {
    financialHealth: FinancialHealthMetrics;
    earlyWarning: EarlyWarningMetrics;
    revenueImpact: RevenueImpactMetrics;
  };
  
  projectedMetrics: {
    financialHealth: FinancialHealthMetrics;
    earlyWarning: EarlyWarningMetrics;
    revenueImpact: RevenueImpactMetrics;
  };
  
  impact: {
    financialHealth: FinancialHealthMetrics;
    earlyWarning: EarlyWarningMetrics;
    revenueImpact: RevenueImpactMetrics;
  };
  
  interventionDetails: InterventionDetails;
}

/**
 * Segment type for filtering
 */
export type SegmentType =
  | 'experienceLevel'
  | 'businessModel'
  | 'specialization'
  | 'platformEngagement'
  | 'spendLevel'
  | 'marketTypeLocation'
  | 'marketTypeCondition';

/**
 * Segment value based on segment type
 */
export type SegmentValue<T extends SegmentType> =
  T extends 'experienceLevel' ? ExperienceLevel :
  T extends 'businessModel' ? BusinessModel :
  T extends 'specialization' ? Specialization :
  T extends 'platformEngagement' ? PlatformEngagement :
  T extends 'spendLevel' ? SpendLevel :
  T extends 'marketTypeLocation' ? MarketTypeLocation :
  T extends 'marketTypeCondition' ? MarketTypeCondition :
  never;

/**
 * API request for metrics
 */
export interface MetricsRequest {
  segmentType?: SegmentType;
  segmentValue?: string;
}

/**
 * API response for metrics
 */
export interface MetricsResponse {
  success: boolean;
  data?: Metrics;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * API request for simulation
 */
export interface SimulationRequest {
  interventionType: InterventionType;
  segmentType: SegmentType;
  segmentValue: string;
}

/**
 * API response for simulation
 */
export interface SimulationResponse {
  success: boolean;
  data?: SimulationResult;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Available intervention
 */
export interface AvailableIntervention {
  id: InterventionType;
  name: string;
  description: string;
  applicableSegments: string[];
}

/**
 * API response for available interventions
 */
export interface InterventionsResponse {
  success: boolean;
  data?: AvailableIntervention[];
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * API response for available segments
 */
export interface SegmentsResponse {
  success: boolean;
  data?: Record<SegmentType, string[]>;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  dependencies: {
    dynamodb: 'connected' | 'disconnected';
  };
  timestamp: string;
}
