#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
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

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Tables to verify
const tables = ['users', 'clients', 'estimates', 'line_items', 'items'];

// Function to check if a table exists
async function tableExists(tableName) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(1);
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Table doesn't exist
      return false;
    }
    console.error(`Error checking table ${tableName}:`, error);
    return false;
  }
  
  return true;
}

// Main function to verify setup
async function verifySetup() {
  console.log('Verifying Supabase database setup...');
  
  let allTablesExist = true;
  
  for (const table of tables) {
    const exists = await tableExists(table);
    console.log(`Table "${table}": ${exists ? '✅ Exists' : '❌ Not found'}`);
    
    if (!exists) {
      allTablesExist = false;
    }
  }
  
  if (allTablesExist) {
    console.log('\n✅ Database setup is complete. All tables exist.');
    console.log('\nYou can now test your application with:');
    console.log('  npm run dev');
  } else {
    console.log('\n❌ Some tables are missing.');
    console.log('Please follow the manual setup instructions in SUPABASE_SETUP.md');
    console.log('Copy and paste the SQL from supabase/manual_setup.sql into the Supabase SQL Editor.');
  }
}

// Run the verification
verifySetup().catch(error => {
  console.error('Verification failed:', error);
  process.exit(1);
}); 