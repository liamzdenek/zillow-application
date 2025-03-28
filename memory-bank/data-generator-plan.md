# Data Generator Plan: Zillow Real Estate Professional Health Dashboard

## Overview

The data generator script will create realistic sample data for the Zillow Real Estate Professional Health Dashboard. It will generate 500 agent records with realistic attributes and metrics, then upload them to the DynamoDB table.

## Goals

1. Generate realistic agent data that reflects real-world patterns and correlations
2. Create meaningful segments with realistic distributions
3. Ensure metrics are correlated appropriately (e.g., high engagement correlates with lower churn risk)
4. Populate the DynamoDB table with the generated data
5. Make the script configurable and reusable

## Architecture

The data generator will be structured as follows:

```
packages/data-generator/
├── src/
│   ├── main.ts                 # Main entry point
│   ├── generators/             # Data generation functions
│   │   ├── agent.ts            # Agent record generator
│   │   ├── segments.ts         # Segment value generators
│   │   └── metrics.ts          # Metric value generators
│   ├── utils/                  # Utility functions
│   │   ├── random.ts           # Random value generation utilities
│   │   └── correlation.ts      # Functions for creating correlated values
│   └── services/               # External services
│       └── dynamoDbService.ts  # DynamoDB interaction service
```

## Implementation Plan

### 1. Main Script (main.ts)

The main script will:
- Parse command-line arguments for configuration
- Initialize the DynamoDB client
- Generate the specified number of agent records
- Upload the records to DynamoDB in batches
- Provide progress feedback and error handling

```typescript
// Main function
async function main() {
  // Parse command-line arguments
  const numAgents = parseInt(process.env.NUM_AGENTS || '500');
  const tableName = process.env.TABLE_NAME || 'ZillowAgents';
  const region = process.env.AWS_REGION || 'us-west-2';
  
  console.log(`Generating ${numAgents} agent records...`);
  
  // Generate agent records
  const agents = generateAgents(numAgents);
  
  console.log('Uploading agents to DynamoDB...');
  
  // Upload to DynamoDB
  try {
    await uploadAgents(agents, tableName, region);
    console.log('Data generation complete!');
  } catch (error) {
    console.error('Error uploading agents:', error);
    process.exit(1);
  }
}
```

### 2. Agent Generator (generators/agent.ts)

This module will generate complete agent records with all required attributes:

```typescript
function generateAgent(index: number): Agent {
  // Generate basic information
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  
  // Generate segments
  const experienceLevel = generateExperienceLevel();
  const businessModel = generateBusinessModel();
  // ... other segments
  
  // Generate metrics with correlations
  const revenue = generateRevenue(experienceLevel, businessModel, specialization);
  const churnRisk = generateChurnRisk(platformEngagement, spendLevel, experienceLevel);
  // ... other metrics
  
  return {
    id: `agent-${index}`,
    name: `${firstName} ${lastName}`,
    email: faker.internet.email(firstName, lastName),
    // ... other attributes
  };
}
```

### 3. Segment Generators (generators/segments.ts)

This module will generate segment values with realistic distributions:

```typescript
function generateExperienceLevel(): ExperienceLevel {
  return pickWeighted<ExperienceLevel>(
    ['rookie', 'established', 'veteran'],
    [0.25, 0.45, 0.3]
  );
}

function generateBusinessModel(): BusinessModel {
  return pickWeighted<BusinessModel>(
    ['individual', 'team', 'brokerage'],
    [0.6, 0.3, 0.1]
  );
}

// ... other segment generators
```

### 4. Metric Generators (generators/metrics.ts)

This module will generate metric values with realistic correlations:

```typescript
function generateRevenue(
  experienceLevel: ExperienceLevel,
  businessModel: BusinessModel,
  specialization: Specialization
): number {
  // Base revenue
  let base = 5000;
  
  // Adjust based on experience level
  if (experienceLevel === 'rookie') base *= 0.6;
  if (experienceLevel === 'veteran') base *= 1.6;
  
  // Adjust based on business model
  if (businessModel === 'team') base *= 1.2;
  if (businessModel === 'brokerage') base *= 2.4;
  
  // Adjust based on specialization
  if (specialization === 'luxury') base *= 2.0;
  if (specialization === 'commercial') base *= 2.4;
  
  // Add randomness
  return Math.round(base * randomFactor(0.8, 1.2));
}

// ... other metric generators
```

### 5. Random Utilities (utils/random.ts)

This module will provide utilities for generating random values:

```typescript
function randomFactor(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickWeighted<T>(options: T[], weights: number[]): T {
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

// ... other random utilities
```

### 6. Correlation Utilities (utils/correlation.ts)

This module will provide utilities for creating correlated values:

```typescript
function correlatedValue(
  baseValue: number,
  correlation: number,
  min: number,
  max: number
): number {
  // Generate a value correlated with baseValue
  const random = Math.random();
  const value = baseValue * correlation + (1 - correlation) * random;
  
  // Clamp to range
  return Math.min(Math.max(value, min), max);
}

// ... other correlation utilities
```

### 7. DynamoDB Service (services/dynamoDbService.ts)

This module will handle interactions with DynamoDB:

```typescript
async function uploadAgents(
  agents: Agent[],
  tableName: string,
  region: string
): Promise<void> {
  // Initialize DynamoDB client
  const client = new DynamoDBClient({ region });
  const dynamoDb = DynamoDBDocumentClient.from(client);
  
  // Process in batches of 25 (DynamoDB batch write limit)
  const batchSize = 25;
  const batches = [];
  
  for (let i = 0; i < agents.length; i += batchSize) {
    batches.push(agents.slice(i, i + batchSize));
  }
  
  console.log(`Uploading ${batches.length} batches of ${batchSize} agents...`);
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const params = {
      RequestItems: {
        [tableName]: batch.map(agent => ({
          PutRequest: {
            Item: agent
          }
        }))
      }
    };
    
    try {
      await dynamoDb.send(new BatchWriteCommand(params));
      console.log(`Batch ${i + 1}/${batches.length} uploaded successfully`);
    } catch (error) {
      console.error(`Error uploading batch ${i + 1}:`, error);
      throw error;
    }
  }
}
```

## Data Generation Strategy

### Agent Segments

We'll generate agent segments with the following distributions:

1. **Experience Level**:
   - Rookie: 25%
   - Established: 45%
   - Veteran: 30%

2. **Business Model**:
   - Individual: 60%
   - Team: 30%
   - Brokerage: 10%

3. **Specialization**:
   - Residential: 65%
   - Residential Investor: 15%
   - Luxury: 12%
   - Commercial: 8%

4. **Platform Engagement**:
   - Low: 20%
   - Medium: 50%
   - High: 30%

5. **Spend Level**:
   - Less Than $1k/yr: 40%
   - Less Than $10k/yr: 45%
   - More Than $10k/yr: 15%

6. **Market Type (Location)**:
   - Suburban: 55%
   - Urban: 35%
   - Rural: 10%

7. **Market Type (Condition)**:
   - Warm: 40%
   - Hot: 35%
   - Cooling: 25%

### Metric Correlations

We'll implement the following correlations between segments and metrics:

1. **Revenue**:
   - Higher for veterans, brokerages, luxury/commercial specializations
   - Lower for rookies, individuals, residential specializations

2. **Customer Acquisition Cost**:
   - Higher for rookies, luxury specialization
   - Lower for veterans, residential specialization

3. **Lifetime Value**:
   - Higher for veterans, high engagement, high spend
   - Lower for rookies, low engagement, low spend

4. **Listing Activity**:
   - Higher for veterans, teams/brokerages, hot markets
   - Lower for rookies, individuals, cooling markets

5. **Response Time**:
   - Better (lower) for high engagement, veterans
   - Worse (higher) for low engagement, rookies

6. **Conversion Rate**:
   - Higher for veterans, high engagement
   - Lower for rookies, low engagement

7. **Support Metrics**:
   - More tickets for rookies, low engagement
   - Higher NPS for high engagement, veterans
   - Faster resolution for high engagement

8. **Churn Risk**:
   - Higher for rookies, low engagement, low spend, cooling markets
   - Lower for veterans, high engagement, high spend, hot markets

9. **Engagement Trend**:
   - More negative for low engagement, high churn risk
   - More positive for high engagement, low churn risk

10. **Price Sensitivity**:
    - Higher for low spend, individuals
    - Lower for high spend, brokerages

### Random Variation

To make the data realistic, we'll add random variation to all metrics:

1. **Base Value**: Calculate a base value based on segments
2. **Correlation Factor**: Apply correlation factors between related metrics
3. **Random Factor**: Add a random factor (typically ±20%) to create natural variation

## Testing Strategy

1. **Visual Inspection**: Generate a small sample and inspect the values
2. **Statistical Analysis**: Verify that the distributions match our expectations
3. **Correlation Check**: Verify that correlated metrics show the expected relationships
4. **DynamoDB Upload Test**: Test uploading a small batch to DynamoDB

## Implementation Timeline

1. **Setup (30 minutes)**:
   - Create directory structure
   - Set up dependencies
   - Configure TypeScript

2. **Core Utilities (30 minutes)**:
   - Implement random utilities
   - Implement correlation utilities
   - Implement DynamoDB service

3. **Segment Generators (30 minutes)**:
   - Implement all segment generators
   - Test segment distributions

4. **Metric Generators (1 hour)**:
   - Implement all metric generators
   - Ensure proper correlations
   - Test metric distributions

5. **Agent Generator (30 minutes)**:
   - Implement complete agent generator
   - Test generated agents

6. **Main Script (30 minutes)**:
   - Implement main script
   - Add command-line argument parsing
   - Add progress reporting

7. **Testing and Refinement (30 minutes)**:
   - Test with small batches
   - Verify data quality
   - Make adjustments as needed

## Conclusion

This data generator will create realistic agent data for the Zillow Real Estate Professional Health Dashboard. By implementing proper correlations between segments and metrics, we'll ensure that the data reflects real-world patterns and provides meaningful insights when visualized in the dashboard.