# Backend Development Standards

## Core Principle: Supabase-First Architecture

This project uses Supabase as the exclusive backend service. This document outlines our standards and best practices.

## 1. Database Operations

### ✅ DO Use
```typescript
// Always use the Supabase client for database operations
import { supabase } from '@/lib/supabase';

// Fetching data
const { data, error } = await supabase
  .from('table_name')
  .select('*');

// Inserting data
const { data, error } = await supabase
  .from('table_name')
  .insert([{ column: value }])
  .select();

// Updating data
const { data, error } = await supabase
  .from('table_name')
  .update({ column: value })
  .eq('id', id)
  .select();
```

### ❌ DON'T Use
```typescript
// Don't use Prisma
import { prisma } from '@/lib/prisma';
const data = await prisma.table.findMany();

// Don't use raw SQL queries
const result = await executeSQL('SELECT * FROM table');
```

## 2. Authentication

### ✅ DO Use
```typescript
// Always use Supabase Auth
import { supabase } from '@/lib/supabase';

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

### ❌ DON'T Use
```typescript
// Don't use NextAuth.js
import { getServerSession } from 'next-auth';
const session = await getServerSession();

// Don't use custom auth solutions
const user = await customAuthCheck();
```

## 3. File Structure

### API Routes
```typescript
// src/app/api/[resource]/route.ts
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) return unauthorized();
  
  const { data, error } = await supabase
    .from('table')
    .select('*');
  // ...
}
```

### Services
```typescript
// src/services/resourceService.ts
import { supabase } from '@/lib/supabase';

export class ResourceService {
  static async getAll() {
    return supabase
      .from('resource')
      .select('*');
  }
}
```

## 4. Error Handling

### Standard Error Pattern
```typescript
try {
  const { data, error } = await supabase.from('table').select('*');
  
  if (error) {
    console.error('Database error:', error);
    return { error: 'An error occurred while fetching data' };
  }
  
  return { data };
} catch (error) {
  console.error('Unexpected error:', error);
  return { error: 'An unexpected error occurred' };
}
```

## 5. Database Schema

### Naming Conventions
- Use `snake_case` for table and column names
- Include `created_at` and `updated_at` timestamps
- Use appropriate data types (e.g., `uuid`, `timestamptz`)

### Example Table Structure
```sql
CREATE TABLE table_name (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 6. Row Level Security (RLS)

Always implement RLS policies:
```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data"
ON table_name FOR SELECT
USING (auth.uid() = user_id);
```

## 7. Type Safety

### Define Types for Database Tables
```typescript
// src/types/database.ts
export interface DbTable {
  id: string;
  created_at: string;
  updated_at: string;
  // ... other fields
}
```

### Use Generated Types
```typescript
import { Database } from '@/types/supabase';
type DbTable = Database['public']['Tables']['table_name']['Row'];
```

## 8. Environment Setup

Required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 9. Development Workflow

1. Start with database schema changes in Supabase
2. Update TypeScript types
3. Implement RLS policies
4. Create/update API routes
5. Add error handling
6. Test with Supabase client

## 10. Testing

### API Route Tests
```typescript
describe('API Route', () => {
  it('should fetch data from Supabase', async () => {
    const { data, error } = await supabase
      .from('table')
      .select('*');
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase TypeScript Support](https://supabase.com/docs/reference/typescript-support)
- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Project Setup Guide](./SUPABASE_SETUP.md)

## Checklist for New Features

When implementing new features:

1. [ ] Database schema follows Supabase conventions
2. [ ] RLS policies are implemented
3. [ ] TypeScript types are generated/updated
4. [ ] Error handling follows standard pattern
5. [ ] Environment variables are documented
6. [ ] Tests are implemented
7. [ ] Documentation is updated 