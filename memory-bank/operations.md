# Operations Guide

## Deployed Resources

### AWS Resources
| Resource Type | Resource Name | Description | Source Code |
|--------------|---------------|-------------|-------------|
| DynamoDB Table | ZillowDashboardStack-ZillowAgents5D2BFE9D-14YRSJUD4FKTE | Stores agent data with GSIs for each segment type | packages/cdk/src/lib/zillow-dashboard-stack.ts:16-62 |
| Lambda Function | BackendFunction | Handles API requests and interacts with DynamoDB | packages/cdk/src/lib/zillow-dashboard-stack.ts:66-73 |
| API Gateway | ZillowDashboardApi | Exposes the backend API | packages/cdk/src/lib/zillow-dashboard-stack.ts:79-92 |
| S3 Bucket | FrontendBucket | Hosts the frontend static assets | packages/cdk/src/lib/zillow-dashboard-stack.ts:95-100 |
| CloudFront Distribution | Distribution | Serves the frontend and proxies API requests | packages/cdk/src/lib/zillow-dashboard-stack.ts:107-138 |

### Endpoints
| Endpoint | URL | Description |
|----------|-----|-------------|
| Frontend | https://d1lm2ezci363i3.cloudfront.net | The main application URL |
| API | https://fdf213jq7b.execute-api.us-west-2.amazonaws.com/prod/ | The backend API URL |

## Relationship to Source Code

### Frontend
- Source code: packages/frontend/src
- Build output: dist/packages/frontend
- Deployment: S3 bucket via CloudFront

### Backend
- Source code: packages/backend/src
- Build output: dist/packages/backend
- Deployment: Lambda function via API Gateway

### Infrastructure
- Source code: packages/cdk/src
- Deployment: AWS CloudFormation via CDK

## Common Operations

### Deploying Updates
To deploy updates to the application:

1. Build the frontend and backend:
```bash
npx nx build frontend
npx nx build backend
```

2. Deploy the CDK stack:
```bash
AWS_PROFILE=lz-demos AWS_REGION=us-west-2 npx nx run cdk:deploy
```

### Populating the Database
To populate the DynamoDB table with sample data:

```bash
export AGENTS_TABLE_NAME=ZillowDashboardStack-ZillowAgents5D2BFE9D-14YRSJUD4FKTE
AWS_PROFILE=lz-demos AWS_REGION=us-west-2 npx nx run data-generator:generate
```

### Cleaning Up
To remove all AWS resources when they're no longer needed:

```bash
AWS_PROFILE=lz-demos AWS_REGION=us-west-2 npx nx run cdk:destroy