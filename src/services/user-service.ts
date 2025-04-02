import {
  supabase,
  handleSupabaseError,
  getSupabaseClient,
} from "./supabase-client";
import type { UserData, UserProfile } from "./types";

// Database profile type
type DbProfile = {
  email: string;
  display_name: string;
  photo_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  twitter?: string;
  role?: string;
  theme?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
  created_at?: string;
  updated_at?: string;
};

// Helper function to ensure the users table exists
export const ensureUsersTable = async (): Promise<boolean> => {
  try {
    console.log("Checking if users table exists...");

    // Check if the table exists by querying for its records
    const { error: checkError } = await supabase
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
      console.log(
        "Users table doesn't exist. Please create the table using the Supabase SQL editor"
      );
      // Show a helpful message to the developer
      console.info(`
        Run this SQL in Supabase:
        CREATE TABLE public.users (
          email VARCHAR PRIMARY KEY,
          display_name VARCHAR NOT NULL,
          photo_url VARCHAR,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );
        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
      `);
    }

    console.error("Users table doesn't exist:", checkError.message);
    return false;
  } catch (err) {
    console.error("Error checking users table:", err);
    return false;
  }
};

// Helper function to add timeout to a promise
const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = 10000
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

// User operations
export const storeUser = async (userData: UserData): Promise<UserData> => {
  try {
    // Try regular client first with retry
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from("users")
            .upsert({
              email: userData.email,
              display_name: userData.displayName,
              photo_url: userData.photoURL,
              updated_at: new Date().toISOString(),
            })
            .select()
            .single()
        );

        if (!error) {
          return {
            email: data.email,
            displayName: data.display_name,
            photoURL: data.photo_url,
          };
        }
      } catch (err) {
        console.warn(`Attempt ${attempts + 1} failed:`, err);
      }
      attempts++;
    }

    // If all attempts failed, try admin client as last resort
    console.warn("All regular client attempts failed, trying admin client");
    const { data: adminData, error: adminError } = await withTimeout(
      getSupabaseClient(true)
        .from("users")
        .upsert({
          email: userData.email,
          display_name: userData.displayName,
          photo_url: userData.photoURL,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()
    );

    if (adminError) {
      console.error("Both regular and admin client failed:", adminError);
      return userData; // Return input data as fallback
    }

    return {
      email: adminData.email,
      displayName: adminData.display_name,
      photoURL: adminData.photo_url,
    };
  } catch (error) {
    console.error("Error storing user:", error);
    // Return the input data as a fallback
    return userData;
  }
};

export const getUser = async (email: string): Promise<UserData | null> => {
  try {
    // Try regular client first with retry
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const { data, error } = await withTimeout(
          supabase.from("users").select().eq("email", email).single()
        );

        if (!error) {
          return data
            ? {
                email: data.email,
                displayName: data.display_name,
                photoURL: data.photo_url,
              }
            : null;
        }

        if (error.code === "PGRST116") return null; // Record not found
      } catch (err) {
        console.warn(`Attempt ${attempts + 1} failed:`, err);
      }
      attempts++;
    }

    // If all attempts failed, try admin client as last resort
    console.warn("All regular client attempts failed, trying admin client");
    const { data: adminData, error: adminError } = await withTimeout(
      getSupabaseClient(true).from("users").select().eq("email", email).single()
    );

    if (adminError) {
      if (adminError.code === "PGRST116") return null; // Record not found
      console.warn("Both regular and admin client failed:", adminError);
      return null;
    }

    return adminData
      ? {
          email: adminData.email,
          displayName: adminData.display_name,
          photoURL: adminData.photo_url,
        }
      : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const deleteUser = async (email: string): Promise<void> => {
  try {
    const client = getSupabaseClient(true);

    const { error } = await client.from("users").delete().eq("email", email);

    if (error) {
      // Try regular client as fallback
      const { error: regularError } = await supabase
        .from("users")
        .delete()
        .eq("email", email);
      if (regularError) handleSupabaseError(regularError);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
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

      // Try regular client as fallback
      const { data: regularData, error: regularError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (regularError) {
        if (regularError.code === "PGRST116") return null; // Record not found
        console.warn("Error fetching user profile:", regularError);
        return null;
      }

      return convertDbProfileToUserProfile(regularData);
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
