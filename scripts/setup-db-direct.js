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
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set');
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
  // Try to use the SQL API
  const managementApiUrl = `https://api.supabase.com/v1/projects/${projectRef}/sql`;
  
  try {
    // First, try the Management API which requires a service key
    console.log('Attempting to use the Management API...');
    console.log('Warning: This requires a service key, which we likely don\'t have.');
    console.log('This attempt will probably fail, but we\'ll try another method afterward.');
    
    const managementResponse = await axios.post(managementApiUrl, 
      { query: sqlContent },
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        }
      }
    );
    
    console.log('SQL execution successful via Management API!');
    return managementResponse.data;
  } catch (managementError) {
    console.log('Management API attempt failed as expected:', managementError.message);
    console.log('Falling back to REST API methods...');
    
    // Try alternate methods to set up the database
    await tryAlternateMethods();
  }
}

async function tryAlternateMethods() {
  console.log('\nTrying to create tables via direct REST API calls...');
  
  try {
    // Try to create users table first
    const usersResponse = await axios.post(
      `${supabaseUrl}/rest/v1/users`, 
      [{ email: 'test@example.com', password: 'password123' }],
      { 
        headers: { 
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        }
      }
    );
    
    console.log('User creation attempt response:', usersResponse.status);
  } catch (error) {
    console.log('User creation failed:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    }
  }
  
  console.log('\n⚠️ Direct table creation is challenging via REST API.');
  console.log('⚠️ Please use the SQL Editor method as described in SUPABASE_SETUP.md');
  console.log('⚠️ Copy and paste the SQL from supabase/manual_setup.sql into the Supabase SQL Editor.');
  
  // Try to create some test data to check if tables exist
  await checkTablesExist();
}

async function checkTablesExist() {
  console.log('\nChecking if tables already exist...');
  
  const tables = ['users', 'clients', 'estimates', 'line_items', 'items'];
  
  for (const table of tables) {
    try {
      const response = await axios.get(
        `${supabaseUrl}/rest/v1/${table}?limit=1`, 
        { 
          headers: { 
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );
      
      console.log(`✅ Table "${table}" exists and returned status ${response.status}`);
    } catch (error) {
      console.log(`❌ Table "${table}" access failed: ${error.message}`);
      if (error.response) {
        // Show detailed error for debugging
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Error: ${JSON.stringify(error.response.data)}`);
      }
    }
  }
}

// Main function
async function main() {
  console.log('Setting up Supabase database via REST API...');
  
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
  await executeSql(sqlContent);
  
  console.log('\nDatabase setup operation completed.');
  console.log('Note: Additional manual steps via the Supabase dashboard may still be needed.');
  
  // Print helpful summary
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

// Run the script
main().catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
}); 