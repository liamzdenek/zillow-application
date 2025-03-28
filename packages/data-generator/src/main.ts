import { generateAgents } from './generators/agent';
import { uploadAgents, tableExists, clearTable } from './services/dynamoDbService';

/**
 * Main function to generate and upload agent data
 */
async function main() {
  try {
    // Parse command-line arguments
    const numAgents = parseInt(process.env.NUM_AGENTS || '500');
    const tableName = process.env.TABLE_NAME || 'ZillowAgents';
    const region = process.env.AWS_REGION || 'us-west-2';
    const clearExistingData = process.env.CLEAR_EXISTING_DATA === 'true';
    
    console.log('Zillow Real Estate Professional Health Dashboard - Data Generator');
    console.log('==============================================================');
    console.log(`Configuration:`);
    console.log(`- Number of agents: ${numAgents}`);
    console.log(`- Table name: ${tableName}`);
    console.log(`- AWS region: ${region}`);
    console.log(`- Clear existing data: ${clearExistingData}`);
    console.log('');
    
    // Check if table exists
    console.log(`Checking if table ${tableName} exists...`);
    const exists = await tableExists(tableName, region);
    
    if (!exists) {
      console.error(`Table ${tableName} does not exist. Please create it first using the CDK stack.`);
      process.exit(1);
    }
    
    console.log(`Table ${tableName} exists.`);
    
    // Clear existing data if requested
    if (clearExistingData) {
      console.log(`Clearing existing data from table ${tableName}...`);
      await clearTable(tableName, region);
    }
    
    // Generate agent records
    console.log(`Generating ${numAgents} agent records...`);
    const agents = generateAgents(numAgents);
    
    // Upload to DynamoDB
    console.log(`Uploading ${numAgents} agent records to DynamoDB...`);
    await uploadAgents(agents, tableName, region);
    
    console.log('Data generation complete!');
  } catch (error) {
    console.error('Error generating data:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
