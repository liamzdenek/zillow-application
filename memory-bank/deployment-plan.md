# Deployment Plan: Zillow Real Estate Professional Health Dashboard

## Overview
This document outlines the steps to deploy the Zillow Real Estate Professional Health Dashboard to AWS using the AWS CDK.

## Prerequisites
- AWS CLI installed and configured with appropriate credentials
- Node.js and npm installed
- AWS CDK CLI installed (`npm install -g aws-cdk`)
- AWS profile "lz-demos" configured
- AWS region "us-west-2" will be used for deployment

## Deployment Steps

### 1. Bootstrap AWS Environment (First-time only)

If this is the first time using CDK in this AWS account/region, we need to bootstrap the environment:

```bash
AWS_PROFILE=lz-demos AWS_REGION=us-west-2 npx nx run cdk:bootstrap
```

### 2. Deploy the CDK Stack

Deploy the CDK stack to create all AWS resources. The CDK deployment process will automatically build all prerequisites using nx:

```bash
AWS_PROFILE=lz-demos AWS_REGION=us-west-2 npx nx run cdk:deploy
```

This will:
1. Build all required packages using nx (shared, backend, frontend)
2. Deploy the infrastructure to AWS

This will create:
- DynamoDB table for agent data with GSIs for each segment type
- Lambda function for the backend API
- API Gateway for exposing the backend API
- S3 bucket for hosting the frontend (with proper security settings)
- CloudFront distribution with Origin Access Identity for secure S3 access

### 3. Populate DynamoDB with Sample Data

After the stack is deployed, we need to populate the DynamoDB table with sample data:

```bash
# Set the table name from the CDK output
export AGENTS_TABLE_NAME=<table-name-from-cdk-output>
AWS_PROFILE=lz-demos AWS_REGION=us-west-2 npx nx run data-generator:generate
```

### 4. Verify Deployment

After deployment, verify that everything is working correctly:

1. Access the CloudFront URL from the CDK output
2. Verify that the dashboard loads and displays data
3. Test filtering by different segments
4. Test the simulation functionality

## Troubleshooting

### Common Issues and Solutions

1. **Lambda Function Errors**
   - Check CloudWatch Logs for the Lambda function
   - Ensure the Lambda has the correct permissions to access DynamoDB
   - Verify the environment variables are set correctly

2. **Frontend Deployment Issues**
   - Ensure the frontend build completed successfully
   - Check that the S3 bucket deployment was successful
   - Verify the CloudFront distribution is properly configured

3. **DynamoDB Data Issues**
   - Verify the data generator ran successfully
   - Check the DynamoDB table contains the expected data
   - Ensure the GSIs are properly configured

4. **API Gateway Issues**
   - Check the API Gateway configuration
   - Verify the Lambda integration is working
   - Test the API endpoints directly

## Cleanup

To avoid incurring charges, you can destroy the stack when it's no longer needed:

```bash
AWS_PROFILE=lz-demos AWS_REGION=us-west-2 npx nx run cdk:destroy
```

This will remove all AWS resources created by the CDK stack.