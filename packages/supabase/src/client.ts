import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY\n" +
    "Please check your .env.local file and restart the dev server with: npm run dev"
  );
}

// Client-side Supabase instance (uses anon key, respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase instance (uses service role key, bypasses RLS)
// Use this only for admin operations that need to bypass RLS
// Note: For normal admin operations, use the regular 'supabase' client since RLS allows admins
// Only create admin client if service role key is provided
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export type { Session, User } from "@supabase/supabase-js";

// Note: supabaseAdmin will be null if SUPABASE_SERVICE_ROLE_KEY is not provided
// This is optional - admin functions use the regular 'supabase' client which respects RLS

