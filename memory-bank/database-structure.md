# Database Structure: Zillow Real Estate Professional Health Dashboard

## Overview

This document outlines the database structure for the Zillow Real Estate Professional Health Dashboard. We're using Amazon DynamoDB as our NoSQL database to store agent data and metrics.

## Design Considerations

1. **Access Patterns**:
   - Retrieve all agents for metrics aggregation
   - Filter agents by segment type and value
   - Retrieve individual agent details
   - Update agent metrics

2. **Data Volume**:
   - For this demo, we'll store approximately 500 agent records
   - Each agent record contains multiple metrics and segment attributes
   - Total data size is relatively small, allowing for simple querying patterns

3. **Query Efficiency**:
   - Need to support filtering by segment type and value
   - Need to support aggregation of metrics across segments
   - No complex joins or relationships required

4. **Scalability**:
   - Current design optimized for demo purposes
   - Future enhancements would require more sophisticated indexing

## DynamoDB Table Design

### Table: `ZillowAgents`

#### Primary Key Structure
- **Partition Key**: `id` (String) - Unique identifier for each agent
- **Sort Key**: Not needed for this simple use case

#### Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| id | String | Unique identifier for the agent |
| name | String | Agent's full name |
| email | String | Agent's email address |
| phone | String | Agent's phone number |
| experienceLevel | String | "rookie", "established", or "veteran" |
| businessModel | String | "individual", "team", or "brokerage" |
| specialization | String | "residential", "residentialInvestor", "luxury", or "commercial" |
| platformEngagement | String | "low", "medium", or "high" |
| spendLevel | String | "lessThan1k", "lessThan10k", or "moreThan10k" |
| marketTypeLocation | String | "suburban", "urban", or "rural" |
| marketTypeCondition | String | "warm", "hot", or "cooling" |
| revenue | Number | Annual revenue from the agent |
| acquisitionCost | Number | Cost to acquire the agent |
| estimatedLifetimeValue | Number | Estimated lifetime value of the agent |
| newListingsCount | Number | Number of new listings |
| listingUpdatesCount | Number | Number of listing updates |
| averageTimeToSell | Number | Average time to sell in days |
| averageResponseTime | Number | Average response time in hours |
| leadConversionRate | Number | Lead conversion rate as a percentage |
| supportTicketsCount | Number | Number of support tickets |
| npsScore | Number | NPS score (0-100) |
| averageResolutionTime | Number | Average resolution time in hours |
| churnRisk | Number | Churn risk score (0-100) |
| engagementTrend | Number | Engagement trend as a percentage change |
| satisfactionTrend | Number | Satisfaction trend as a percentage change |
| priceSensitivity | Number | Price sensitivity score (0-100) |
| retentionProbability | Number | Retention probability as a percentage |
| revenueAtRisk | Number | Revenue at risk in dollars |
| growthRate | Number | Growth rate as a percentage |
| joinDate | String | ISO date string of when the agent joined |
| lastActivityDate | String | ISO date string of the agent's last activity |
| subscriptionTier | String | Subscription tier name |
| activeFeatures | List(String) | List of active features being used |

#### Secondary Indexes

For efficient querying by segment, we'll create Global Secondary Indexes (GSIs) for each segment type:

1. **GSI1: ExperienceLevelIndex**
   - Partition Key: `experienceLevel`
   - Sort Key: `id`

2. **GSI2: BusinessModelIndex**
   - Partition Key: `businessModel`
   - Sort Key: `id`

3. **GSI3: SpecializationIndex**
   - Partition Key: `specialization`
   - Sort Key: `id`

4. **GSI4: PlatformEngagementIndex**
   - Partition Key: `platformEngagement`
   - Sort Key: `id`

5. **GSI5: SpendLevelIndex**
   - Partition Key: `spendLevel`
   - Sort Key: `id`

6. **GSI6: MarketTypeLocationIndex**
   - Partition Key: `marketTypeLocation`
   - Sort Key: `id`

7. **GSI7: MarketTypeConditionIndex**
   - Partition Key: `marketTypeCondition`
   - Sort Key: `id`

## Access Patterns Implementation

### 1. Retrieve All Agents

To retrieve all agents for metrics aggregation, we'll perform a Scan operation on the table. Since our dataset is small (500 agents), a Scan operation is acceptable for this demo.

```typescript
const params = {
  TableName: 'ZillowAgents'
};

const result = await dynamoDb.scan(params).promise();
```

### 2. Filter Agents by Segment

To filter agents by segment type and value, we'll use the appropriate GSI:

```typescript
const params = {
  TableName: 'ZillowAgents',
  IndexName: `${segmentType}Index`, // e.g., "ExperienceLevelIndex"
  KeyConditionExpression: '#segmentType = :segmentValue',
  ExpressionAttributeNames: {
    '#segmentType': segmentType // e.g., "experienceLevel"
  },
  ExpressionAttributeValues: {
    ':segmentValue': segmentValue // e.g., "rookie"
  }
};

const result = await dynamoDb.query(params).promise();
```

### 3. Retrieve Individual Agent

To retrieve an individual agent by ID:

```typescript
const params = {
  TableName: 'ZillowAgents',
  Key: {
    id: agentId
  }
};

const result = await dynamoDb.get(params).promise();
```

### 4. Update Agent Metrics

To update an agent's metrics:

```typescript
const params = {
  TableName: 'ZillowAgents',
  Key: {
    id: agentId
  },
  UpdateExpression: 'SET revenue = :revenue, npsScore = :npsScore, ...',
  ExpressionAttributeValues: {
    ':revenue': newRevenue,
    ':npsScore': newNpsScore,
    // ...other metrics
  },
  ReturnValues: 'ALL_NEW'
};

const result = await dynamoDb.update(params).promise();
```

## Data Generation Strategy

For the demo, we'll generate 500 agent records with realistic data:

1. **Basic Information**:
   - Generate realistic names, emails, and phone numbers
   - Assign random join dates within the last 5 years
   - Set last activity dates within the last 30 days

2. **Segments**:
   - Distribute agents across segments with realistic proportions
   - Ensure correlation between related segments (e.g., veterans more likely to be high spenders)

3. **Metrics**:
   - Generate metrics with realistic ranges and distributions
   - Ensure correlation between related metrics (e.g., higher engagement correlates with lower churn risk)
   - Create meaningful patterns across segments (e.g., rookies have higher churn risk)

## CDK Infrastructure

The DynamoDB table and GSIs will be created using AWS CDK in the infrastructure package:

```typescript
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class ZillowDashboardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the DynamoDB table
    const agentsTable = new dynamodb.Table(this, 'ZillowAgents', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY // For demo purposes only
    });

    // Add GSIs for each segment type
    agentsTable.addGlobalSecondaryIndex({
      indexName: 'ExperienceLevelIndex',
      partitionKey: { name: 'experienceLevel', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'id', type: dynamodb.AttributeType.STRING }
    });

    // Add other GSIs similarly...
  }
}
```

## Future Enhancements

For a production system with larger data volumes, we would consider:

1. **Time-Based Data**: Add a timestamp attribute to track metrics over time
2. **Composite Keys**: Use composite sort keys for more complex queries
3. **Sparse Indexes**: Optimize GSIs for specific query patterns
4. **Data Partitioning**: Implement strategies to avoid hot partitions
5. **TTL**: Implement time-to-live for historical data
6. **Streams**: Use DynamoDB Streams for real-time processing
7. **DAX**: Implement DynamoDB Accelerator for caching

## Conclusion

This database design provides a simple but effective structure for the Zillow Real Estate Professional Health Dashboard demo. It supports all the required access patterns while remaining easy to implement and understand. The design can be extended for more complex requirements in the future.