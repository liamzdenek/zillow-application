# Project Brief: Zillow Real Estate Professional Health Dashboard

## Project Overview
This one-day project aims to create an executive dashboard for Zillow that monitors the health of relationships with real estate professionals. The dashboard will help address a key risk identified in Zillow's 10-K: "Our business could be harmed if real estate professionals reduce or end their spending with us or if we are unable to effectively manage advertising and product inventory or pricing."

## Core Requirements

### Metrics to Track
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

### Agent Segmentation
1. **Experience Level**
   - Rookie
   - Established
   - Veteran

2. **Business Model**
   - Individual
   - Team
   - Brokerage

3. **Specialization**
   - Residential
   - Residential investor
   - Luxury
   - Commercial

4. **Platform Engagement Level**
   - Low
   - Medium
   - High

5. **Spend Level**
   - <$1k/yr
   - <$10k/yr
   - >$10k/yr

6. **Market Type (Location)**
   - Suburban
   - Urban
   - Rural

7. **Market Type (Condition)**
   - Warm
   - Hot
   - Cooling

### Interventions to Simulate
1. Discount offer
2. Bundled service package
3. Personalized training
4. Assignment of an account manager
5. Usage incentive program
6. Targeted content delivery
7. Personalized performance review

### Simulation Approach
Simple rule-based simulation where each intervention has predefined impact percentages on specific metrics (e.g., discount offers increase retention by X% for high-risk segments), allowing executives to quickly see potential outcomes.

## UI Layout
1. **Main Dashboard Page**
   - Shows all metrics for all agents as a whole
   - Includes filters to select particular segments
   - All metrics on the page recalculate based on the selected segment filter

2. **Intervention Simulation Page**
   - Allows selection of a segment
   - Allows selection of an intervention
   - Shows simulation results for the selected segment and intervention

## Data Model
- Single DynamoDB table to store agents and their personal metrics
- Simulation rules hardcoded into backend source code
- Load 500 agents using BatchGetItem at runtime
- Perform aggregations in memory
- Script to populate the database with sample data

## Project Goals
1. Create a visually impressive front end using React
2. Implement a functional back end that retrieves metrics from DynamoDB
3. Support segmenting of agents for detailed analysis
4. Enable simulation of interventions on different segments
5. Demonstrate to Zillow executives how this tool could help monitor and improve relationships with real estate professionals

## Success Criteria
The project will be successful if it:
1. Provides clear visibility into the health of real estate professional relationships
2. Enables early identification of at-risk segments
3. Allows simulation of targeted interventions to improve metrics
4. Presents a compelling case for how Zillow can address the risk identified in their 10-K
5. Demonstrates technical proficiency and business understanding to Zillow executives