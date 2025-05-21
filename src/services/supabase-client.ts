import {
  createClient,
  PostgrestError,
  SupabaseClient,
} from "@supabase/supabase-js";
import { Database } from "./database.types";

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// For service role key, allow falling back to other environment variable formats
// but keep the original check for backward compatibility
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 
                              import.meta.env.SUPABASE_SERVICE_ROLE_KEY || 
                              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxYnV2ZmV6YXJxZ3NldmNmb3FjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTYyOTU0NiwiZXhwIjoyMDU3MjA1NTQ2fQ.d9P8MYJPMhsFQpXzmIrwhcLtlKKZgR37FNat5KnPGRk";

// Validate environment variables
if (!supabaseUrl) {
  throw new Error("Missing VITE_SUPABASE_URL environment variable");
}

if (!supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY environment variable");
}

// Create a single instance of the regular client
let supabaseInstance: SupabaseClient<Database> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "supabase.auth.token",
      },
    });
  }
  return supabaseInstance;
})();

// Create a single instance of the admin client
let supabaseAdminInstance: SupabaseClient<Database> | null = null;

export const supabaseAdmin = (() => {
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient<Database>(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
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
export const getSupabaseClient = (
  bypassRLS: boolean = false
): SupabaseClient<Database> => {
  if (bypassRLS) {
    if (!supabaseAdminInstance) {
      throw new Error("Admin client not initialized");
    }
    return supabaseAdminInstance;
  }
  return supabaseInstance;
};
