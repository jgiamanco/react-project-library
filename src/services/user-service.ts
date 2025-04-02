import {
  supabase,
  handleSupabaseError,
  getSupabaseClient,
} from "./supabase-client";
import type { UserData, UserProfile } from "./types";
import { PostgrestResponse } from "@supabase/supabase-js";

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
      const { error: createError } = await adminClient
        .from("users")
        .select()
        .limit(1)
        .then(async () => {
          // Create the table
          const { error: tableError } = await adminClient.rpc("exec_sql", {
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
          return tableError;
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

// User operations
export const storeUser = async (userData: UserData): Promise<UserData> => {
  try {
    // First, ensure the users table exists
    const tableExists = await ensureUsersTable();
    if (!tableExists) {
      console.error("Users table does not exist");
      return userData; // Return input data as fallback
    }

    // Try to upsert the user data using admin client
    const adminClient = getSupabaseClient(true);
    const { data, error } = await adminClient
      .from("users")
      .upsert(
        {
          email: userData.email,
          display_name: userData.displayName,
          photo_url: userData.photoURL,
          bio: userData.bio || "",
          location: userData.location || "",
          website: userData.website || "",
          github: userData.github || "",
          twitter: userData.twitter || "",
          role: userData.role || "User",
          theme: userData.theme || "system",
          email_notifications: userData.emailNotifications ?? true,
          push_notifications: userData.pushNotifications ?? false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      )
      .select()
      .single();

    if (error) {
      console.error("Error storing user:", error);
      // If admin client fails, try regular client as fallback
      try {
        const { data: regularData, error: regularError } = await supabase
          .from("users")
          .upsert(
            {
              email: userData.email,
              display_name: userData.displayName,
              photo_url: userData.photoURL,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "email" }
          )
          .select()
          .single();

        if (regularError) {
          console.error("Regular client operation failed:", regularError);
          return userData; // Return input data as fallback
        }

        return {
          email: regularData.email,
          displayName: regularData.display_name,
          photoURL: regularData.photo_url,
        };
      } catch (regularErr) {
        console.error("Regular client operation failed:", regularErr);
        return userData; // Return input data as fallback
      }
    }

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
    };
  } catch (error) {
    console.error("Error storing user:", error);
    return userData; // Return input data as fallback
  }
};

export const getUser = async (email: string): Promise<UserData | null> => {
  try {
    // Try to get user data using admin client first
    const adminClient = getSupabaseClient(true);
    const { data, error } = await adminClient
      .from("users")
      .select()
      .eq("email", email)
      .single();

    if (!error) {
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
          }
        : null;
    }

    if (error.code === "PGRST116") {
      // If user doesn't exist in public.users, try to create them
      const { data: authUser, error: authError } =
        await supabase.auth.getUser();

      if (authError) {
        console.error("Error getting auth user:", authError);
        return null;
      }

      if (authUser?.user?.email === email) {
        // Create user in public.users table using admin client
        const { error: createError } = await adminClient.from("users").insert({
          email: email,
          display_name:
            authUser.user.user_metadata?.display_name || email.split("@")[0],
          photo_url: authUser.user.user_metadata?.photo_url,
          bio: authUser.user.user_metadata?.bio || "",
          location: authUser.user.user_metadata?.location || "",
          website: authUser.user.user_metadata?.website || "",
          github: authUser.user.user_metadata?.github || "",
          twitter: authUser.user.user_metadata?.twitter || "",
          role: authUser.user.user_metadata?.role || "User",
          theme: authUser.user.user_metadata?.theme || "system",
          email_notifications:
            authUser.user.user_metadata?.email_notifications ?? true,
          push_notifications:
            authUser.user.user_metadata?.push_notifications ?? false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (createError) {
          console.error("Error creating user:", createError);
          return null;
        }

        // Return the newly created user data
        return {
          email: email,
          displayName:
            authUser.user.user_metadata?.display_name || email.split("@")[0],
          photoURL: authUser.user.user_metadata?.photo_url,
          bio: authUser.user.user_metadata?.bio || "",
          location: authUser.user.user_metadata?.location || "",
          website: authUser.user.user_metadata?.website || "",
          github: authUser.user.user_metadata?.github || "",
          twitter: authUser.user.user_metadata?.twitter || "",
          role: authUser.user.user_metadata?.role || "User",
          theme: authUser.user.user_metadata?.theme || "system",
          emailNotifications:
            authUser.user.user_metadata?.email_notifications ?? true,
          pushNotifications:
            authUser.user.user_metadata?.push_notifications ?? false,
        };
      }
      return null;
    }

    // If admin client fails, try regular client as fallback
    console.warn("Admin client failed, trying regular client");
    try {
      const { data: regularData, error: regularError } = await supabase
        .from("users")
        .select()
        .eq("email", email)
        .single();

      if (regularError) {
        if (regularError.code === "PGRST116") return null; // Record not found
        console.warn("Both admin and regular client failed:", regularError);
        return null;
      }

      return regularData
        ? {
            email: regularData.email,
            displayName: regularData.display_name,
            photoURL: regularData.photo_url,
          }
        : null;
    } catch (regularErr) {
      console.error("Regular client operation failed:", regularErr);
      return null;
    }
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
