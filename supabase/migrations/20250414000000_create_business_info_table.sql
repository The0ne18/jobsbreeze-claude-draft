-- Create business_info table
CREATE TABLE IF NOT EXISTS "business_info" (
  "id" SERIAL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "business_name" TEXT DEFAULT '',
  "email" TEXT DEFAULT '',
  "phone" TEXT DEFAULT '',
  "address" TEXT DEFAULT '',
  "website" TEXT DEFAULT '',
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS "business_info_user_id_idx" ON "business_info"("user_id");

-- Create a unique constraint to ensure one business info per user
ALTER TABLE "business_info" ADD CONSTRAINT "business_info_user_id_key" UNIQUE ("user_id");

-- Create trigger for automatic updated_at
CREATE TRIGGER update_business_info_updated_at
BEFORE UPDATE ON "business_info"
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Add Row Level Security (RLS)
ALTER TABLE "business_info" ENABLE ROW LEVEL SECURITY;

-- Create policy for select (read)
CREATE POLICY "Allow users to read only their business info" 
ON "business_info" FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for insert
CREATE POLICY "Allow users to insert their own business info" 
ON "business_info" FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy for update
CREATE POLICY "Allow users to update only their business info" 
ON "business_info" FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy for delete
CREATE POLICY "Allow users to delete only their business info" 
ON "business_info" FOR DELETE 
USING (auth.uid() = user_id);
