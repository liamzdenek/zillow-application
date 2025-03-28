# Runbook

This document provides procedures for debugging, deploying, monitoring, and troubleshooting the Zillow Real Estate Professional Health Dashboard.

## Procedures

### Validate

#### Validating the Frontend
1. Access the CloudFront URL: https://d1lm2ezci363i3.cloudfront.net
2. Verify that the dashboard loads and displays data
3. Test filtering by different segments
4. Test the simulation functionality

#### Validating the Backend
1. Test the API directly using curl or Postman:
```bash
curl https://fdf213jq7b.execute-api.us-west-2.amazonaws.com/prod/api/health
```
2. Verify that the API returns the expected data
3. Test the metrics endpoint:
```bash
curl https://fdf213jq7b.execute-api.us-west-2.amazonaws.com/prod/api/metrics
```
4. Test the segments endpoint:
```bash
curl https://fdf213jq7b.execute-api.us-west-2.amazonaws.com/prod/api/segments
```
5. Test the interventions endpoint:
```bash
curl https://fdf213jq7b.execute-api.us-west-2.amazonaws.com/prod/api/interventions
```
6. Test the simulation endpoint:
```bash
curl -X POST https://fdf213jq7b.execute-api.us-west-2.amazonaws.com/prod/api/simulate -H "Content-Type: application/json" -d '{"interventionType":"discount-offer","segmentType":"experienceLevel","segmentValue":"rookie"}'
```

### Triage

#### Frontend Issues
1. Check the browser console for errors
2. Verify that the API requests are being made correctly
3. Check that the CloudFront distribution is configured correctly
4. Verify that the S3 bucket contains the expected files

#### Backend Issues
1. Check the CloudWatch Logs for the Lambda function
2. Verify that the Lambda function has the correct permissions to access DynamoDB
3. Check that the API Gateway is configured correctly
4. Verify that the DynamoDB table contains data

#### Infrastructure Issues
1. Check the CloudFormation stack status
2. Verify that all resources were created successfully
3. Check the IAM permissions for each resource

### Act

#### Deploying Updates
1. Build the frontend and backend:
```bash
npx nx build frontend
npx nx run backend:build-with-dependencies
```
2. Deploy the CDK stack:
```bash
AWS_PROFILE=lz-demos AWS_REGION=us-west-2 npx nx run cdk:deploy
```

#### Populating the Database
1. Set the table name from the CDK output:
```bash
export AGENTS_TABLE_NAME=ZillowDashboardStack-ZillowAgents5D2BFE9D-14YRSJUD4FKTE
```
2. Run the data generator:
```bash
AWS_PROFILE=lz-demos AWS_REGION=us-west-2 npx nx run data-generator:generate
```

#### Cleaning Up
1. Destroy the CDK stack:
```bash
AWS_PROFILE=lz-demos AWS_REGION=us-west-2 npx nx run cdk:destroy
```

### Reflect

After each operation, reflect on the following:
1. What went well?
2. What could be improved?
3. Are there any patterns or issues that need to be addressed?
4. Are there any changes needed to the documentation or procedures?

## Common Issues

### Error: Cannot find asset at /home/q/WebstormProjects/zillow-application/packages/backend/dist
**Root Cause**: The backend build output is not in the expected location.
**Solution**: Update the CDK stack to use the correct path:
```typescript
const BACKEND_PATH = path.join(GIT_ROOT, 'dist/packages/backend');
```

### Error: Cannot find asset at /home/q/WebstormProjects/zillow-application/packages/frontend/dist
**Root Cause**: The frontend build output is not in the expected location.
**Solution**: Update the vite.config.ts file to build to the correct location:
```typescript
build: {
  outDir: '../../dist/packages/frontend',
  emptyOutDir: true,
},
```

### Error: Module '"@tanstack/react-router"' has no exported member 'Outlet'
**Root Cause**: The TanStack Router API has changed in version 1.114.15.
**Solution**: Update the imports to use the correct API:
```typescript
import { createRootRoute, Link, Outlet } from '@tanstack/react-router/dist/esm';
```

### Error: CORS policy: No 'Access-Control-Allow-Origin' header
**Root Cause**: The API Gateway CORS configuration is incorrect.
**Solution**: Update the API Gateway CORS configuration in the CDK stack:
```typescript
defaultCorsPreflightOptions: {
  allowOrigins: apigateway.Cors.ALL_ORIGINS,
  allowMethods: apigateway.Cors.ALL_METHODS
}
```

### Error: Cannot find module 'express'
**Root Cause**: The Lambda function is missing dependencies.
**Solution**: Update the backend build process to include dependencies:
```json
"install-dependencies": {
  "executor": "nx:run-commands",
  "options": {
    "command": "cd dist/packages/backend && npm install --production",
    "cwd": "."
  },
  "dependsOn": ["build"]
},
"build-with-dependencies": {
  "executor": "nx:run-commands",
  "options": {
    "commands": [
      "nx build backend",
      "nx run backend:install-dependencies"
    ],
    "parallel": false
  }
}
```

### Error: Task timed out after 3.07 seconds
**Root Cause**: The Lambda function is taking too long to execute.
**Solution**: Increase the Lambda function timeout and memory:
```typescript
timeout: cdk.Duration.seconds(30),
memorySize: 1024
```

### Error: Cannot GET /agents
**Root Cause**: The API endpoints are prefixed with /api in the backend code.
**Solution**: Use the correct API paths:
```bash
# Correct
curl https://fdf213jq7b.execute-api.us-west-2.amazonaws.com/prod/api/health

# Incorrect
curl https://fdf213jq7b.execute-api.us-west-2.amazonaws.com/prod/agents