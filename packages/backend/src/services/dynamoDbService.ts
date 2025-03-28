import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand,
  GetCommand,
  PutCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import { Agent, SegmentType } from 'shared';

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-2'
});

// Create DynamoDB Document client
const dynamoDb = DynamoDBDocumentClient.from(client);

// Table name
const TABLE_NAME = process.env.AGENTS_TABLE_NAME || 'ZillowAgents';

/**
 * Get all agents from DynamoDB
 */
export async function getAllAgents(): Promise<Agent[]> {
  const params = {
    TableName: TABLE_NAME
  };

  try {
    const command = new ScanCommand(params);
    const result = await dynamoDb.send(command);
    return result.Items as Agent[];
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
}

/**
 * Get agents by segment type and value
 */
export async function getAgentsBySegment(segmentType: SegmentType, segmentValue: string): Promise<Agent[]> {
  const params = {
    TableName: TABLE_NAME,
    IndexName: `${segmentType}Index`,
    KeyConditionExpression: '#segmentType = :segmentValue',
    ExpressionAttributeNames: {
      '#segmentType': segmentType
    },
    ExpressionAttributeValues: {
      ':segmentValue': segmentValue
    }
  };

  try {
    const command = new QueryCommand(params);
    const result = await dynamoDb.send(command);
    return result.Items as Agent[];
  } catch (error) {
    console.error(`Error fetching agents by segment ${segmentType}=${segmentValue}:`, error);
    throw error;
  }
}

/**
 * Get agent by ID
 */
export async function getAgentById(id: string): Promise<Agent | null> {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id
    }
  };

  try {
    const command = new GetCommand(params);
    const result = await dynamoDb.send(command);
    return result.Item as Agent || null;
  } catch (error) {
    console.error(`Error fetching agent with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create or update an agent
 */
export async function putAgent(agent: Agent): Promise<Agent> {
  const params = {
    TableName: TABLE_NAME,
    Item: agent
  };

  try {
    const command = new PutCommand(params);
    await dynamoDb.send(command);
    return agent;
  } catch (error) {
    console.error('Error putting agent:', error);
    throw error;
  }
}

/**
 * Delete an agent
 */
export async function deleteAgent(id: string): Promise<void> {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id
    }
  };

  try {
    const command = new DeleteCommand(params);
    await dynamoDb.send(command);
  } catch (error) {
    console.error(`Error deleting agent with ID ${id}:`, error);
    throw error;
  }
}