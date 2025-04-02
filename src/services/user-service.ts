
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

// Helper function to add timeout to a promise
const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = 5000 // Reduced timeout to 5 seconds
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

// Helper function to ensure the users table exists with proper schema and RLS
export async function ensureUsersTable(): Promise<void> {
  console.log("Starting ensureUsersTable...");
  try {
    // First check if the table exists
    const { data: tableCheck, error: checkError } = await supabase
      .from("users")
      .select("email")
      .limit(1);

    if (checkError) {
      console.log("Table check error:", checkError);
      if (checkError.code === "42P01") {
        // Table doesn't exist, create it
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

            -- Enable RLS
            ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

            -- Create policies
            CREATE POLICY "Users can view their own profile"
              ON public.users FOR SELECT
              USING (auth.uid()::text = email);

            CREATE POLICY "Users can update their own profile"
              ON public.users FOR UPDATE
              USING (auth.uid()::text = email);

            CREATE POLICY "Users can insert their own profile"
              ON public.users FOR INSERT
              WITH CHECK (auth.uid()::text = email);

            -- Grant permissions
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

    // Verify table structure
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

// Store user data in the database
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

// Get user data from the database
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
        // Record not found
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

// User Profile operations
export const getUserProfile = async (
  email: string
): Promise<UserProfile | null> => {
  if (!email) {
    console.error("Invalid email provided to getUserProfile");
    return null;
  }
  
  try {
    // First try getting from users table
    const userProfile = await getUser(email);
    if (userProfile) {
      return userProfile;
    }
    
    // Fall back to user_profiles table if it exists
    const client = getSupabaseClient(true);
    try {
      const { data, error } = await client
        .from("user_profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null; // Record not found
        throw error;
      }

      return convertDbProfileToUserProfile(data);
    } catch (tableError) {
      console.warn("user_profiles table might not exist:", tableError);
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

// Helper function to convert DB profile to UserProfile
const convertDbProfileToUserProfile = (data: DbProfile): UserProfile | null => {
  if (!data) return null;

  // Validate theme value
  const theme = data.theme as "light" | "dark" | "system" | undefined;
  const validTheme =
    theme && ["light", "dark", "system"].includes(theme) ? theme : "system";

  return {
    email: data.email,
    displayName: data.display_name,
    photoURL: data.photo_url,
    bio: data.bio,
    location: data.location,
    website: data.website,
    github: data.github,
    twitter: data.twitter,
    role: data.role,
    theme: validTheme,
    emailNotifications: data.email_notifications,
    pushNotifications: data.push_notifications,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const updateUserProfile = async (
  email: string,
  profile: Partial<UserProfile>
): Promise<UserProfile> => {
  if (!email) {
    throw new Error("Email is required for updating user profile");
  }
  
  try {
    const client = getSupabaseClient(true);

    // Ensure the users table exists
    await ensureUsersTable();

    // Validate theme
    const theme =
      profile.theme && ["light", "dark", "system"].includes(profile.theme)
        ? profile.theme
        : "system";

    // Convert profile to DB format
    const dbProfile = {
      email,
      display_name: profile.displayName || "",
      photo_url: profile.photoURL || "",
      bio: profile.bio || "",
      location: profile.location || "",
      website: profile.website || "",
      github: profile.github || "",
      twitter: profile.twitter || "",
      role: profile.role || "User",
      theme,
      email_notifications: profile.emailNotifications ?? true,
      push_notifications: profile.pushNotifications ?? false,
      updated_at: new Date().toISOString(),
    };

    // Update the profile in users table
    const { data, error } = await client
      .from("users")
      .upsert(dbProfile, {
        onConflict: "email",
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Profile update failed:", error);
      throw error;
    }

    // Convert and return the updated profile
    const updatedProfile = convertDbProfileToUserProfile(data);
    if (!updatedProfile) {
      throw new Error("Failed to convert updated profile");
    }

    // Update local storage
    localStorage.setItem("user", JSON.stringify(updatedProfile));
    localStorage.setItem("user_profile", JSON.stringify(updatedProfile));

    return updatedProfile;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
