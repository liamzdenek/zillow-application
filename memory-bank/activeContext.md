# Active Context

## Current Focus
- Deploying the Zillow Real Estate Professional Health Dashboard to AWS
- Setting up the infrastructure using AWS CDK
- Configuring the frontend and backend for production use

## Recent Changes
- Fixed TanStack Router integration in the frontend
- Updated build configuration to output to the correct location
- Created a custom favicon.svg for the application
- Deployed the CDK stack to AWS
- Set up DynamoDB, Lambda, API Gateway, S3, and CloudFront
- Fixed dependency installation for Lambda deployment
- Verified API endpoints are working correctly
- Updated the memory bank with deployment details and troubleshooting procedures
- Populated DynamoDB table with 500 sample agent records
- Increased Lambda function timeout to 30 seconds and memory to 1024 MB

## Active Decisions
- Using AWS CDK for infrastructure as code
- Using DynamoDB for storing agent data with GSIs for efficient querying
- Using CloudFront for secure and efficient content delivery
- Using API Gateway for exposing the backend API
- Using Lambda for serverless backend functionality

## Next Steps
- Populate the DynamoDB table with sample data
- Add more comprehensive error handling
- Implement user authentication if required
- Add more detailed metrics and visualizations
- Add automated tests for the frontend and backend
- Set up CI/CD pipeline for automated deployments
- Implement monitoring and alerting for the application

## Technical Considerations
- Ensuring proper CORS configuration for API Gateway
- Configuring CloudFront to handle both static assets and API requests
- Setting up proper IAM permissions for Lambda to access DynamoDB
- Ensuring the frontend build process outputs to the correct location
- Including dependencies in the Lambda deployment package
- Using the correct API paths with the /api prefix
- Handling the TanStack Router API changes in version 1.114.15
- Dynamically finding the git root directory for reliable file paths