# Technical Context: Zillow Real Estate Professional Health Dashboard

## Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **State Management**: React Context API and hooks
- **Routing**: TanStack Router
- **Styling**: CSS Modules (no CSS frameworks or Tailwind)
- **Build Tool**: NX
- **Deployment**: AWS S3 + CloudFront with Origin Access Identity

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with serverless-http
- **API Gateway**: AWS API Gateway
- **Compute**: AWS Lambda (NodejsFunction in CDK)
- **Database**: Amazon DynamoDB
- **Deployment**: AWS CDK

### Development Tools
- **Package Manager**: npm
- **Monorepo Management**: NX
- **Type Validation**: Zod
- **Testing**: Jest (unit testing only, no e2e testing)
- **Logging**: Console logging with debug information

## Development Setup

### Monorepo Structure
The project follows an NX monorepo structure with all packages inside a `packages` directory:

```
zillow-application/
├── dist/                      # Single output directory for all builds
├── packages/
│   ├── frontend/              # React frontend application
│   ├── backend/               # Express.js backend API
│   ├── shared/                # Shared types and utilities
│   ├── cdk/                   # AWS CDK infrastructure code
│   └── data-generator/        # Script to generate and load sample data
├── memory-bank/               # Project documentation
├── nx.json                    # NX configuration
├── package.json               # Root package.json
└── .gitignore                 # Git ignore file
```

### Package Responsibilities

#### frontend
- Implements the dashboard UI and simulation interface
- Makes API calls to the backend
- Handles segment filtering and visualization

#### backend
- Implements the API endpoints for metrics and simulation
- Retrieves and processes agent data from DynamoDB
- Performs aggregations and applies simulation rules

#### shared
- Defines shared TypeScript interfaces and types
- Implements shared utilities and constants
- Defines Zod schemas for validation

#### cdk
- Defines the AWS infrastructure using CDK
- Handles deployment of frontend and backend
- Sets up DynamoDB tables and other resources

#### data-generator
- Generates realistic sample agent data
- Loads the data into DynamoDB

## Technical Constraints

### 12-Factor App Principles
The application follows 12-Factor App principles, particularly:
- Configuration through environment variables
- Stateless processes
- Disposability (quick startup/shutdown)
- Dev/prod parity

### AWS-Specific Constraints
- All infrastructure is designed for AWS
- CDK is used for infrastructure as code
- NodejsFunction primitive is used in CDK
- Origin Access Identity connects CloudFront to S3

### Development Constraints
- No local development mocking - actual AWS deployments are used for testing
- No e2e testing with Playwright - out of scope for this one-day project
- No CSS frameworks or Tailwind - CSS modules are used instead
- No React Router - TanStack Router is used instead

### Deployment Constraints
- Single output `dist` directory with subfolders for each package
- AWS CLI and curl are used to test deployments
- AWS SDK is bundled, not marked as external

## Environment Configuration

### Environment Variables
The application uses environment variables for configuration, following 12-Factor App principles:

#### Frontend (Build-time Environment Variables)
```
REACT_APP_API_ENDPOINT=https://api.example.com
```

#### Backend (Runtime Environment Variables)
```
DYNAMODB_TABLE_NAME=AgentsTable
LOG_LEVEL=debug
```

### AWS Resource Naming
AWS resources are referenced by location/ARN passed through environment variables:

```
AGENTS_TABLE_ARN=arn:aws:dynamodb:us-west-2:123456789012:table/AgentsTable
```

## Development Workflow

### Building and Testing
1. Use NX commands for building and testing:
   ```
   nx run frontend:build
   nx run backend:build
   nx run shared:build
   ```

2. Clean build artifacts before rebuilding:
   ```
   rm -rf dist && nx run-many --target=build --all
   ```

3. Test deployments using AWS CLI and curl:
   ```
   aws cloudformation describe-stacks --stack-name ZillowDashboardStack
   curl https://api.example.com/health
   ```

### Deployment Process
1. Build all packages:
   ```
   nx run-many --target=build --all
   ```

2. Deploy using CDK:
   ```
   nx run cdk:deploy
   ```

3. Verify deployment:
   ```
   sleep 10 && aws cloudwatch logs get-log-events --log-group-name /aws/lambda/ZillowDashboardApi
   ```

## Technical Debt and Limitations

For this one-day project, we've made some technical compromises:

1. **In-Memory Processing**: Loading all 500 agents into memory is not scalable for a production system with thousands or millions of agents.

2. **Limited Testing**: No e2e testing and minimal unit testing due to time constraints.

3. **Hardcoded Simulation Rules**: Rules are hardcoded in the backend rather than configurable through a UI or database.

4. **Limited Error Handling**: Basic error handling is implemented, but not comprehensive.

5. **No Authentication**: The dashboard doesn't implement authentication or authorization.

6. **Limited Monitoring**: Basic CloudWatch logging but no comprehensive monitoring or alerting.

## Dependencies

### Frontend Dependencies
- React
- TypeScript
- @tanstack/router
- chart.js (for visualizations)
- date-fns (for date formatting)
- zod (for validation)

### Backend Dependencies
- Express
- TypeScript
- serverless-http
- @aws-sdk/client-dynamodb
- @aws-sdk/lib-dynamodb
- zod (for validation)

### CDK Dependencies
- aws-cdk-lib
- constructs
- typescript

### Development Dependencies
- nx
- typescript
- jest
- eslint
- prettier

## Performance Considerations

### Frontend Performance
- Optimize bundle size with code splitting
- Implement memoization for expensive calculations
- Use efficient rendering techniques for charts and tables

### Backend Performance
- Optimize DynamoDB queries and batch operations
- Implement caching for frequently accessed data
- Use efficient algorithms for aggregations and simulations

### API Performance
- Implement appropriate caching headers
- Optimize payload size
- Use compression for responses

## Security Considerations

### Data Security
- No sensitive data is stored in the application
- All AWS resources follow least privilege principle

### API Security
- Input validation using Zod schemas
- Rate limiting through API Gateway
- CORS configuration to restrict access

### Infrastructure Security
- CloudFront Origin Access Identity for S3 access
- IAM roles with minimal permissions
- No public access to DynamoDB