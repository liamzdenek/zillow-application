# API Contracts: Zillow Real Estate Professional Health Dashboard

This document outlines the API contracts for the Zillow Real Estate Professional Health Dashboard, including endpoints, request/response formats, and sample curl commands.

## Base URL

All API endpoints are relative to the base URL:
```
https://[api-id].execute-api.[region].amazonaws.com/prod
```

## Authentication

This one-day project does not implement authentication. In a production environment, appropriate authentication mechanisms would be added.

## Common Response Formats

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data specific to the endpoint
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error details (optional)
    }
  }
}
```

## Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_REQUEST` | The request format is invalid |
| `RESOURCE_NOT_FOUND` | The requested resource was not found |
| `INTERNAL_ERROR` | An internal server error occurred |
| `VALIDATION_ERROR` | Request validation failed |

## API Endpoints

### Health Check

#### GET /health

Checks the health of the API and its dependencies.

**Request Parameters**: None

**Response Format**:
```json
{
  "status": "healthy",
  "dependencies": {
    "dynamodb": "connected"
  },
  "timestamp": "2025-03-28T13:45:30.123Z"
}
```

**Sample Curl**:
```bash
curl https://[api-id].execute-api.[region].amazonaws.com/prod/health
```

### Metrics

#### GET /metrics

Retrieves metrics for all agents or a specific segment.

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| segmentType | string | No | Type of segment to filter by (e.g., "experienceLevel", "businessModel") |
| segmentValue | string | No | Value of the segment to filter by (e.g., "veteran", "team") |

**Response Format**:
```json
{
  "success": true,
  "data": {
    "financialHealth": {
      "averageRevenuePerAgent": 5000,
      "customerAcquisitionCost": 1200,
      "lifetimeValue": 25000
    },
    "listingActivity": {
      "newListings": 120,
      "listingUpdates": 450,
      "timeToSell": 28
    },
    "leadManagement": {
      "responseTime": 4.5,
      "conversionRate": 0.12
    },
    "customerSatisfaction": {
      "supportTicketVolume": 85,
      "supportNPS": 72,
      "supportResolutionTimes": 8.5
    },
    "earlyWarning": {
      "churnPredictionScore": 0.15,
      "engagementDeclinePercentage": 0.08,
      "satisfactionTrendValue": 0.02,
      "priceSensitivityScore": 0.35
    },
    "revenueImpact": {
      "revenueRetentionRate": 0.92,
      "revenueAtRisk": 125000,
      "revenueGrowthRate": 0.05
    },
    "segmentBreakdown": {
      "experienceLevel": {
        "rookie": 0.25,
        "established": 0.45,
        "veteran": 0.30
      },
      "businessModel": {
        "individual": 0.60,
        "team": 0.30,
        "brokerage": 0.10
      },
      "specialization": {
        "residential": 0.65,
        "residentialInvestor": 0.15,
        "luxury": 0.12,
        "commercial": 0.08
      },
      "platformEngagement": {
        "low": 0.20,
        "medium": 0.50,
        "high": 0.30
      },
      "spendLevel": {
        "lessThan1k": 0.40,
        "lessThan10k": 0.45,
        "moreThan10k": 0.15
      },
      "marketTypeLocation": {
        "suburban": 0.55,
        "urban": 0.35,
        "rural": 0.10
      },
      "marketTypeCondition": {
        "warm": 0.40,
        "hot": 0.35,
        "cooling": 0.25
      }
    }
  }
}
```

**Sample Curl**:
```bash
# Get metrics for all agents
curl https://[api-id].execute-api.[region].amazonaws.com/prod/metrics

# Get metrics for veteran agents
curl https://[api-id].execute-api.[region].amazonaws.com/prod/metrics?segmentType=experienceLevel&segmentValue=veteran
```

### Segment Options

#### GET /segments

Retrieves available segment types and their possible values.

**Request Parameters**: None

**Response Format**:
```json
{
  "success": true,
  "data": {
    "experienceLevel": ["rookie", "established", "veteran"],
    "businessModel": ["individual", "team", "brokerage"],
    "specialization": ["residential", "residentialInvestor", "luxury", "commercial"],
    "platformEngagement": ["low", "medium", "high"],
    "spendLevel": ["lessThan1k", "lessThan10k", "moreThan10k"],
    "marketTypeLocation": ["suburban", "urban", "rural"],
    "marketTypeCondition": ["warm", "hot", "cooling"]
  }
}
```

**Sample Curl**:
```bash
curl https://[api-id].execute-api.[region].amazonaws.com/prod/segments
```

### Intervention Simulation

#### POST /simulate

Simulates the impact of an intervention on a specific segment.

**Request Body**:
```json
{
  "interventionType": "discount-offer",
  "segmentType": "experienceLevel",
  "segmentValue": "veteran"
}
```

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| interventionType | string | Yes | Type of intervention to simulate (e.g., "discount-offer", "account-manager") |
| segmentType | string | Yes | Type of segment to target (e.g., "experienceLevel", "businessModel") |
| segmentValue | string | Yes | Value of the segment to target (e.g., "veteran", "team") |

**Response Format**:
```json
{
  "success": true,
  "data": {
    "currentMetrics": {
      "financialHealth": {
        "averageRevenuePerAgent": 5000,
        "customerAcquisitionCost": 1200,
        "lifetimeValue": 25000
      },
      "earlyWarning": {
        "churnPredictionScore": 0.15,
        "engagementDeclinePercentage": 0.08,
        "satisfactionTrendValue": 0.02,
        "priceSensitivityScore": 0.35
      },
      "revenueImpact": {
        "revenueRetentionRate": 0.92,
        "revenueAtRisk": 125000,
        "revenueGrowthRate": 0.05
      }
    },
    "projectedMetrics": {
      "financialHealth": {
        "averageRevenuePerAgent": 4750,
        "customerAcquisitionCost": 1200,
        "lifetimeValue": 27500
      },
      "earlyWarning": {
        "churnPredictionScore": 0.10,
        "engagementDeclinePercentage": 0.05,
        "satisfactionTrendValue": 0.05,
        "priceSensitivityScore": 0.25
      },
      "revenueImpact": {
        "revenueRetentionRate": 0.95,
        "revenueAtRisk": 75000,
        "revenueGrowthRate": 0.08
      }
    },
    "impact": {
      "financialHealth": {
        "averageRevenuePerAgent": -250,
        "customerAcquisitionCost": 0,
        "lifetimeValue": 2500
      },
      "earlyWarning": {
        "churnPredictionScore": -0.05,
        "engagementDeclinePercentage": -0.03,
        "satisfactionTrendValue": 0.03,
        "priceSensitivityScore": -0.10
      },
      "revenueImpact": {
        "revenueRetentionRate": 0.03,
        "revenueAtRisk": -50000,
        "revenueGrowthRate": 0.03
      }
    },
    "interventionDetails": {
      "type": "discount-offer",
      "description": "10% discount on premium features",
      "costToImplement": 25000,
      "estimatedROI": 2.5,
      "timeToImpact": "1-3 months"
    }
  }
}
```

**Sample Curl**:
```bash
curl -X POST https://[api-id].execute-api.[region].amazonaws.com/prod/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "interventionType": "discount-offer",
    "segmentType": "experienceLevel",
    "segmentValue": "veteran"
  }'
```

### Available Interventions

#### GET /interventions

Retrieves available intervention types and their descriptions.

**Request Parameters**: None

**Response Format**:
```json
{
  "success": true,
  "data": [
    {
      "id": "discount-offer",
      "name": "Discount Offer",
      "description": "Offer a temporary discount on Zillow services",
      "applicableSegments": ["all"]
    },
    {
      "id": "bundled-service",
      "name": "Bundled Service Package",
      "description": "Combine multiple services at a special rate",
      "applicableSegments": ["all"]
    },
    {
      "id": "personalized-training",
      "name": "Personalized Training",
      "description": "Provide customized training on Zillow platform features",
      "applicableSegments": ["all"]
    },
    {
      "id": "account-manager",
      "name": "Account Manager Assignment",
      "description": "Assign a dedicated account manager",
      "applicableSegments": ["spendLevel:moreThan10k", "businessModel:brokerage"]
    },
    {
      "id": "usage-incentive",
      "name": "Usage Incentive Program",
      "description": "Reward increased platform usage with benefits",
      "applicableSegments": ["platformEngagement:low", "platformEngagement:medium"]
    },
    {
      "id": "targeted-content",
      "name": "Targeted Content Delivery",
      "description": "Provide specialized content based on agent needs",
      "applicableSegments": ["all"]
    },
    {
      "id": "performance-review",
      "name": "Personalized Performance Review",
      "description": "Offer detailed analysis of agent performance on Zillow",
      "applicableSegments": ["all"]
    }
  ]
}
```

**Sample Curl**:
```bash
curl https://[api-id].execute-api.[region].amazonaws.com/prod/interventions
```

## Data Models

### Agent

```typescript
interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  
  // Segments
  experienceLevel: 'rookie' | 'established' | 'veteran';
  businessModel: 'individual' | 'team' | 'brokerage';
  specialization: 'residential' | 'residentialInvestor' | 'luxury' | 'commercial';
  platformEngagement: 'low' | 'medium' | 'high';
  spendLevel: 'lessThan1k' | 'lessThan10k' | 'moreThan10k';
  marketTypeLocation: 'suburban' | 'urban' | 'rural';
  marketTypeCondition: 'warm' | 'hot' | 'cooling';
  
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
```

### Metrics

```typescript
interface Metrics {
  financialHealth: {
    averageRevenuePerAgent: number;
    customerAcquisitionCost: number;
    lifetimeValue: number;
  };
  
  listingActivity: {
    newListings: number;
    listingUpdates: number;
    timeToSell: number;
  };
  
  leadManagement: {
    responseTime: number;
    conversionRate: number;
  };
  
  customerSatisfaction: {
    supportTicketVolume: number;
    supportNPS: number;
    supportResolutionTimes: number;
  };
  
  earlyWarning: {
    churnPredictionScore: number;
    engagementDeclinePercentage: number;
    satisfactionTrendValue: number;
    priceSensitivityScore: number;
  };
  
  revenueImpact: {
    revenueRetentionRate: number;
    revenueAtRisk: number;
    revenueGrowthRate: number;
  };
  
  segmentBreakdown: {
    experienceLevel: Record<string, number>;
    businessModel: Record<string, number>;
    specialization: Record<string, number>;
    platformEngagement: Record<string, number>;
    spendLevel: Record<string, number>;
    marketTypeLocation: Record<string, number>;
    marketTypeCondition: Record<string, number>;
  };
}
```

### SimulationResult

```typescript
interface SimulationResult {
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
  
  interventionDetails: {
    type: string;
    description: string;
    costToImplement: number;
    estimatedROI: number;
    timeToImpact: string;
  };
}
```

## Error Handling

### Validation Errors

If a request contains invalid parameters, the API will return a 400 Bad Request response with details about the validation errors:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "segmentType": "Must be one of: experienceLevel, businessModel, specialization, platformEngagement, spendLevel, marketTypeLocation, marketTypeCondition",
      "segmentValue": "Must be a valid value for the selected segment type"
    }
  }
}
```

### Resource Not Found

If a requested resource is not found, the API will return a 404 Not Found response:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found"
  }
}
```

### Internal Server Error

If an unexpected error occurs, the API will return a 500 Internal Server Error response:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "requestId": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

## Rate Limiting

This one-day project does not implement rate limiting. In a production environment, appropriate rate limiting would be added to protect the API from abuse.

## Versioning

This API does not implement versioning for this one-day project. In a production environment, API versioning would be implemented to ensure backward compatibility as the API evolves.