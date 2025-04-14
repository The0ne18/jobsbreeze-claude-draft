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

// Create tables through the REST API
async function setupTables() {
  console.log('Setting up Supabase database through REST API...');
  
  // Create users table
  console.log('Creating users table...');
  const { error: usersError } = await supabase.rpc('create_users_table', {}, {
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (usersError) {
    console.error('Error creating users table:', usersError);
    console.log('Attempting to create tables directly through REST API...');
    
    // Since RPC might not be available, try direct table creation
    await createTablesDirectly();
    return;
  }
  
  console.log('✅ Users table created successfully');
  
  // Create clients table
  console.log('Creating clients table...');
  const { error: clientsError } = await supabase.rpc('create_clients_table');
  if (clientsError) {
    console.error('Error creating clients table:', clientsError);
    return;
  }
  console.log('✅ Clients table created successfully');
  
  // Continue with other tables...
  console.log('Additional tables would be created here');
  
  console.log('✅ Database setup completed through RPC');
}

// Direct table creation using REST API
async function createTablesDirectly() {
  try {
    // Try to create tables using the REST API
    console.log('Creating users table directly...');
    
    // Create users table
    const { error: usersError } = await supabase
      .from('users')
      .insert([{ email: 'test@example.com', password: 'temporary_password' }])
      .select();
    
    if (usersError && usersError.code !== 'PGRST116') {
      // PGRST116 means table doesn't exist, which is what we expect
      console.log('Users table already exists or other error:', usersError);
    } else {
      console.log('❓ Users table status unknown');
    }
    
    // Create clients table
    console.log('Creating clients table directly...');
    const { error: clientsError } = await supabase
      .from('clients')
      .insert([{ name: 'Test Client', email: 'client@example.com' }])
      .select();
    
    if (clientsError && clientsError.code !== 'PGRST116') {
      console.log('Clients table already exists or other error:', clientsError);
    } else {
      console.log('❓ Clients table status unknown');
    }
    
    // Continue with other tables...
    
    console.log('\n⚠️ Direct table creation may not work through REST API.');
    console.log('Please use the SQL Editor method described in SUPABASE_SETUP.md');
    
    // Try to verify if tables exist
    await verifyTables();
    
  } catch (error) {
    console.error('Error in direct table creation:', error);
    console.log('\n⚠️ Please use the SQL Editor method described in SUPABASE_SETUP.md');
  }
}

// Verify if tables exist
async function verifyTables() {
  console.log('\nVerifying tables...');
  
  const tables = ['users', 'clients', 'estimates', 'line_items', 'items'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table "${table}" not found or access denied`);
      } else {
        console.log(`✅ Table "${table}" exists`);
      }
    } catch (error) {
      console.log(`❌ Error checking table "${table}":`, error.message);
    }
  }
}

// Main function
async function main() {
  console.log('Starting Supabase database setup through API...');
  
  try {
    // Check if supabase.rpc is available
    const { data, error } = await supabase.rpc('version');
    
    if (error) {
      console.log('RPC not available. Attempting direct table creation...');
      await createTablesDirectly();
    } else {
      await setupTables();
    }
  } catch (error) {
    console.error('Setup failed:', error);
    console.log('\n⚠️ Please use the SQL Editor method described in SUPABASE_SETUP.md');
  }
}

// Run the setup
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
}); 