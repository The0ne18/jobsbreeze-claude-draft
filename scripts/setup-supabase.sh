#!/bin/bash
set -e

# Check if SUPABASE_URL and SUPABASE_KEY are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set"
  echo "Please set these environment variables or add them to your .env.local file"
  exit 1
fi

# Create directory structure if it doesn't exist
mkdir -p supabase/migrations

# Ensure the migration file exists
if [ ! -f "supabase/migrations/20250413000000_create_tables.sql" ]; then
  echo "Error: Migration file not found"
  echo "Please ensure the file supabase/migrations/20250413000000_create_tables.sql exists"
  exit 1
fi

# Install Supabase CLI if not already installed
if ! command -v supabase &> /dev/null; then
  echo "Installing Supabase CLI..."
  npm install -g supabase
fi

# Log in to Supabase (requires interactive input)
echo "Logging in to Supabase..."
supabase login

# Get the project ID from the URL
PROJECT_ID=$(echo $NEXT_PUBLIC_SUPABASE_URL | awk -F 'https://' '{print $2}' | awk -F '.' '{print $1}')
echo "Project ID: $PROJECT_ID"

# Apply migrations using the Supabase CLI
echo "Applying migrations..."
cat supabase/migrations/20250413000000_create_tables.sql | supabase db sql --project-ref $PROJECT_ID

echo "Migrations applied successfully!"
echo "Your Supabase tables have been created." 