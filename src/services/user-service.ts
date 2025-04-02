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

// Helper function to ensure the users table exists
export const ensureUsersTable = async (): Promise<boolean> => {
  try {
    console.log("Checking if users table exists...");
    const adminClient = getSupabaseClient(true);

    // Check if the table exists by querying for its records
    const { error: checkError } = await adminClient
      .from("users")
      .select("email")
      .limit(1);

    // If no error, then the table exists
    if (!checkError) {
      console.log("Users table exists");
      return true;
    }

    if (
      checkError.message.includes("relation") &&
      checkError.message.includes("does not exist")
    ) {
      console.log("Creating users table...");

      // Create the table with proper schema and RLS policies
      const { error: createError } = await adminClient.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS public.users (
            email VARCHAR PRIMARY KEY,
            display_name VARCHAR NOT NULL,
            photo_url VARCHAR,
            bio TEXT,
            location VARCHAR,
            website VARCHAR,
            github VARCHAR,
            twitter VARCHAR,
            role VARCHAR DEFAULT 'User',
            theme VARCHAR DEFAULT 'system',
            email_notifications BOOLEAN DEFAULT true,
            push_notifications BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
          );

          -- Enable RLS
          ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

          -- Create policies
          CREATE POLICY "Users can view their own data" ON public.users
            FOR SELECT USING (auth.jwt()->>'email' = email);

          CREATE POLICY "Users can update their own data" ON public.users
            FOR UPDATE USING (auth.jwt()->>'email' = email);

          CREATE POLICY "Users can insert their own data" ON public.users
            FOR INSERT WITH CHECK (auth.jwt()->>'email' = email);

          -- Grant access to authenticated users
          GRANT ALL ON public.users TO authenticated;
        `,
      });

      if (createError) {
        console.error("Error creating users table:", createError);
        return false;
      }

      console.log("Users table created successfully");
      return true;
    }

    console.error("Error checking users table:", checkError);
    return false;
  } catch (err) {
    console.error("Error checking users table:", err);
    return false;
  }
};

// Store user data in the database
export const storeUser = async (
  user: UserProfile
): Promise<UserProfile | null> => {
  try {
    console.log("Attempting to store user in database");

    // Ensure the users table exists
    const tableExists = await ensureUsersTable();
    if (!tableExists) {
      console.error("Failed to ensure users table exists");
      return null;
    }

    // Use the admin client for database operations
    const adminClient = getSupabaseClient(true);

    // Convert application profile to database profile
    const dbProfile = appToDbProfile(user);

    // Insert or update the user data
    const { data, error } = await adminClient
      .from("users")
      .upsert(dbProfile)
      .select()
      .single();

    if (error) {
      console.error("Error storing user:", error);
      return null;
    }

    if (!isDbProfile(data)) {
      console.error("Invalid user data received from database");
      return null;
    }

    console.log("Successfully stored user in database:", data);
    return dbToAppProfile(data);
  } catch (err) {
    console.error("Error in storeUser:", err);
    return null;
  }
};

// Get user data from the database
export const getUser = async (email: string): Promise<UserProfile | null> => {
  try {
    console.log("Attempting to get user data for email:", email);

    // Ensure the users table exists
    const tableExists = await ensureUsersTable();
    if (!tableExists) {
      console.error("Failed to ensure users table exists");
      return null;
    }

    // Use the admin client for database operations
    const adminClient = getSupabaseClient(true);

    // Get the user data
    const { data, error } = await adminClient
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error getting user:", error);
      return null;
    }

    if (!isDbProfile(data)) {
      console.error("Invalid user data received from database");
      return null;
    }

    console.log("Successfully retrieved user data from database:", data);
    return dbToAppProfile(data);
  } catch (err) {
    console.error("Error in getUser:", err);
    return null;
  }
};

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
  try {
    const client = getSupabaseClient(true);
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
  try {
    const client = getSupabaseClient(true);

    // First, ensure the user exists in the users table
    const { error: userError } = await client.from("users").upsert(
      {
        email,
        display_name: profile.displayName,
        photo_url: profile.photoURL,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

    if (userError) {
      console.error("Error updating user:", userError);
      throw userError;
    }

    // Validate theme
    const theme =
      profile.theme && ["light", "dark", "system"].includes(profile.theme)
        ? profile.theme
        : "system";

    // Update the profile
    const { data, error } = await client
      .from("user_profiles")
      .upsert(
        {
          email,
          display_name: profile.displayName,
          photo_url: profile.photoURL,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
          github: profile.github,
          twitter: profile.twitter,
          role: profile.role,
          theme,
          email_notifications: profile.emailNotifications,
          push_notifications: profile.pushNotifications,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "email",
          ignoreDuplicates: false,
        }
      )
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

    return updatedProfile;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
