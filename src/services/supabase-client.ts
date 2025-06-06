
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
const supabaseServiceRoleKey =
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxYnV2ZmV6YXJxZ3NldmNmb3FjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTYyOTU0NiwiZXhwIjoyMDU3MjA1NTQ2fQ.d9P8MYJPMhsFQpXzmIrwhcLtlKKZgR37FNat5KnPGRk";

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create supabase client singleton (with persistent storage)
let supabaseInstance: SupabaseClient<Database> | null = null;

// Export singleton getter function to prevent duplicate instances
export const getSupabase = (): SupabaseClient<Database> => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: "supabase-auth-token",
        storage: window.localStorage,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
};

// Export the singleton instance directly
export const supabase = getSupabase();

// Create a singleton Supabase admin client
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

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
    return supabaseAdmin;
  }
  return supabase;
};

// Initialize Supabase session - can be called on app start
export const initializeSupabase = async (): Promise<boolean> => {
  try {
    // Get session to initialize the client and check for existing session
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  } catch (error) {
    console.error("Error initializing Supabase:", error);
    return false;
  }
};
