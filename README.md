# Zillow Real Estate Professional Health Dashboard

A data-driven dashboard for monitoring the health of relationships with real estate professionals, addressing a key risk identified in Zillow's 10-K: "Our business could be harmed if real estate professionals reduce or end their spending with us or if we are unable to effectively manage advertising and product inventory or pricing."

## 🚀 Features

- **Comprehensive Metrics Dashboard**: Monitor financial health, listing activity, lead management, customer satisfaction, early warning indicators, and revenue impact metrics
- **Segment Filtering**: Filter metrics by experience level, business model, specialization, platform engagement, spend level, and market type
- **Intervention Simulation**: Simulate the impact of different interventions (discount offers, bundled services, training, etc.) on specific segments
- **Early Warning System**: Identify at-risk professionals before they reduce spending or leave the platform
- **Data-Driven Decision Making**: Make informed decisions about where to allocate resources for maximum impact

## 🏗️ Architecture

This project follows a modern cloud-native architecture:

- **Frontend**: React application with TypeScript and Tailwind CSS
- **Backend**: Serverless API using AWS Lambda and API Gateway
- **Database**: DynamoDB with a single-table design
- **Infrastructure**: Deployed using AWS CDK

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- TanStack Router
- Context API for state management

### Backend
- Node.js
- Express
- AWS Lambda
- API Gateway
- DynamoDB

### Infrastructure
- AWS CDK
- CloudFront
- S3
- IAM

## 📊 Metrics Tracked

### Financial Health Metrics
- Average revenue per agent
- Customer acquisition cost
- Lifetime value

### Listing Activity
- New listings
- Listing updates
- Time to sell

### Lead Management Metrics
- Response time
- Conversion rates

### Customer Satisfaction
- Support ticket volume
- Support NPS
- Support resolution times

### Early Warning System
- Churn prediction score
- Engagement decline alerts
- Satisfaction trend analysis
- Price sensitivity indicators

### Revenue Impact
- Revenue retention rate
- Revenue at risk
- Revenue growth rate

## 🧩 Agent Segmentation

- **Experience Level**: Rookie, Established, Veteran
- **Business Model**: Individual, Team, Brokerage
- **Specialization**: Residential, Residential investor, Luxury, Commercial
- **Platform Engagement Level**: Low, Medium, High
- **Spend Level**: <$1k/yr, <$10k/yr, >$10k/yr
- **Market Type (Location)**: Suburban, Urban, Rural
- **Market Type (Condition)**: Warm, Hot, Cooling

## 🔄 Interventions to Simulate

1. Discount offer
2. Bundled service package
3. Personalized training
4. Assignment of an account manager
5. Usage incentive program
6. Targeted content delivery
7. Personalized performance review

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- AWS CLI configured with appropriate credentials
- AWS CDK installed globally

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/zillow-application.git
   cd zillow-application
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Build the project
   ```bash
   npx nx run-many --target=build --all
   ```

### Deployment

1. Bootstrap your AWS environment (if not already done)
   ```bash
   AWS_PROFILE=your-profile AWS_REGION=your-region npx cdk bootstrap
   ```

2. Deploy the stack
   ```bash
   AWS_PROFILE=your-profile AWS_REGION=your-region npx nx run cdk:deploy
   ```

### Local Development

1. Start the frontend development server
   ```bash
   npx nx run frontend:serve
   ```

2. Start the backend locally
   ```bash
   npx nx run backend:serve
   ```

3. Generate sample data
   ```bash
   npx nx run data-generator:serve
   ```

## 📁 Project Structure

```
zillow-application/
├── packages/
│   ├── backend/             # Backend API
│   ├── cdk/                 # Infrastructure as code
│   ├── data-generator/      # Sample data generation
│   ├── frontend/            # React frontend
│   └── shared/              # Shared types and utilities
├── memory-bank/             # Project documentation
├── nx.json                  # Nx configuration
└── package.json             # Root package.json
```

## 🌐 Live Demo

The application is deployed and accessible at:

- Frontend: [https://d1lm2ezci363i3.cloudfront.net](https://d1lm2ezci363i3.cloudfront.net)
- API: [https://fdf213jq7b.execute-api.us-west-2.amazonaws.com/prod/api/](https://fdf213jq7b.execute-api.us-west-2.amazonaws.com/prod/api/)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Zillow for the inspiration and business context
- AWS for the cloud infrastructure
- React and the entire frontend ecosystem
- The serverless community for best practices and patterns