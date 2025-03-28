# Active Context: Zillow Real Estate Professional Health Dashboard

## Current Focus

We are currently in the initial planning and architecture phase of the Zillow Real Estate Professional Health Dashboard project. This one-day project aims to create an executive dashboard that monitors the health of relationships with real estate professionals, addressing a key risk identified in Zillow's 10-K.

### Active Tasks

1. **Project Planning and Architecture Design**
   - Defining project requirements and scope
   - Designing system architecture
   - Documenting technical decisions
   - Setting up project structure

2. **Next Implementation Steps**
   - Initialize NX monorepo structure
   - Create frontend, backend, shared, and CDK packages
   - Set up basic infrastructure with CDK
   - Implement data model and DynamoDB table
   - Create data generator script

## Recent Decisions

### Metrics Selection
We've decided to focus on the following key metrics:

1. **Financial Health Metrics**
   - Average revenue per agent
   - Customer acquisition cost
   - Lifetime value

2. **Listing Activity**
   - New listings
   - Listing updates
   - Time to sell

3. **Lead Management Metrics**
   - Response time
   - Conversion rates

4. **Customer Satisfaction**
   - Support ticket volume
   - Support NPS
   - Support resolution times

5. **Early Warning System**
   - Churn prediction score
   - Engagement decline alerts
   - Satisfaction trend analysis
   - Price sensitivity indicators

6. **Revenue Impact**
   - Revenue retention rate
   - Revenue at risk
   - Revenue growth rate

### Agent Segmentation Strategy
We've defined the following segments for analyzing real estate professionals:

1. **Experience Level**: Rookie, Established, Veteran
2. **Business Model**: Individual, Team, Brokerage
3. **Specialization**: Residential, Residential investor, Luxury, Commercial
4. **Platform Engagement Level**: Low, Medium, High
5. **Spend Level**: <$1k/yr, <$10k/yr, >$10k/yr
6. **Market Type (Location)**: Suburban, Urban, Rural
7. **Market Type (Condition)**: Warm, Hot, Cooling

### Intervention Types
We've selected the following interventions to simulate:

1. Discount offer
2. Bundled service package
3. Personalized training
4. Assignment of an account manager
5. Usage incentive program
6. Targeted content delivery
7. Personalized performance review

### Technical Decisions

1. **Data Model**: Single DynamoDB table for agents and their metrics
2. **Simulation Approach**: Simple rule-based simulation with hardcoded rules
3. **Data Processing**: In-memory aggregation of metrics for different segments
4. **UI Layout**: Two main pages - dashboard view and simulation view
5. **Tech Stack**: React frontend, Express.js backend with serverless-http, DynamoDB database

## Current Challenges

1. **One-Day Timeline**: The project needs to be completed in one day, requiring careful scope management and efficient implementation.

2. **Realistic Data Generation**: Creating realistic sample data that demonstrates the value of the dashboard and shows meaningful patterns across segments.

3. **Simulation Accuracy**: Implementing simulation rules that provide realistic and valuable insights without overcomplicating the implementation.

4. **Visual Impact**: Creating a visually impressive dashboard that effectively communicates insights to executives while maintaining implementation simplicity.

## Next Steps

### Immediate Next Steps

1. **Initialize Project Structure**
   - Set up NX monorepo with required packages
   - Configure build and deployment scripts
   - Create .gitignore file

2. **Implement Core Infrastructure**
   - Create CDK stack for DynamoDB, Lambda, API Gateway, S3, and CloudFront
   - Set up deployment pipeline

3. **Develop Data Model and Generator**
   - Define agent data structure
   - Implement data generator script
   - Populate DynamoDB with sample data

4. **Implement Backend API**
   - Create API endpoints for metrics and simulation
   - Implement data retrieval and aggregation logic
   - Implement simulation rules

5. **Develop Frontend Dashboard**
   - Create main dashboard view with metrics visualization
   - Implement segment filtering
   - Create simulation page
   - Connect to backend API

### Future Considerations (Post One-Day Project)

1. **Enhanced Data Model**: Move beyond the simplified 500-agent model to a more scalable approach for real-world usage.

2. **Advanced Analytics**: Implement more sophisticated analytics and predictive models.

3. **Configurable Rules**: Make simulation rules configurable through a UI rather than hardcoded.

4. **Authentication and Authorization**: Add proper security controls for a production environment.

5. **Historical Tracking**: Implement historical tracking of metrics over time for trend analysis.

## Open Questions

1. How realistic should the sample data be? Should we attempt to model real-world patterns and correlations between metrics?

2. What level of detail should be included in the simulation results? Should we show impact on all metrics or focus on a few key ones?

3. How should we balance visual appeal with implementation simplicity given the one-day timeline?

4. What would be the most impressive aspects to highlight for Zillow executives reviewing this project?

## Recent Changes

This is the initial version of the Active Context document. No changes have been made yet as we are still in the planning phase.

## Current Status

- **Project Phase**: Planning and Architecture
- **Implementation Status**: Not started
- **Documentation Status**: In progress
- **Deployment Status**: Not started