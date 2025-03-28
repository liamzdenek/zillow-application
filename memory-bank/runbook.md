# Runbook: Zillow Real Estate Professional Health Dashboard

This runbook provides procedures for common operational tasks related to the Zillow Real Estate Professional Health Dashboard. It follows the Validate, Triage, Act, Reflect (VTAR) approach for troubleshooting issues.

## Development Procedures

### Setting Up the Development Environment

#### Prerequisites
- Node.js (v16 or later)
- npm (v7 or later)
- AWS CLI configured with appropriate credentials
- AWS CDK installed globally (`npm install -g aws-cdk`)

#### Initial Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd zillow-application
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build all packages:
   ```bash
   nx run-many --target=build --all
   ```

### Local Development

Remember that we're not using local mocks - we deploy to AWS for testing. However, you can build and validate code locally:

1. Build a specific package:
   ```bash
   nx run frontend:build
   ```

2. Lint a specific package:
   ```bash
   nx run frontend:lint
   ```

3. Test a specific package:
   ```bash
   nx run frontend:test
   ```

## Deployment Procedures

### Initial Deployment

1. Ensure AWS credentials are configured:
   ```bash
   aws configure
   ```

2. Build all packages:
   ```bash
   nx run-many --target=build --all
   ```

3. Deploy the CDK stack:
   ```bash
   nx run cdk:deploy
   ```

4. Generate and load sample data:
   ```bash
   nx run data-generator:generate
   ```

### Updating the Deployment

#### Frontend Updates

1. Build the frontend:
   ```bash
   nx run frontend:build
   ```

2. Deploy via CDK (which will update S3 and invalidate CloudFront):
   ```bash
   nx run cdk:deploy
   ```

#### Backend Updates

1. Build the backend:
   ```bash
   nx run backend:build
   ```

2. Deploy via CDK (which will update the Lambda function):
   ```bash
   nx run cdk:deploy
   ```

#### Infrastructure Updates

1. Make changes to the CDK code in `packages/cdk/lib/`

2. Deploy the updated stack:
   ```bash
   nx run cdk:deploy
   ```

### Rollback Procedure

If a deployment causes issues:

1. Identify the last known good deployment in CloudFormation:
   ```bash
   aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE
   ```

2. Roll back to the previous version:
   ```bash
   aws cloudformation continue-update-rollback --stack-name ZillowDashboardDevStack
   ```

## Monitoring Procedures

### Checking API Health

1. Use the health check endpoint:
   ```bash
   curl https://[api-id].execute-api.[region].amazonaws.com/prod/health
   ```

2. Expected response:
   ```json
   {
     "status": "healthy",
     "dependencies": {
       "dynamodb": "connected"
     },
     "timestamp": "2025-03-28T13:45:30.123Z"
   }
   ```

### Viewing Lambda Logs

1. View recent logs:
   ```bash
   aws cloudwatch logs get-log-events --log-group-name /aws/lambda/ZillowDashboardDevApiFunction
   ```

2. Wait for logs to propagate after an action:
   ```bash
   sleep 10 && aws cloudwatch logs get-log-events --log-group-name /aws/lambda/ZillowDashboardDevApiFunction
   ```

3. Filter logs for errors:
   ```bash
   aws logs filter-log-events --log-group-name /aws/lambda/ZillowDashboardDevApiFunction --filter-pattern "ERROR"
   ```

### Checking DynamoDB Status

1. Verify table exists:
   ```bash
   aws dynamodb describe-table --table-name ZillowDashboardDevAgentsTable
   ```

2. Check item count:
   ```bash
   aws dynamodb scan --table-name ZillowDashboardDevAgentsTable --select COUNT
   ```

3. Sample a few items:
   ```bash
   aws dynamodb scan --table-name ZillowDashboardDevAgentsTable --limit 5
   ```

## Troubleshooting Guide

### VTAR Process

For all issues, follow the Validate, Triage, Act, Reflect process:

1. **Validate**: Confirm the issue exists and gather information
2. **Triage**: Determine the severity and potential causes
3. **Act**: Implement a solution
4. **Reflect**: Document findings and prevent future occurrences

### Common Issues

#### API Returns 5xx Errors

**Validate**:
1. Confirm the error with curl:
   ```bash
   curl -v https://[api-id].execute-api.[region].amazonaws.com/prod/metrics
   ```
2. Check Lambda logs:
   ```bash
   aws cloudwatch logs get-log-events --log-group-name /aws/lambda/ZillowDashboardDevApiFunction
   ```

**Triage**:
- If logs show DynamoDB access errors, check IAM permissions
- If logs show code exceptions, identify the specific error

**Act**:
- For permission issues:
  ```bash
  # Check the IAM role
  aws iam get-role --role-name ZillowDashboardDevLambdaRole
  
  # Update the role if needed via CDK and redeploy
  nx run cdk:deploy
  ```
- For code issues:
  1. Fix the code
  2. Rebuild and redeploy:
     ```bash
     nx run backend:build
     nx run cdk:deploy
     ```

**Reflect**:
- Document the issue and solution
- Add better error handling if needed
- Consider adding CloudWatch alarms for this type of error

#### Frontend Not Loading or Showing Outdated Content

**Validate**:
1. Check the CloudFront URL in a browser
2. Inspect browser console for errors
3. Verify S3 bucket contents:
   ```bash
   aws s3 ls s3://zillow-dashboard-dev-frontend/
   ```

**Triage**:
- If S3 is empty or missing files, deployment failed
- If content exists but is outdated, CloudFront cache issue
- If console shows API errors, backend issue

**Act**:
- For missing files:
  ```bash
  nx run frontend:build
  aws s3 sync dist/packages/frontend s3://zillow-dashboard-dev-frontend
  ```
- For cache issues:
  ```bash
  aws cloudfront create-invalidation --distribution-id [distribution-id] --paths "/*"
  ```

**Reflect**:
- Ensure deployment process includes cache invalidation
- Add deployment verification steps

#### No Data or Incorrect Data Showing in Dashboard

**Validate**:
1. Check API response:
   ```bash
   curl https://[api-id].execute-api.[region].amazonaws.com/prod/metrics
   ```
2. Verify DynamoDB data:
   ```bash
   aws dynamodb scan --table-name ZillowDashboardDevAgentsTable --limit 5
   ```

**Triage**:
- If DynamoDB is empty, data generation failed
- If data exists but API returns empty/wrong results, backend processing issue

**Act**:
- For empty DynamoDB:
  ```bash
  nx run data-generator:generate
  ```
- For backend processing issues:
  1. Debug the aggregation logic
  2. Fix, rebuild, and redeploy:
     ```bash
     nx run backend:build
     nx run cdk:deploy
     ```

**Reflect**:
- Add data validation to the data generator
- Improve error handling in the backend

#### CDK Deployment Failures

**Validate**:
1. Check CloudFormation events:
   ```bash
   aws cloudformation describe-stack-events --stack-name ZillowDashboardDevStack
   ```

**Triage**:
- Identify the specific resource causing the failure
- Check for permission issues or configuration errors

**Act**:
- For permission issues, update AWS credentials or IAM roles
- For configuration errors, fix CDK code and redeploy
- If stack is in a failed state:
  ```bash
  aws cloudformation delete-stack --stack-name ZillowDashboardDevStack
  # Then redeploy
  nx run cdk:deploy
  ```

**Reflect**:
- Add pre-deployment validation
- Consider using CDK diff to preview changes

## Maintenance Procedures

### Backing Up DynamoDB Data

```bash
aws dynamodb export-table-to-point-in-time \
  --table-name ZillowDashboardDevAgentsTable \
  --s3-bucket [backup-bucket] \
  --s3-prefix [backup-prefix] \
  --export-format DYNAMODB_JSON
```

### Refreshing Sample Data

```bash
# Clear existing data
aws dynamodb delete-table --table-name ZillowDashboardDevAgentsTable

# Wait for table deletion to complete
aws dynamodb wait table-not-exists --table-name ZillowDashboardDevAgentsTable

# Redeploy to recreate the table
nx run cdk:deploy

# Wait for table creation to complete
aws dynamodb wait table-exists --table-name ZillowDashboardDevAgentsTable

# Generate new data
nx run data-generator:generate
```

### Cleaning Up Resources

When the project is no longer needed:

```bash
# Delete the CloudFormation stack
aws cloudformation delete-stack --stack-name ZillowDashboardDevStack

# Verify deletion
aws cloudformation describe-stacks --stack-name ZillowDashboardDevStack
# Should return "Stack with id ZillowDashboardDevStack does not exist"
```

## Operational Learnings

As this is a new project, we'll document operational learnings here as they occur:

1. **Always wait for CloudWatch logs**: There's a delay between Lambda execution and log availability. Always use `sleep 10 && [command]` when checking logs after an action.

2. **Clean build artifacts before rebuilding**: To avoid issues with stale artifacts, always clean the dist directory before rebuilding: `rm -rf dist && nx run-many --target=build --all`

3. **Verify DynamoDB data after generation**: Always check that data was properly loaded with the expected structure and count.

4. **Check CloudFront cache**: Remember that CloudFront caching can cause outdated content to be served. Always invalidate the cache after frontend updates.

5. **Use the health check endpoint**: The health check endpoint provides a quick way to verify that the entire stack is functioning correctly.