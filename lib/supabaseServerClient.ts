import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL in server environment'
  );
}

export const supabaseServer: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);
