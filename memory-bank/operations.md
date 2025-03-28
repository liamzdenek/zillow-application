# Operations: Zillow Real Estate Professional Health Dashboard

## Deployed Resources

This document outlines the AWS resources that will be deployed for the Zillow Real Estate Professional Health Dashboard and their relationship to the source code. As this is a one-day project, the deployment is currently planned but not yet executed.

### Resource Naming Convention

All resources follow a consistent naming convention:
- Prefix: `ZillowDashboard`
- Environment: `Dev` (for this one-day project)
- Resource Type: Specific to the resource (e.g., `Table`, `Api`, `Function`)

### AWS Resources

| Resource Type | Resource Name | Description | Source Code Location |
|---------------|---------------|-------------|----------------------|
| DynamoDB Table | ZillowDashboardDevAgentsTable | Stores agent data and metrics | packages/cdk/lib/dynamodb.ts |
| Lambda Function | ZillowDashboardDevApiFunction | Handles API requests | packages/backend/src/index.ts |
| API Gateway | ZillowDashboardDevApiGateway | Exposes backend API | packages/cdk/lib/api.ts |
| S3 Bucket | zillow-dashboard-dev-frontend | Hosts frontend assets | packages/cdk/lib/frontend.ts |
| CloudFront Distribution | ZillowDashboardDevDistribution | Distributes frontend globally | packages/cdk/lib/frontend.ts |
| IAM Role | ZillowDashboardDevLambdaRole | Execution role for Lambda | packages/cdk/lib/iam.ts |
| CloudWatch Log Group | /aws/lambda/ZillowDashboardDevApiFunction | Stores Lambda logs | Auto-created by Lambda |

## Deployment Process

### Infrastructure Deployment

The infrastructure is deployed using AWS CDK with the following command:

```bash
nx run cdk:deploy
```

This deploys the entire stack defined in `packages/cdk/lib/zillow-dashboard-stack.ts`.

### Frontend Deployment

The frontend is built and deployed as part of the CDK deployment process:

1. The React application is built with:
   ```bash
   nx run frontend:build
   ```

2. The build artifacts are stored in `dist/packages/frontend`

3. The CDK deployment uploads these artifacts to the S3 bucket and invalidates the CloudFront cache

### Backend Deployment

The backend is also deployed as part of the CDK process:

1. The backend is built with:
   ```bash
   nx run backend:build
   ```

2. The build artifacts are stored in `dist/packages/backend`

3. The CDK deployment packages these artifacts into a Lambda function

### Data Population

Sample data is generated and loaded into DynamoDB using:

```bash
nx run data-generator:generate
```

This script is defined in `packages/data-generator/src/index.ts`.

## Monitoring and Logging

### CloudWatch Logs

Lambda function logs can be viewed with:

```bash
aws cloudwatch logs get-log-events --log-group-name /aws/lambda/ZillowDashboardDevApiFunction
```

Remember to wait a few seconds after invocation:

```bash
sleep 10 && aws cloudwatch logs get-log-events --log-group-name /aws/lambda/ZillowDashboardDevApiFunction
```

### API Testing

The API can be tested using curl:

```bash
# Get health check
curl https://[api-id].execute-api.[region].amazonaws.com/prod/health

# Get metrics
curl https://[api-id].execute-api.[region].amazonaws.com/prod/metrics

# Get metrics for a specific segment
curl https://[api-id].execute-api.[region].amazonaws.com/prod/metrics?segmentType=experienceLevel&segmentValue=veteran

# Simulate intervention
curl -X POST https://[api-id].execute-api.[region].amazonaws.com/prod/simulate \
  -H "Content-Type: application/json" \
  -d '{"interventionType":"discount-offer","segmentType":"experienceLevel","segmentValue":"veteran"}'
```

### Frontend Access

The frontend can be accessed via the CloudFront URL:

```
https://[distribution-id].cloudfront.net
```

## Resource Relationships

### Source Code to Resource Mapping

```
┌─────────────────────┐      ┌─────────────────────┐
│                     │      │                     │
│  packages/frontend  │─────▶│  S3 + CloudFront   │
│                     │      │                     │
└─────────────────────┘      └─────────────────────┘
                                      │
                                      │ (API calls)
                                      ▼
┌─────────────────────┐      ┌─────────────────────┐
│                     │      │                     │
│  packages/backend   │─────▶│  Lambda + API GW    │
│                     │      │                     │
└─────────────────────┘      └─────────────────────┘
                                      │
                                      │ (Data access)
                                      ▼
┌─────────────────────┐      ┌─────────────────────┐
│                     │      │                     │
│packages/data-generator│───▶│     DynamoDB        │
│                     │      │                     │
└─────────────────────┘      └─────────────────────┘
```

### Data Flow

1. **User Request Flow**:
   - User accesses CloudFront URL
   - CloudFront serves frontend assets from S3
   - Frontend makes API calls to API Gateway
   - API Gateway forwards requests to Lambda
   - Lambda processes requests and accesses DynamoDB
   - Response flows back through the same path

2. **Deployment Flow**:
   - CDK code defines infrastructure
   - Build process creates artifacts
   - CDK deploys infrastructure and uploads artifacts
   - Data generator populates DynamoDB

## Operational Tasks

### Checking Deployment Status

```bash
aws cloudformation describe-stacks --stack-name ZillowDashboardDevStack
```

### Viewing DynamoDB Data

```bash
aws dynamodb scan --table-name ZillowDashboardDevAgentsTable --limit 5
```

### Updating Frontend

```bash
nx run frontend:build
aws s3 sync dist/packages/frontend s3://zillow-dashboard-dev-frontend
aws cloudfront create-invalidation --distribution-id [distribution-id] --paths "/*"
```

### Updating Backend

```bash
nx run backend:build
# The Lambda code will be updated on the next CDK deployment
nx run cdk:deploy
```

### Cleaning Up Resources

```bash
nx run cdk:destroy
```

## Troubleshooting

### Common Issues and Solutions

1. **API Returns 5xx Errors**
   - Check Lambda logs for errors:
     ```bash
     aws cloudwatch logs get-log-events --log-group-name /aws/lambda/ZillowDashboardDevApiFunction
     ```
   - Verify Lambda has correct permissions to access DynamoDB

2. **Frontend Not Updating After Deployment**
   - Ensure CloudFront cache is invalidated:
     ```bash
     aws cloudfront create-invalidation --distribution-id [distribution-id] --paths "/*"
     ```
   - Check browser cache (try hard refresh)

3. **DynamoDB Data Issues**
   - Verify data was loaded correctly:
     ```bash
     aws dynamodb scan --table-name ZillowDashboardDevAgentsTable --select COUNT
     ```
   - Re-run data generator if needed:
     ```bash
     nx run data-generator:generate
     ```

4. **CDK Deployment Failures**
   - Check CloudFormation events:
     ```bash
     aws cloudformation describe-stack-events --stack-name ZillowDashboardDevStack
     ```
   - Ensure IAM permissions are correct for deployment

### Health Checks

The backend provides a health check endpoint at `/health` that verifies:
- API Gateway and Lambda are functioning
- DynamoDB connection is working
- Basic functionality is operational

This can be used to quickly verify the deployment is working correctly.