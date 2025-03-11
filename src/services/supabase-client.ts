import { createClient, PostgrestError } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role for bypassing RLS
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: PostgrestError) => {
  console.error("Supabase error:", error);
  throw new Error(
    error.message || "An error occurred with the database operation"
  );
};

// Helper function to get the appropriate Supabase client
export const getSupabaseClient = (bypassRLS: boolean = false) => {
  // If bypassing RLS is requested and admin client is available, use it
  if (bypassRLS && supabaseAdmin) {
    return supabaseAdmin;
  }
  // Otherwise use the regular client
  return supabase;
};
