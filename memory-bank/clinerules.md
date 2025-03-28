# Zillow Real Estate Professional Health Dashboard - Project Intelligence

## Project Overview
This is a one-day project to create an executive dashboard for Zillow that monitors the health of relationships with real estate professionals. The dashboard helps address a key risk identified in Zillow's 10-K: "Our business could be harmed if real estate professionals reduce or end their spending with us or if we are unable to effectively manage advertising and product inventory or pricing."

## Critical Implementation Paths

### NX Monorepo Structure
- All packages must be placed inside the `packages` directory
- Use `nx generate` commands to create new projects, not manual file creation
- Use a single output `dist` directory at the root with subfolders for each package
- Always clean build artifacts before rebuilding with `rm -rf dist && nx run-many --target=build --all`

### AWS Deployment
- Use CDK for all infrastructure deployment
- Use NodejsFunction primitive in CDK for Lambda functions
- Do not mark the AWS SDK as external, it should be bundled
- Use Origin Access Identity to connect CloudFront to the frontend's S3 bucket
- Always "sleep 10 && [command]" when checking CloudWatch logs to allow time for propagation

### Frontend Development
- Use React with TypeScript
- Use CSS Modules (no Tailwind CSS or other CSS frameworks)
- Use TanStack Router instead of React Router (disable routing in nx generate commands)
- Pass location/ARN of AWS resources to the frontend at build time via environment variables

### Backend Development
- Use Express.js with serverless-http
- Use Zod for schema validation
- Always include debug logging (requests and responses)
- Always include a health check endpoint with dependency checks
- Follow the 12-Factor App principles, especially for configuration
- Do not implement fallbacks - either the main path works or it fails with logging

### Data Handling
- Use DynamoDB for data storage
- For this project, load all 500 agents using BatchGetItem and perform aggregations in memory
- Hardcode simulation rules in the backend source code

## User Preferences and Workflow

### Development Workflow
- No local development mocking - use actual AWS deployments for testing
- No e2e testing with Playwright - out of scope for this one-day project
- Use curl and the AWS CLI to test deployments
- Save operational learnings to runbook.md

### Code Style and Organization
- Use TypeScript by default
- Put all shared types in a shared package
- Do not import the frontend into the backend or vice-versa
- Always include proper .gitignore (including .env and .env.*)
- Always --save or --save-dev dependencies
- Do not use --legacy-peer-deps without express approval

## Project-Specific Patterns

### Metrics and Segmentation
- Financial health metrics: average revenue per agent, customer acquisition cost, lifetime value
- Listing activity: new listings, listing updates, time to sell
- Lead management metrics: response time, conversion rates
- Customer satisfaction: support ticket volume, support NPS, support resolution times
- Early warning system: churn prediction score, engagement decline alerts, satisfaction trend analysis, price sensitivity
- Revenue impact: revenue retention rate, revenue at risk, revenue growth rate

### Agent Segments
- Experience level: rookie, established, veteran
- Business model: individual, team, brokerage
- Specialization: residential, residential investor, luxury, commercial
- Platform engagement level: low, medium, high
- Spend level: <$1k/yr, <$10k/yr, >$10k/yr
- Market type (location): suburban, urban, rural
- Market type (condition): warm, hot, cooling

### Interventions
- Discount offer
- Bundled service package
- Personalized training
- Assignment of an account manager
- Usage incentive program
- Targeted content delivery
- Personalized performance review

### Simulation Approach
- Simple rule-based simulation with predefined impact percentages on specific metrics
- Each intervention has different effects on different segments

## Known Challenges

### Performance Considerations
- Loading all 500 agents into memory is not scalable for a production system
- In-memory aggregation works for this demo but would need optimization for real-world use

### Technical Limitations
- No authentication or authorization in this one-day project
- Limited error handling and validation
- No comprehensive monitoring or alerting
- Hardcoded simulation rules rather than configurable ones

## Evolution of Project Decisions

### Initial Requirements
- Visually impressive front end
- Functional back end retrieving metrics from DynamoDB
- Support for segmenting agents
- Ability to simulate interventions on different segments

### Technical Decisions
- NX monorepo for better organization and build management
- React for frontend due to component reusability and ecosystem
- Express.js with serverless-http for backend to simplify API development
- DynamoDB for data storage due to AWS integration and scalability
- In-memory aggregation for simplicity in this one-day project
- Hardcoded simulation rules to reduce implementation complexity

## Tool Usage Patterns

### NX Commands
- Create a new frontend app: `nx generate @nx/react:app frontend --directory=packages/frontend --no-routing`
- Create a new backend app: `nx generate @nx/node:app backend --directory=packages/backend`
- Create a shared library: `nx generate @nx/js:lib shared --directory=packages/shared`
- Build all packages: `nx run-many --target=build --all`
- Build a specific package: `nx run frontend:build`

### AWS CLI Commands
- Check deployment status: `aws cloudformation describe-stacks --stack-name ZillowDashboardDevStack`
- View Lambda logs: `sleep 10 && aws cloudwatch logs get-log-events --log-group-name /aws/lambda/ZillowDashboardDevApiFunction`
- Check DynamoDB data: `aws dynamodb scan --table-name ZillowDashboardDevAgentsTable --limit 5`
- Invalidate CloudFront cache: `aws cloudfront create-invalidation --distribution-id [distribution-id] --paths "/*"`