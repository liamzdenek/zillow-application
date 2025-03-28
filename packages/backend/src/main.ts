import express from 'express';
import serverless from 'serverless-http';
import { z } from 'zod';
import {
  HealthCheckResponse,
  MetricsResponse,
  SegmentType,
  SimulationRequest,
  SimulationResponse,
  InterventionsResponse,
  SegmentsResponse,
  AvailableIntervention
} from 'shared';
import { getMetrics } from './services/metricsService';
import { simulateIntervention } from './services/simulationService';

// Initialize Express app
const app = express();
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthCheck: HealthCheckResponse = {
    status: 'healthy',
    dependencies: {
      dynamodb: 'connected' // In a real implementation, we would check the actual connection
    },
    timestamp: new Date().toISOString()
  };
  
  res.json(healthCheck);
});

// Get available segments
app.get('/api/segments', (req, res) => {
  const response: SegmentsResponse = {
    success: true,
    data: {
      experienceLevel: ['rookie', 'established', 'veteran'],
      businessModel: ['individual', 'team', 'brokerage'],
      specialization: ['residential', 'residentialInvestor', 'luxury', 'commercial'],
      platformEngagement: ['low', 'medium', 'high'],
      spendLevel: ['lessThan1k', 'lessThan10k', 'moreThan10k'],
      marketTypeLocation: ['suburban', 'urban', 'rural'],
      marketTypeCondition: ['warm', 'hot', 'cooling']
    }
  };
  
  res.json(response);
});

// Get metrics
app.get('/api/metrics', async (req, res) => {
  try {
    // Validate request
    const schema = z.object({
      segmentType: z.enum(['experienceLevel', 'businessModel', 'specialization',
                           'platformEngagement', 'spendLevel', 'marketTypeLocation',
                           'marketTypeCondition']).optional(),
      segmentValue: z.string().optional()
    });
    
    const query = schema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Invalid request parameters',
          details: query.error
        }
      });
    }
    
    // Get metrics from service
    const metrics = await getMetrics(query.data.segmentType as SegmentType, query.data.segmentValue);
    
    // Return response
    const response: MetricsResponse = {
      success: true,
      data: metrics
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching metrics'
      }
    });
  }
});

// Simulate intervention
app.post('/api/simulate', async (req, res) => {
  try {
    // Validate request
    const schema = z.object({
      interventionType: z.enum(['discount-offer', 'bundled-service', 'personalized-training',
                               'account-manager', 'usage-incentive', 'targeted-content',
                               'performance-review']),
      segmentType: z.enum(['experienceLevel', 'businessModel', 'specialization',
                          'platformEngagement', 'spendLevel', 'marketTypeLocation',
                          'marketTypeCondition']),
      segmentValue: z.string()
    });
    
    const body = schema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Invalid request parameters',
          details: body.error
        }
      });
    }
    
    // Simulate intervention using service
    const simulationResult = await simulateIntervention(
      body.data.interventionType,
      body.data.segmentType,
      body.data.segmentValue
    );
    
    // Return response
    const response: SimulationResponse = {
      success: true,
      data: simulationResult
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error simulating intervention:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while simulating the intervention'
      }
    });
  }
});

// Get available interventions
app.get('/api/interventions', (req, res) => {
  const interventions: AvailableIntervention[] = [
    {
      id: 'discount-offer',
      name: 'Discount Offer',
      description: '10% discount on premium features',
      applicableSegments: ['spendLevel', 'platformEngagement']
    },
    {
      id: 'bundled-service',
      name: 'Bundled Service Package',
      description: 'Combine multiple services at a reduced price',
      applicableSegments: ['businessModel', 'specialization']
    },
    {
      id: 'personalized-training',
      name: 'Personalized Training',
      description: 'Custom training sessions for specific needs',
      applicableSegments: ['experienceLevel', 'specialization']
    },
    {
      id: 'account-manager',
      name: 'Account Manager Assignment',
      description: 'Dedicated account manager for premium support',
      applicableSegments: ['spendLevel', 'businessModel']
    },
    {
      id: 'usage-incentive',
      name: 'Usage Incentive Program',
      description: 'Rewards for platform engagement',
      applicableSegments: ['platformEngagement', 'experienceLevel']
    },
    {
      id: 'targeted-content',
      name: 'Targeted Content Delivery',
      description: 'Personalized content based on interests',
      applicableSegments: ['specialization', 'marketTypeLocation']
    },
    {
      id: 'performance-review',
      name: 'Personalized Performance Review',
      description: 'In-depth analysis of agent performance',
      applicableSegments: ['experienceLevel', 'businessModel']
    }
  ];
  
  const response: InterventionsResponse = {
    success: true,
    data: interventions
  };
  
  res.json(response);
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
});

// For local development
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}

// Export serverless handler
export const handler = serverless(app);
