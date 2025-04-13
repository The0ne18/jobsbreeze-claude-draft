import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dsulxpgfhzuilpvkxjul.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzdWx4cGdmaHp1aWxwdmt4anVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NDY1NTYsImV4cCI6MjA2MDEyMjU1Nn0.Fgkkz4YXRjXv4Tk-UVG0UqcCQnZpi8KWoiOgWkdUN1s';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}; 