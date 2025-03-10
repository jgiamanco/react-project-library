
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://yqbuvfezarqgsevcfoqc.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxYnV2ZmV6YXJxZ3NldmNmb3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2Mjk1NDYsImV4cCI6MjA1NzIwNTU0Nn0.ESPR8o__2Ze-HiYsh2toJt1kf_UdncWYPxx5PniAq4Y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
