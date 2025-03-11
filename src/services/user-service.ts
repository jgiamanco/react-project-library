import { supabase, handleSupabaseError } from "./supabase-client";
import type { UserData, UserProfile, DbResult } from "./types";

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
  const { data, error } = await supabase
    .from("users")
    .upsert({
      email: userData.email,
      display_name: userData.displayName,
      photo_url: userData.photoURL,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) handleSupabaseError(error);

  return {
    email: data.email,
    displayName: data.display_name,
    photoURL: data.photo_url,
  };
};

export const getUser = async (email: string): Promise<UserData | null> => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("email", email)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Record not found
    handleSupabaseError(error);
  }

  return data
    ? {
        email: data.email,
        displayName: data.display_name,
        photoURL: data.photo_url,
      }
    : null;
};

export const deleteUser = async (email: string): Promise<void> => {
  const { error } = await supabase.from("users").delete().eq("email", email);

  if (error) handleSupabaseError(error);
};

// User Profile operations
export const getUserProfile = async (
  email: string
): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Record not found
    handleSupabaseError(error);
  }

  return data
    ? {
        email: data.email,
        displayName: data.display_name,
        photoURL: data.photo_url,
        bio: data.bio,
        location: data.location,
        website: data.website,
        github: data.github,
        twitter: data.twitter,
        role: data.role,
        theme: data.theme,
        emailNotifications: data.email_notifications,
        pushNotifications: data.push_notifications,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    : null;
};

export const updateUserProfile = async (
  email: string,
  profile: Partial<UserProfile>
): Promise<UserProfile> => {
  // First ensure the user exists
  const { error: userError } = await supabase.from("users").upsert({
    email,
    display_name: profile.displayName,
    photo_url: profile.photoURL,
    updated_at: new Date().toISOString(),
  });

  if (userError) handleSupabaseError(userError);

  // Then update the profile
  const { data, error } = await supabase
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

  if (error) handleSupabaseError(error);

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
    theme: data.theme,
    emailNotifications: data.email_notifications,
    pushNotifications: data.push_notifications,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};
