import { DynamoDBClient, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  BatchWriteCommandInput,
  ScanCommand,
  ScanCommandInput
} from '@aws-sdk/lib-dynamodb';
import { Agent } from 'shared';

/**
 * Upload agents to DynamoDB
 * @param agents Array of agent records to upload
 * @param tableName DynamoDB table name
 * @param region AWS region
 */
export async function uploadAgents(
  agents: Agent[],
  tableName: string,
  region: string
): Promise<void> {
  // Initialize DynamoDB client
  const client = new DynamoDBClient({ region });
  const dynamoDb = DynamoDBDocumentClient.from(client);
  
  // Process in batches of 25 (DynamoDB batch write limit)
  const batchSize = 25;
  const batches = [];
  
  for (let i = 0; i < agents.length; i += batchSize) {
    batches.push(agents.slice(i, i + batchSize));
  }
  
  console.log(`Uploading ${batches.length} batches of ${batchSize} agents...`);
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const params: BatchWriteCommandInput = {
      RequestItems: {
        [tableName]: batch.map(agent => ({
          PutRequest: {
            Item: agent
          }
        }))
      }
    };
    
    try {
      await dynamoDb.send(new BatchWriteCommand(params));
      console.log(`Batch ${i + 1}/${batches.length} uploaded successfully`);
    } catch (error) {
      console.error(`Error uploading batch ${i + 1}:`, error);
      throw error;
    }
  }
}

/**
 * Check if a DynamoDB table exists
 * @param tableName DynamoDB table name
 * @param region AWS region
 */
export async function tableExists(
  tableName: string,
  region: string
): Promise<boolean> {
  try {
    const client = new DynamoDBClient({ region });
    const command = new DescribeTableCommand({
      TableName: tableName
    });
    
    // Try to describe the table
    await client.send(command);
    
    return true;
  } catch (error: any) {
    if (error.name === 'ResourceNotFoundException') {
      return false;
    }
    throw error;
  }
}

/**
 * Clear all data from a DynamoDB table
 * @param tableName DynamoDB table name
 * @param region AWS region
 */
export async function clearTable(
  tableName: string,
  region: string
): Promise<void> {
  // This is a simplified implementation that doesn't handle large tables
  // For production use, you would need to scan and delete in batches
  
  const client = new DynamoDBClient({ region });
  const dynamoDb = DynamoDBDocumentClient.from(client);
  
  try {
    // Scan the table to get all items
    const scanCommand = new ScanCommand({
      TableName: tableName
    });
    
    const scanResult = await dynamoDb.send(scanCommand);
    
    if (!scanResult.Items || scanResult.Items.length === 0) {
      console.log(`Table ${tableName} is already empty`);
      return;
    }
    
    // Delete items in batches
    const items = scanResult.Items;
    const batchSize = 25;
    const batches = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    
    console.log(`Deleting ${batches.length} batches of items...`);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const params: BatchWriteCommandInput = {
        RequestItems: {
          [tableName]: batch.map(item => ({
            DeleteRequest: {
              Key: {
                id: item.id
              }
            }
          }))
        }
      };
      
      await dynamoDb.send(new BatchWriteCommand(params));
      console.log(`Batch ${i + 1}/${batches.length} deleted successfully`);
    }
    
    console.log(`Table ${tableName} cleared successfully`);
  } catch (error) {
    console.error(`Error clearing table ${tableName}:`, error);
    throw error;
  }
}