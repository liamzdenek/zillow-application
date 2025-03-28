# System Patterns: Zillow Real Estate Professional Health Dashboard

## System Architecture

### High-Level Architecture

The Zillow Real Estate Professional Health Dashboard follows a modern cloud-native architecture with the following components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  API Backend    │────▶│    DynamoDB     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                        │
        │                       │                        │
        ▼                       ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   CloudFront    │     │   API Gateway   │     │  Data Populator │
│                 │     │                 │     │     Script      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Component Breakdown

1. **Frontend (React Application)**
   - Hosted in S3 and distributed via CloudFront
   - Implements the dashboard UI and simulation interface
   - Communicates with the backend API for data retrieval and simulation

2. **Backend API (Lambda Functions)**
   - Exposed via API Gateway
   - Retrieves agent data from DynamoDB
   - Performs aggregations and calculations
   - Implements simulation logic with hardcoded rules

3. **Data Store (DynamoDB)**
   - Single table design for storing agent data and metrics
   - Optimized for batch retrieval of all agents

4. **Data Populator**
   - Script to generate and load sample agent data into DynamoDB

### Request Flow

#### Dashboard View
1. User accesses the dashboard through CloudFront
2. Frontend makes API request to the backend
3. Backend retrieves all agents from DynamoDB using BatchGetItem
4. Backend performs necessary aggregations based on requested filters
5. Frontend renders the metrics and visualizations

#### Simulation Flow
1. User selects a segment and intervention on the simulation page
2. Frontend makes API request to the backend with segment and intervention parameters
3. Backend retrieves relevant agents from DynamoDB
4. Backend applies simulation rules to calculate projected impact
5. Frontend displays the simulation results

## Key Technical Decisions

### Single Table Design
We've chosen a simple single-table design for DynamoDB to store agent data and their metrics. This approach:
- Simplifies the data model for a one-day project
- Allows for efficient batch retrieval of all agents
- Supports the required segmentation and filtering

### In-Memory Aggregation
Rather than pre-computing aggregations in the database, we're performing aggregations in memory in the backend. This approach:
- Provides flexibility for ad-hoc segment filtering
- Simplifies the data model
- Is feasible given the limited dataset size (500 agents)

### Hardcoded Simulation Rules
Simulation rules are hardcoded in the backend rather than stored in the database. This approach:
- Simplifies implementation for a one-day project
- Allows for more complex rule logic if needed
- Makes rule changes a code deployment rather than a data update

### Segment-Based Filtering
The dashboard implements segment-based filtering that recalculates all metrics based on the selected segment. This approach:
- Provides a consistent user experience
- Allows for easy comparison between segments
- Simplifies the UI implementation

### Separate Simulation Page
The simulation functionality is implemented on a separate page rather than integrated into the main dashboard. This approach:
- Creates a clearer separation of concerns
- Simplifies the UI for each use case
- Allows for more focused user experiences

## Design Patterns

### Repository Pattern
The backend implements a repository pattern to abstract data access:
```typescript
// Example repository pattern implementation
class AgentRepository {
  async getAllAgents(): Promise<Agent[]> {
    // Implementation to retrieve all agents from DynamoDB
  }
  
  async getAgentsBySegment(segmentType: string, segmentValue: string): Promise<Agent[]> {
    // Implementation to filter agents by segment
  }
}
```

### Service Pattern
Business logic is encapsulated in service classes:
```typescript
// Example service pattern implementation
class MetricsService {
  constructor(private agentRepository: AgentRepository) {}
  
  async calculateMetrics(segmentType?: string, segmentValue?: string): Promise<Metrics> {
    const agents = segmentType && segmentValue
      ? await this.agentRepository.getAgentsBySegment(segmentType, segmentValue)
      : await this.agentRepository.getAllAgents();
    
    // Calculate metrics based on agents
    return {
      financialHealth: this.calculateFinancialHealthMetrics(agents),
      listingActivity: this.calculateListingActivityMetrics(agents),
      // Other metric calculations
    };
  }
  
  private calculateFinancialHealthMetrics(agents: Agent[]): FinancialHealthMetrics {
    // Implementation to calculate financial health metrics
  }
  
  // Other private calculation methods
}
```

### Strategy Pattern
The simulation logic uses a strategy pattern to apply different intervention rules:
```typescript
// Example strategy pattern implementation
interface InterventionStrategy {
  applyIntervention(agents: Agent[]): SimulationResult;
}

class DiscountOfferStrategy implements InterventionStrategy {
  applyIntervention(agents: Agent[]): SimulationResult {
    // Implementation to apply discount offer rules
  }
}

class AccountManagerStrategy implements InterventionStrategy {
  applyIntervention(agents: Agent[]): SimulationResult {
    // Implementation to apply account manager rules
  }
}

class SimulationService {
  private strategies: Record<string, InterventionStrategy> = {
    'discount-offer': new DiscountOfferStrategy(),
    'account-manager': new AccountManagerStrategy(),
    // Other strategies
  };
  
  simulateIntervention(interventionType: string, agents: Agent[]): SimulationResult {
    const strategy = this.strategies[interventionType];
    if (!strategy) {
      throw new Error(`Unknown intervention type: ${interventionType}`);
    }
    
    return strategy.applyIntervention(agents);
  }
}
```

### Composite Pattern
The metrics calculation uses a composite pattern to build up aggregate metrics from individual agent data:
```typescript
// Example composite pattern implementation
interface MetricCalculator {
  calculate(agents: Agent[]): number;
}

class AverageRevenueCalculator implements MetricCalculator {
  calculate(agents: Agent[]): number {
    // Implementation to calculate average revenue
  }
}

class ChurnRiskCalculator implements MetricCalculator {
  calculate(agents: Agent[]): number {
    // Implementation to calculate churn risk
  }
}

class CompositeMetricsCalculator {
  private calculators: Record<string, MetricCalculator> = {
    'averageRevenue': new AverageRevenueCalculator(),
    'churnRisk': new ChurnRiskCalculator(),
    // Other calculators
  };
  
  calculateAll(agents: Agent[]): Record<string, number> {
    const result: Record<string, number> = {};
    
    for (const [key, calculator] of Object.entries(this.calculators)) {
      result[key] = calculator.calculate(agents);
    }
    
    return result;
  }
}
```

## Component Relationships

### Frontend-Backend Integration
The frontend communicates with the backend through a well-defined API:
```typescript
// Example API client in the frontend
class ApiClient {
  async getMetrics(segmentType?: string, segmentValue?: string): Promise<Metrics> {
    const params = new URLSearchParams();
    if (segmentType && segmentValue) {
      params.append('segmentType', segmentType);
      params.append('segmentValue', segmentValue);
    }
    
    const response = await fetch(`/api/metrics?${params.toString()}`);
    return response.json();
  }
  
  async simulateIntervention(
    interventionType: string,
    segmentType: string,
    segmentValue: string
  ): Promise<SimulationResult> {
    const response = await fetch('/api/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        interventionType,
        segmentType,
        segmentValue,
      }),
    });
    
    return response.json();
  }
}
```

### Backend-Database Integration
The backend interacts with DynamoDB through the AWS SDK:
```typescript
// Example DynamoDB integration
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchGetCommand } from '@aws-sdk/lib-dynamodb';

class DynamoDBAgentRepository implements AgentRepository {
  private docClient: DynamoDBDocumentClient;
  
  constructor() {
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
  }
  
  async getAllAgents(): Promise<Agent[]> {
    // Generate keys for all agents (assuming we know the IDs or have a way to query them)
    const keys = Array.from({ length: 500 }, (_, i) => ({ id: `agent-${i + 1}` }));
    
    const command = new BatchGetCommand({
      RequestItems: {
        'AgentsTable': {
          Keys: keys,
        },
      },
    });
    
    const response = await this.docClient.send(command);
    return response.Responses?.AgentsTable as Agent[] || [];
  }
  
  // Other repository methods
}
```

## Scalability Considerations

While this is a one-day project with a limited dataset (500 agents), the architecture is designed with scalability in mind:

1. **Frontend Scalability**
   - CloudFront distribution ensures global availability and caching
   - React application can be optimized for performance with code splitting and lazy loading

2. **Backend Scalability**
   - Lambda functions automatically scale based on demand
   - API Gateway handles request throttling and management

3. **Database Scalability**
   - DynamoDB provides automatic scaling capabilities
   - For larger datasets, we could implement pagination or more sophisticated querying

4. **Future Enhancements**
   - For a production system with more agents, we would need to implement:
     - Pagination for agent data retrieval
     - Pre-computed aggregations for common segments
     - More sophisticated caching strategies
     - Potentially a data warehouse for complex analytics