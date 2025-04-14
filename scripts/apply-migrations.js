#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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

// Extract the project ID from the URL for logging
const projectId = supabaseUrl.match(/https:\/\/([^.]+)/)[1];

// Function to execute SQL statements sequentially
async function executeSQL(sql) {
  // Split the SQL into individual statements
  const statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt !== '');

  console.log(`Found ${statements.length} SQL statements to execute`);

  // Execute each statement one by one
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    
    // Skip comments and empty lines
    if (statement.startsWith('--') || statement === '') {
      continue;
    }

    try {
      const { error } = await supabase.rpc('postgresql_query', {
        query_text: statement
      });

      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
        // Continue with other statements
      } else {
        console.log(`Successfully executed statement ${i + 1}`);
      }
    } catch (error) {
      console.error(`Exception executing statement ${i + 1}:`, error.message);
      // Continue with other statements
    }
  }
}

// Read the SQL file
const sqlFile = path.join(__dirname, '..', 'supabase', 'manual_setup.sql');
let sqlContent;

try {
  sqlContent = fs.readFileSync(sqlFile, 'utf8');
} catch (error) {
  console.error(`Error reading SQL file: ${error.message}`);
  process.exit(1);
}

console.log('Applying migrations to Supabase database...');
console.log(`Project: ${projectId}`);

// Execute the SQL
executeSQL(sqlContent)
  .then(() => {
    console.log('Database migration completed');
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 