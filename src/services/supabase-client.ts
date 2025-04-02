import { createClient, PostgrestError } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create a single instance of the regular client
let supabaseInstance: ReturnType<typeof createClient> | null = null;
let supabaseAdminInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "supabase.auth.token",
      },
      db: {
        schema: "public",
      },
    });
  }
  return supabaseInstance;
})();

// Create a single instance of the admin client
export const supabaseAdmin = (() => {
  if (!supabaseAdminInstance && supabaseServiceRoleKey) {
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: "public",
      },
    });
  }
  return supabaseAdminInstance;
})();

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: PostgrestError) => {
  console.error("Supabase error:", error);
  throw new Error(
    error.message || "An error occurred with the database operation"
  );
};

// Helper function to get the appropriate Supabase client
export const getSupabaseClient = (bypassRLS: boolean = false) => {
  if (bypassRLS && supabaseAdmin) {
    return supabaseAdmin;
  }
  return supabase;
};
