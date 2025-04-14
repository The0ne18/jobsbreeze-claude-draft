-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create clients table
CREATE TABLE IF NOT EXISTS "clients" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "phone" TEXT,
  "address" TEXT,
  "notes" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create estimates table
CREATE TABLE IF NOT EXISTS "estimates" (
  "id" SERIAL PRIMARY KEY,
  "estimate_id" TEXT UNIQUE NOT NULL, -- Format: #XX-YYYYMMDD-NN
  "client_id" INTEGER NOT NULL REFERENCES "clients"("id"),
  "status" TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, DECLINED
  "is_draft" BOOLEAN NOT NULL DEFAULT TRUE,
  "amount" DECIMAL(10, 2) NOT NULL,
  "tax" DECIMAL(10, 2) NOT NULL DEFAULT 0,
  "tax_rate" DECIMAL(5, 2) NOT NULL DEFAULT 0,
  "subtotal" DECIMAL(10, 2) NOT NULL,
  "date" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "expiry_date" TIMESTAMP WITH TIME ZONE,
  "notes" TEXT,
  "terms" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create line_items table
CREATE TABLE IF NOT EXISTS "line_items" (
  "id" SERIAL PRIMARY KEY,
  "estimate_id" INTEGER NOT NULL REFERENCES "estimates"("id") ON DELETE CASCADE,
  "description" TEXT NOT NULL,
  "quantity" DECIMAL(10, 2) NOT NULL,
  "unit_price" DECIMAL(10, 2) NOT NULL,
  "amount" DECIMAL(10, 2) NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create items table
CREATE TABLE IF NOT EXISTS "items" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT NOT NULL,
  "price" DECIMAL(10, 2) NOT NULL,
  "taxable" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "estimates_client_id_idx" ON "estimates"("client_id");
CREATE INDEX IF NOT EXISTS "estimates_status_idx" ON "estimates"("status");
CREATE INDEX IF NOT EXISTS "line_items_estimate_id_idx" ON "line_items"("estimate_id");

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for each table to update updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON "users"
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON "clients"
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_estimates_updated_at
BEFORE UPDATE ON "estimates"
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_line_items_updated_at
BEFORE UPDATE ON "line_items"
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_items_updated_at
BEFORE UPDATE ON "items"
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); 