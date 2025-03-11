import {
  supabase,
  handleSupabaseError,
  getSupabaseClient,
} from "./supabase-client";
import type { UserData, UserProfile, DbResult } from "./types";

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

// User operations
export const storeUser = async (userData: UserData): Promise<UserData> => {
  try {
    // Try to use admin client first to bypass RLS
    const client = getSupabaseClient(true);

    const { data, error } = await client
      .from("users")
      .upsert({
        email: userData.email,
        display_name: userData.displayName,
        photo_url: userData.photoURL,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.warn("Admin insert failed, trying regular client:", error);
      // If admin fails or is not available, try regular client as fallback
      const { data: regularData, error: regularError } = await supabase
        .from("users")
        .upsert({
          email: userData.email,
          display_name: userData.displayName,
          photo_url: userData.photoURL,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (regularError) handleSupabaseError(regularError);
      return {
        email: regularData.email,
        displayName: regularData.display_name,
        photoURL: regularData.photo_url,
      };
    }

    return {
      email: data.email,
      displayName: data.display_name,
      photoURL: data.photo_url,
    };
  } catch (error) {
    console.error("Error storing user:", error);
    // Return the input data as a fallback
    return userData;
  }
};

export const getUser = async (email: string): Promise<UserData | null> => {
  try {
    const client = getSupabaseClient(true);

    const { data, error } = await client
      .from("users")
      .select()
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Record not found

      // Try regular client as fallback
      const { data: regularData, error: regularError } = await supabase
        .from("users")
        .select()
        .eq("email", email)
        .single();

      if (regularError) {
        if (regularError.code === "PGRST116") return null; // Record not found
        console.warn("Error fetching user:", regularError);
        return null;
      }

      return regularData
        ? {
            email: regularData.email,
            displayName: regularData.display_name,
            photoURL: regularData.photo_url,
          }
        : null;
    }

    return data
      ? {
          email: data.email,
          displayName: data.display_name,
          photoURL: data.photo_url,
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
    // First ensure the user exists
    const client = getSupabaseClient(true);

    // First ensure the user exists
    const { error: userError } = await client.from("users").upsert({
      email,
      display_name: profile.displayName,
      photo_url: profile.photoURL,
      updated_at: new Date().toISOString(),
    });

    if (userError) {
      console.warn(
        "Admin user update failed, trying regular client:",
        userError
      );
      // Try regular client
      const { error: regularUserError } = await supabase.from("users").upsert({
        email,
        display_name: profile.displayName,
        photo_url: profile.photoURL,
        updated_at: new Date().toISOString(),
      });

      if (regularUserError) {
        console.error("Regular user update also failed:", regularUserError);
        // Continue anyway to try the profile update
      }
    }

    // Then update the profile
    const { data, error } = await client
      .from("user_profiles")
      .upsert({
        email,
        display_name: profile.displayName,
        photo_url: profile.photoURL,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        github: profile.github,
        twitter: profile.twitter,
        role: profile.role,
        theme: profile.theme,
        email_notifications: profile.emailNotifications,
        push_notifications: profile.pushNotifications,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.warn(
        "Admin profile update failed, trying regular client:",
        error
      );
      // Try regular client
      const { data: regularData, error: regularError } = await supabase
        .from("user_profiles")
        .upsert({
          email,
          display_name: profile.displayName,
          photo_url: profile.photoURL,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
          github: profile.github,
          twitter: profile.twitter,
          role: profile.role,
          theme: profile.theme,
          email_notifications: profile.emailNotifications,
          push_notifications: profile.pushNotifications,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (regularError) {
        console.error("Regular profile update also failed:", regularError);
        // Return a constructed profile as fallback
        return {
          email,
          displayName: profile.displayName || "",
          photoURL: profile.photoURL,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
          github: profile.github,
          twitter: profile.twitter,
          role: profile.role,
          theme: profile.theme,
          emailNotifications: profile.emailNotifications,
          pushNotifications: profile.pushNotifications,
        };
      }

      return convertDbProfileToUserProfile(regularData) as UserProfile;
    }

    return convertDbProfileToUserProfile(data) as UserProfile;
  } catch (error) {
    console.error("Error updating user profile:", error);
    // Return a constructed profile as fallback
    return {
      email,
      displayName: profile.displayName || "",
      photoURL: profile.photoURL,
      bio: profile.bio,
      location: profile.location,
      website: profile.website,
      github: profile.github,
      twitter: profile.twitter,
      role: profile.role,
      theme: profile.theme,
      emailNotifications: profile.emailNotifications,
      pushNotifications: profile.pushNotifications,
    };
  }
};
