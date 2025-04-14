#!/usr/bin/env node

console.log(`
=====================================================
  HOW TO GET YOUR SUPABASE SERVICE ROLE KEY
=====================================================

The Service Role key (also called Admin API key) is required to run SQL 
directly via the API. This is different from the anon key you're using
for client-side access.

Steps to get your Service Role key:

1. Go to https://app.supabase.io/ and log in
2. Select your project
3. Go to Project Settings (gear icon in bottom left)
4. Go to API tab
5. Under Project API keys, find "service_role" key (the one marked as secret)
6. Click "Copy" to copy the key

⚠️ SECURITY WARNING ⚠️
- This key has FULL ACCESS to your database, bypassing RLS policies
- NEVER use this key in client-side code or commit it to git
- Use it only for administrative tasks like running migrations

Once you have the key, you can update your .env.local:

SUPABASE_SERVICE_KEY=your_service_role_key_here

After adding this key, you can run SQL with:

npm run setup-db-with-admin

=====================================================
`); 