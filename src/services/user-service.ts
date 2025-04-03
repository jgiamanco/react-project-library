import {
  supabase,
  handleSupabaseError,
  getSupabaseClient,
} from "./supabase-client";
import {
  UserProfile,
  DbProfile,
  appToDbProfile,
  dbToAppProfile,
  isDbProfile,
} from "./types";
import { PostgrestResponse } from "@supabase/supabase-js";

const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = 5000
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error("Database operation timed out")),
        timeoutMs
      )
    ),
  ]);
};

export async function ensureUsersTable(): Promise<void> {
  console.log("Starting ensureUsersTable...");
  try {
    const { data: tableCheck, error: checkError } = await supabase
      .from("users")
      .select("email")
      .limit(1);

    if (checkError) {
      console.log("Table check error:", checkError);
      if (checkError.code === "42P01") {
        console.log("Users table does not exist, creating...");
        const { error: createError } = await supabase.rpc("exec_sql", {
          sql: `
            CREATE TABLE IF NOT EXISTS public.users (
              email TEXT PRIMARY KEY,
              display_name TEXT NOT NULL,
              photo_url TEXT,
              bio TEXT,
              location TEXT,
              website TEXT,
              github TEXT,
              twitter TEXT,
              role TEXT NOT NULL DEFAULT 'user',
              theme TEXT NOT NULL DEFAULT 'system',
              email_notifications BOOLEAN NOT NULL DEFAULT true,
              push_notifications BOOLEAN NOT NULL DEFAULT false,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
            );

            ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

            CREATE POLICY "Users can view their own profile"
              ON public.users FOR SELECT
              USING (auth.uid()::text = email);

            CREATE POLICY "Users can update their own profile"
              ON public.users FOR UPDATE
              USING (auth.uid()::text = email);

            CREATE POLICY "Users can insert their own profile"
              ON public.users FOR INSERT
              WITH CHECK (auth.uid()::text = email);

            GRANT ALL ON public.users TO authenticated;
            GRANT ALL ON public.users TO service_role;
          `,
        });

        if (createError) {
          console.error("Error creating users table:", createError);
          throw createError;
        }

        console.log("Users table created successfully");
      } else {
        console.error("Unexpected error checking table:", checkError);
        throw checkError;
      }
    } else {
      console.log("Users table exists");
    }

    const { data: structureCheck, error: structureError } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (structureError) {
      console.error("Error verifying table structure:", structureError);
      throw structureError;
    }

    console.log("Table structure verified successfully");
  } catch (error) {
    console.error("Error in ensureUsersTable:", error);
    throw error;
  }
}

export async function storeUser(profile: UserProfile): Promise<void> {
  console.log("Starting storeUser with profile:", profile);
  try {
    await ensureUsersTable();

    const dbProfile = appToDbProfile(profile);
    console.log("Converted to DB profile:", dbProfile);

    const { error } = await supabase.from("users").upsert(dbProfile);

    if (error) {
      console.error("Error storing user:", error);
      throw error;
    }

    console.log("Successfully stored user in database");
  } catch (error) {
    console.error("Error in storeUser:", error);
    throw error;
  }
}

export async function getUser(email: string): Promise<UserProfile | null> {
  console.log("Starting getUser for email:", email);
  if (!email) {
    console.error("Invalid email provided to getUser");
    return null;
  }

  try {
    await ensureUsersTable();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        console.log("No user found for email:", email);
        return null;
      }
      console.error("Error fetching user:", error);
      throw error;
    }

    if (!data) {
      console.log("No user found for email:", email);
      return null;
    }

    if (!isDbProfile(data)) {
      console.error("Invalid profile data received:", data);
      throw new Error("Invalid profile data received from database");
    }

    const userProfile = dbToAppProfile(data);
    console.log("Successfully retrieved user profile:", userProfile);
    return userProfile;
  } catch (error) {
    console.error("Error in getUser:", error);
    throw error;
  }
}

export const deleteUser = async (email: string): Promise<void> => {
  try {
    const client = getSupabaseClient(true);
    const { error } = await client.from("users").delete().eq("email", email);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const getUserProfile = async (
  email: string
): Promise<UserProfile | null> => {
  if (!email) {
    console.error("Invalid email provided to getUserProfile");
    return null;
  }

  try {
    // Use the existing getUser function which already uses the users table
    return await getUser(email);
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  email: string,
  profile: Partial<UserProfile>
): Promise<UserProfile> => {
  console.log("Starting updateUserProfile for email:", email);
  try {
    // Get current user profile first
    const { data: currentProfile, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError) {
      console.error("Error fetching current profile:", fetchError);
      throw fetchError;
    }

    if (!currentProfile) {
      console.error("No profile found for email:", email);
      throw new Error("Profile not found");
    }

    // Merge updates with current profile
    const updatedProfile = { ...currentProfile, ...profile };
    console.log("Merged profile for update:", updatedProfile);

    // Perform the update
    const { data, error } = await supabase
      .from("users")
      .update(updatedProfile)
      .eq("email", email)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }

    if (!data) {
      console.error("No data returned after update");
      throw new Error("Update failed - no data returned");
    }

    console.log("Profile updated successfully:", data);
    return dbToAppProfile(data);
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
};
