# Backend Implementation Plan: Zillow Real Estate Professional Health Dashboard

## Overview

This document outlines the plan for implementing the backend services for the Zillow Real Estate Professional Health Dashboard. The backend will provide API endpoints for retrieving metrics, simulating interventions, and managing agent data.

## Architecture

The backend will follow a serverless architecture using:

- **Express.js**: Web framework for creating API endpoints
- **Serverless-http**: Adapter for running Express.js in AWS Lambda
- **DynamoDB**: NoSQL database for storing agent data
- **AWS Lambda**: Serverless compute service
- **API Gateway**: Managed service for API endpoints
- **Zod**: Schema validation library

## Implementation Steps

### 1. Set Up Project Structure

- [x] Create backend package in NX monorepo
- [x] Install required dependencies
- [x] Configure TypeScript and linting

### 2. Define API Endpoints

We'll implement the following API endpoints:

#### Core Endpoints

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/api/health` | GET | Health check endpoint | None | `HealthCheckResponse` |
| `/api/metrics` | GET | Get metrics for all agents or a specific segment | `MetricsRequest` | `MetricsResponse` |
| `/api/segments` | GET | Get available segments and their values | None | `SegmentsResponse` |
| `/api/interventions` | GET | Get available intervention types | None | `InterventionsResponse` |
| `/api/simulate` | POST | Simulate an intervention on a segment | `SimulationRequest` | `SimulationResponse` |

#### Additional Endpoints (if time permits)

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/api/agents` | GET | Get a list of agents | Query params for pagination | List of `Agent` objects |
| `/api/agents/:id` | GET | Get a specific agent | Agent ID | `Agent` object |

### 3. Implement DynamoDB Integration

- Create DynamoDB client utility
- Implement data access functions:
  - `getAllAgents()`: Retrieve all agents
  - `getAgentsBySegment(segmentType, segmentValue)`: Retrieve agents by segment
  - `getAgentById(id)`: Retrieve a specific agent

### 4. Implement Metrics Calculation

- Create metrics calculation service
- Implement functions for calculating:
  - Financial health metrics
  - Listing activity metrics
  - Lead management metrics
  - Customer satisfaction metrics
  - Early warning metrics
  - Revenue impact metrics
  - Segment breakdown

### 5. Implement Simulation Logic

- Create simulation service
- Implement functions for:
  - Calculating baseline metrics for a segment
  - Applying intervention effects
  - Calculating projected metrics
  - Calculating impact metrics

### 6. Implement API Endpoints

#### Health Check Endpoint

```typescript
app.get('/api/health', (req, res) => {
  const healthCheck: HealthCheckResponse = {
    status: 'healthy',
    dependencies: {
      dynamodb: 'connected' // Check actual connection
    },
    timestamp: new Date().toISOString()
  };
  
  res.json(healthCheck);
});
```

#### Segments Endpoint

```typescript
app.get('/api/segments', (req, res) => {
  const response: SegmentsResponse = {
    success: true,
    data: {
      experienceLevel: ['rookie', 'established', 'veteran'],
      businessModel: ['individual', 'team', 'brokerage'],
      specialization: ['residential', 'residentialInvestor', 'luxury', 'commercial'],
      platformEngagement: ['low', 'medium', 'high'],
      spendLevel: ['lessThan1k', 'lessThan10k', 'moreThan10k'],
      marketTypeLocation: ['suburban', 'urban', 'rural'],
      marketTypeCondition: ['warm', 'hot', 'cooling']
    }
  };
  
  res.json(response);
});
```

#### Interventions Endpoint

```typescript
app.get('/api/interventions', (req, res) => {
  const interventions: AvailableIntervention[] = [
    {
      id: 'discount-offer',
      name: 'Discount Offer',
      description: '10% discount on premium features',
      applicableSegments: ['spendLevel', 'platformEngagement']
    },
    {
      id: 'bundled-service',
      name: 'Bundled Service Package',
      description: 'Combine multiple services at a reduced price',
      applicableSegments: ['businessModel', 'specialization']
    },
    // ... other interventions
  ];
  
  const response: InterventionsResponse = {
    success: true,
    data: interventions
  };
  
  res.json(response);
});
```

#### Metrics Endpoint

```typescript
app.get('/api/metrics', async (req, res) => {
  try {
    // Validate request
    const schema = z.object({
      segmentType: z.enum(['experienceLevel', 'businessModel', 'specialization', 
                           'platformEngagement', 'spendLevel', 'marketTypeLocation', 
                           'marketTypeCondition']).optional(),
      segmentValue: z.string().optional()
    });
    
    const query = schema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Invalid request parameters',
          details: query.error
        }
      });
    }
    
    // Get agents based on segment filter
    let agents: Agent[];
    if (query.data.segmentType && query.data.segmentValue) {
      agents = await getAgentsBySegment(query.data.segmentType, query.data.segmentValue);
    } else {
      agents = await getAllAgents();
    }
    
    // Calculate metrics
    const metrics = calculateMetrics(agents);
    
    // Return response
    const response: MetricsResponse = {
      success: true,
      data: metrics
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching metrics'
      }
    });
  }
});
```

#### Simulation Endpoint

```typescript
app.post('/api/simulate', async (req, res) => {
  try {
    // Validate request
    const schema = z.object({
      interventionType: z.enum(['discount-offer', 'bundled-service', 'personalized-training',
                               'account-manager', 'usage-incentive', 'targeted-content',
                               'performance-review']),
      segmentType: z.enum(['experienceLevel', 'businessModel', 'specialization', 
                          'platformEngagement', 'spendLevel', 'marketTypeLocation', 
                          'marketTypeCondition']),
      segmentValue: z.string()
    });
    
    const body = schema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Invalid request parameters',
          details: body.error
        }
      });
    }
    
    // Get agents in the segment
    const agents = await getAgentsBySegment(body.data.segmentType, body.data.segmentValue);
    
    // Calculate current metrics
    const currentMetrics = calculateMetrics(agents);
    
    // Simulate intervention
    const simulationResult = simulateIntervention(
      body.data.interventionType,
      body.data.segmentType,
      body.data.segmentValue,
      currentMetrics
    );
    
    // Return response
    const response: SimulationResponse = {
      success: true,
      data: simulationResult
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error simulating intervention:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while simulating the intervention'
      }
    });
  }
});
```

### 7. Implement Middleware

- Add CORS middleware
- Add request logging middleware
- Add error handling middleware

```typescript
// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
});
```

### 8. Implement Serverless Handler

```typescript
// Create Express app
const app = express();

// Add middleware
app.use(express.json());
// ... other middleware

// Add routes
// ... route handlers

// For local development
if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

// Export serverless handler
export const handler = serverless(app);
```

### 9. Implement Utility Functions

#### Metrics Calculation

```typescript
function calculateMetrics(agents: Agent[]): Metrics {
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
  
  // ... calculate other metrics
  
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
```

#### Simulation Logic

```typescript
function simulateIntervention(
  interventionType: InterventionType,
  segmentType: SegmentType,
  segmentValue: string,
  currentMetrics: Metrics
): SimulationResult {
  // Get intervention details
  const interventionDetails = getInterventionDetails(interventionType);
  
  // Calculate impact based on intervention type and segment
  const impact = calculateInterventionImpact(
    interventionType,
    segmentType,
    segmentValue,
    currentMetrics
  );
  
  // Calculate projected metrics
  const projectedMetrics = {
    financialHealth: {
      averageRevenuePerAgent: currentMetrics.financialHealth.averageRevenuePerAgent + impact.financialHealth.averageRevenuePerAgent,
      customerAcquisitionCost: currentMetrics.financialHealth.customerAcquisitionCost + impact.financialHealth.customerAcquisitionCost,
      lifetimeValue: currentMetrics.financialHealth.lifetimeValue + impact.financialHealth.lifetimeValue
    },
    earlyWarning: {
      churnPredictionScore: currentMetrics.earlyWarning.churnPredictionScore + impact.earlyWarning.churnPredictionScore,
      engagementDeclinePercentage: currentMetrics.earlyWarning.engagementDeclinePercentage + impact.earlyWarning.engagementDeclinePercentage,
      satisfactionTrendValue: currentMetrics.earlyWarning.satisfactionTrendValue + impact.earlyWarning.satisfactionTrendValue,
      priceSensitivityScore: currentMetrics.earlyWarning.priceSensitivityScore + impact.earlyWarning.priceSensitivityScore
    },
    revenueImpact: {
      revenueRetentionRate: currentMetrics.revenueImpact.revenueRetentionRate + impact.revenueImpact.revenueRetentionRate,
      revenueAtRisk: currentMetrics.revenueImpact.revenueAtRisk + impact.revenueImpact.revenueAtRisk,
      revenueGrowthRate: currentMetrics.revenueImpact.revenueGrowthRate + impact.revenueImpact.revenueGrowthRate
    }
  };
  
  return {
    currentMetrics: {
      financialHealth: currentMetrics.financialHealth,
      earlyWarning: currentMetrics.earlyWarning,
      revenueImpact: currentMetrics.revenueImpact
    },
    projectedMetrics,
    impact,
    interventionDetails
  };
}
```

### 10. Testing

- Implement unit tests for utility functions
- Implement integration tests for API endpoints
- Test with sample data

### 11. Deployment

- Package the application for deployment
- Deploy to AWS Lambda using CDK
- Configure API Gateway

## Simulation Rules

For the simulation logic, we'll implement the following rules:

### Discount Offer (10% discount on premium features)
- **Financial Health**:
  - Average Revenue: -5% (short-term revenue decrease)
  - Lifetime Value: +10% (increased retention)
- **Early Warning**:
  - Churn Risk: -33% (significant reduction)
  - Engagement Decline: -38% (significant improvement)
  - Satisfaction Trend: +150% (major improvement)
  - Price Sensitivity: -29% (reduced sensitivity)
- **Revenue Impact**:
  - Retention Rate: +3% (improved retention)
  - Revenue at Risk: -40% (significant reduction)
  - Growth Rate: +60% (significant improvement)

### Bundled Service Package
- **Financial Health**:
  - Average Revenue: +15% (increased revenue)
  - Lifetime Value: +20% (increased retention and revenue)
- **Early Warning**:
  - Churn Risk: -20% (moderate reduction)
  - Engagement Decline: -25% (moderate improvement)
  - Satisfaction Trend: +100% (significant improvement)
  - Price Sensitivity: -15% (moderate reduction)
- **Revenue Impact**:
  - Retention Rate: +5% (improved retention)
  - Revenue at Risk: -30% (significant reduction)
  - Growth Rate: +40% (significant improvement)

### Personalized Training
- **Financial Health**:
  - Average Revenue: +5% (slight revenue increase)
  - Lifetime Value: +15% (increased retention)
- **Early Warning**:
  - Churn Risk: -25% (significant reduction)
  - Engagement Decline: -50% (major improvement)
  - Satisfaction Trend: +200% (major improvement)
  - Price Sensitivity: -10% (slight reduction)
- **Revenue Impact**:
  - Retention Rate: +4% (improved retention)
  - Revenue at Risk: -25% (significant reduction)
  - Growth Rate: +30% (moderate improvement)

### Account Manager Assignment
- **Financial Health**:
  - Average Revenue: +10% (moderate revenue increase)
  - Lifetime Value: +25% (significant increase)
- **Early Warning**:
  - Churn Risk: -40% (major reduction)
  - Engagement Decline: -30% (significant improvement)
  - Satisfaction Trend: +180% (major improvement)
  - Price Sensitivity: -5% (slight reduction)
- **Revenue Impact**:
  - Retention Rate: +7% (significant improvement)
  - Revenue at Risk: -45% (major reduction)
  - Growth Rate: +35% (significant improvement)

### Usage Incentive Program
- **Financial Health**:
  - Average Revenue: +8% (moderate revenue increase)
  - Lifetime Value: +12% (moderate increase)
- **Early Warning**:
  - Churn Risk: -15% (moderate reduction)
  - Engagement Decline: -60% (major improvement)
  - Satisfaction Trend: +120% (significant improvement)
  - Price Sensitivity: -20% (moderate reduction)
- **Revenue Impact**:
  - Retention Rate: +3% (moderate improvement)
  - Revenue at Risk: -20% (moderate reduction)
  - Growth Rate: +25% (moderate improvement)

### Targeted Content Delivery
- **Financial Health**:
  - Average Revenue: +3% (slight revenue increase)
  - Lifetime Value: +8% (slight increase)
- **Early Warning**:
  - Churn Risk: -10% (slight reduction)
  - Engagement Decline: -40% (significant improvement)
  - Satisfaction Trend: +80% (moderate improvement)
  - Price Sensitivity: -5% (slight reduction)
- **Revenue Impact**:
  - Retention Rate: +2% (slight improvement)
  - Revenue at Risk: -15% (moderate reduction)
  - Growth Rate: +15% (moderate improvement)

### Personalized Performance Review
- **Financial Health**:
  - Average Revenue: +12% (significant revenue increase)
  - Lifetime Value: +18% (significant increase)
- **Early Warning**:
  - Churn Risk: -30% (significant reduction)
  - Engagement Decline: -35% (significant improvement)
  - Satisfaction Trend: +150% (major improvement)
  - Price Sensitivity: -15% (moderate reduction)
- **Revenue Impact**:
  - Retention Rate: +5% (significant improvement)
  - Revenue at Risk: -35% (significant reduction)
  - Growth Rate: +45% (significant improvement)

## Segment-Specific Adjustments

The impact of interventions will be adjusted based on the segment:

### Experience Level
- **Rookie**: Higher impact on engagement and satisfaction, lower impact on revenue
- **Established**: Balanced impact across all metrics
- **Veteran**: Higher impact on revenue, lower impact on engagement

### Business Model
- **Individual**: Higher impact on satisfaction and churn, lower impact on revenue
- **Team**: Balanced impact across all metrics
- **Brokerage**: Higher impact on revenue, lower impact on satisfaction

### Specialization
- **Residential**: Balanced impact across all metrics
- **Residential Investor**: Higher impact on revenue, lower impact on satisfaction
- **Luxury**: Higher impact on revenue and lifetime value
- **Commercial**: Higher impact on lifetime value, lower impact on engagement

### Platform Engagement
- **Low**: Higher impact on engagement and churn, lower impact on revenue
- **Medium**: Balanced impact across all metrics
- **High**: Higher impact on revenue, lower impact on engagement

### Spend Level
- **Less Than $1k/yr**: Higher impact on engagement and satisfaction, lower impact on revenue
- **Less Than $10k/yr**: Balanced impact across all metrics
- **More Than $10k/yr**: Higher impact on revenue, lower impact on churn

### Market Type (Location)
- **Suburban**: Balanced impact across all metrics
- **Urban**: Higher impact on revenue, lower impact on satisfaction
- **Rural**: Higher impact on satisfaction, lower impact on revenue

### Market Type (Condition)
- **Warm**: Balanced impact across all metrics
- **Hot**: Higher impact on revenue, lower impact on churn
- **Cooling**: Higher impact on churn reduction, lower impact on revenue

## Timeline

| Task | Estimated Time | Priority |
|------|----------------|----------|
| Set up project structure | 30 minutes | High |
| Implement DynamoDB integration | 1 hour | High |
| Implement metrics calculation | 1 hour | High |
| Implement simulation logic | 1 hour | High |
| Implement API endpoints | 1 hour | High |
| Implement middleware | 30 minutes | Medium |
| Implement serverless handler | 30 minutes | Medium |
| Testing | 1 hour | Medium |
| Deployment | 30 minutes | Low |

## Conclusion

This implementation plan provides a comprehensive roadmap for developing the backend services for the Zillow Real Estate Professional Health Dashboard. By following this plan, we can ensure that all required functionality is implemented in a structured and efficient manner.