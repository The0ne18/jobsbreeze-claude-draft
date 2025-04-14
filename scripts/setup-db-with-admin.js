#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if available
try {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  });
} catch (error) {
  console.log('No .env.local file found, using existing environment variables');
}

// Check required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL must be set');
  process.exit(1);
}

if (!serviceKey) {
  console.error('Error: SUPABASE_SERVICE_KEY must be set');
  console.error('This is different from your anon key! It\'s the service_role key from the Supabase dashboard.');
  console.error('Run "node scripts/generate-admin-token.js" for instructions on how to get it.');
  process.exit(1);
}

// Extract project reference
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)[1];
if (!projectRef) {
  console.error('Error: Could not extract project reference from Supabase URL');
  process.exit(1);
}

// Function to execute SQL against the Supabase REST API
async function executeSql(sqlContent) {
  try {
    // SQL API endpoint for service_role access
    console.log('Executing SQL using service role key...');
    
    // Use the REST API to execute SQL
    const response = await axios.post(
      `${supabaseUrl}/rest/v1/rpc/pgrest_exec`, 
      { sql: sqlContent },
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey
        }
      }
    );
    
    console.log('SQL execution successful!');
    console.log('Response:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('SQL execution failed:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
      
      // Check if the RPC does not exist
      if (error.response.data && error.response.data.message && 
          error.response.data.message.includes('function public.pgrest_exec() does not exist')) {
        console.log('\n⚠️ The pgrest_exec function does not exist in your database.');
        console.log('⚠️ Most Supabase instances do not have this function by default.');
        console.log('⚠️ Please use the SQL Editor method as described in SUPABASE_SETUP.md');
      }
    }
    
    console.log('\nFalling back to Management API...');
    return await executeWithManagementApi(sqlContent);
  }
}

// Try using the management API as a fallback
async function executeWithManagementApi(sqlContent) {
  // Management API endpoint
  const managementApiUrl = `https://api.supabase.com/v1/projects/${projectRef}/sql`;
  
  try {
    console.log('Executing SQL via Management API...');
    
    const response = await axios.post(
      managementApiUrl, 
      { query: sqlContent },
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`
        }
      }
    );
    
    console.log('SQL execution successful via Management API!');
    return response.data;
    
  } catch (error) {
    console.error('Management API execution failed:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    
    console.log('\n❌ All API methods failed. Please use the SQL Editor method.');
    return false;
  }
}

// Verify if tables exist
async function verifyTables() {
  console.log('\nVerifying tables...');
  
  const tables = ['users', 'clients', 'estimates', 'line_items', 'items'];
  let allTablesExist = true;
  
  for (const table of tables) {
    try {
      const response = await axios.get(
        `${supabaseUrl}/rest/v1/${table}?limit=1`, 
        { 
          headers: { 
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`
          }
        }
      );
      
      console.log(`✅ Table "${table}" exists and returned status ${response.status}`);
    } catch (error) {
      console.log(`❌ Table "${table}" access failed: ${error.message}`);
      
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        // If the error is that the relation doesn't exist, the table is missing
        if (errorData.code === '42P01' || 
            (errorData.message && errorData.message.includes('does not exist'))) {
          console.log(`   Error: Table "${table}" does not exist`);
          allTablesExist = false;
        } else {
          console.log(`   Status: ${error.response.status}`);
          console.log(`   Error: ${JSON.stringify(error.response.data)}`);
        }
      }
    }
  }
  
  return allTablesExist;
}

// Main function
async function main() {
  console.log('Setting up Supabase database via Admin API...');
  
  // First check if tables already exist
  const tablesExist = await verifyTables();
  
  if (tablesExist) {
    console.log('\n✅ All tables already exist. No need to create them.');
    return;
  }
  
  // Read the SQL content
  const sqlPath = path.join(__dirname, '..', 'supabase', 'manual_setup.sql');
  let sqlContent;
  
  try {
    sqlContent = fs.readFileSync(sqlPath, 'utf8');
  } catch (error) {
    console.error(`Error reading SQL file: ${error.message}`);
    process.exit(1);
  }
  
  // Execute the SQL
  const result = await executeSql(sqlContent);
  
  if (result) {
    console.log('\n✅ Database setup completed successfully.');
    // Check again to see if tables were created
    await verifyTables();
  } else {
    console.log('\n❌ Database setup failed.');
    console.log('\n-----------------------------');
    console.log('Manual Setup Instructions:');
    console.log('1. Go to https://app.supabase.io');
    console.log('2. Select your project');
    console.log('3. Go to the SQL Editor');
    console.log('4. Create a new query');
    console.log('5. Copy and paste the contents of supabase/manual_setup.sql');
    console.log('6. Click "Run" to execute the SQL and create the tables');
    console.log('-----------------------------');
  }
}

// Run the script
main().catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
}); 