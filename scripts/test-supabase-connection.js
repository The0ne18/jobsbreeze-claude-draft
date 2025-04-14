#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables from .env.local
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
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set');
  process.exit(1);
}

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log(`URL: ${supabaseUrl}`);
  
  // Test with anonymous key
  try {
    console.log('\n--- Testing with Anonymous Key ---');
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    const { data: anonData, error: anonError } = await supabaseAnon.auth.getSession();
    
    if (anonError) {
      console.error('❌ Anonymous connection failed:', anonError.message);
    } else {
      console.log('✅ Anonymous connection successful!');
      console.log('Session:', anonData?.session ? 'Active' : 'None');
    }
  } catch (err) {
    console.error('❌ Anonymous connection test error:', err.message);
  }

  // Test with service key if available
  if (supabaseServiceKey) {
    try {
      console.log('\n--- Testing with Service Role Key ---');
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      
      // Try to get a list of all users (requires service role privileges)
      const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (adminError) {
        console.error('❌ Service role connection failed:', adminError.message);
      } else {
        console.log('✅ Service role connection successful!');
        console.log(`Users found: ${adminData?.users?.length || 0}`);
      }
    } catch (err) {
      console.error('❌ Service role connection test error:', err.message);
    }
  } else {
    console.log('\n⚠️ Service role key not provided. Skipping admin connection test.');
  }
  
  // Test database access
  try {
    console.log('\n--- Testing Database Access ---');
    const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
    
    // Try querying the PostgreSQL version
    const { data, error } = await supabase.rpc('get_postgres_version');
    
    if (error) {
      console.error('❌ Database access failed:', error.message);
      
      // Fall back to a table query
      console.log('Trying to list tables instead...');
      const { data: tableData, error: tableError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')
        .limit(5);
      
      if (tableError) {
        console.error('❌ Table listing failed:', tableError.message);
      } else {
        console.log('✅ Table listing successful!');
        console.log('Tables:', tableData.map(t => t.tablename).join(', ') || 'None found');
      }
    } else {
      console.log('✅ Database access successful!');
      console.log('PostgreSQL version:', data);
    }
  } catch (err) {
    console.error('❌ Database access test error:', err.message);
  }
  
  console.log('\nConnection testing completed.');
}

testConnection().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
}); 