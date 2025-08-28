// Import the Supabase client and its types
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Define the types for the environment variables
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Ensure the environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create and export the Supabase client
// The `SupabaseClient` type ensures type safety when using the client
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);
