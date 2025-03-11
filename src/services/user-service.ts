
import { supabase } from "./supabase-client";
import { UserData, UserProfile } from "./types";

// Helper function to ensure the users table exists
export const ensureUsersTable = async (): Promise<boolean> => {
  try {
    console.log("Checking if users table exists...");
    
    // Check if the table exists by querying for its records
    const { error: checkError } = await supabase
      .from('users')
      .select('email')
      .limit(1);
    
    // If no error, then the table exists
    if (!checkError) {
      console.log("Users table exists");
      return true;
    }
    
    if (checkError.message.includes("relation") && checkError.message.includes("does not exist")) {
      console.log("Users table doesn't exist. Please create the table using the Supabase SQL editor");
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
    console.log("Attempting to store user:", userData.email);
    
    // First check if the users table exists
    const tableExists = await ensureUsersTable();
    
    if (!tableExists) {
      // If table doesn't exist, store in localStorage only and return userData
      console.log("Users table not available, storing user in localStorage only");
      return userData;
    }

    try {
      console.log("Upserting user data:", {
        email: userData.email,
        display_name: userData.displayName || userData.email.split('@')[0],
        photo_url: userData.photoURL,
      });
      
      // Insert or update the user record
      const { data, error } = await supabase
        .from("users")
        .upsert({
          email: userData.email,
          display_name: userData.displayName || userData.email.split('@')[0],
          photo_url: userData.photoURL,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'email'
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error storing user:', error);
        // Return the userData as is since we couldn't store it
        return userData;
      }

      if (!data) {
        console.warn('No data returned from user creation, using provided data');
        return userData;
      }
      
      console.log("User stored in database:", data);

      // Attempt to store extended profile data if available, but don't fail if it doesn't work
      if (userData.location || userData.bio || userData.website || 
          userData.github || userData.twitter || userData.role || 
          userData.theme || userData.emailNotifications !== undefined || 
          userData.pushNotifications !== undefined) {
        
        try {
          console.log("Storing extended profile data");
          await updateUserProfile(userData.email, userData);
        } catch (profileError) {
          console.error('Error storing extended profile data:', profileError);
        }
      }

      return {
        email: data.email,
        displayName: data.display_name,
        photoURL: data.photo_url,
        ...userData, // Keep any additional profile fields that might not be in the users table
      };
    } catch (upsertError) {
      console.error('Error during upsert operation:', upsertError);
      return userData;
    }
  } catch (err) {
    console.error('Unexpected error storing user:', err);
    // In case of any error, return the original userData
    return userData;
  }
};

export const getUser = async (email: string): Promise<UserData | null> => {
  try {
    console.log("Attempting to get user:", email);
    
    // Check if the users table exists
    const tableExists = await ensureUsersTable();
    
    if (!tableExists) {
      console.log("Users table not available, no profile can be retrieved");
      return null;
    }
    
    // Try to get basic user data
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    if (error) {
      console.log("Error fetching user:", error.message);
      return null;
    }
    
    if (!data) {
      console.log("No user found with email:", email);
      return null;
    }
    
    console.log("User found in database:", data);

    // Base user data
    const userData: UserData = {
      email: data.email,
      displayName: data.display_name,
      photoURL: data.photo_url,
    };

    // Try to get extended profile data
    try {
      console.log("Fetching extended profile data");
      const profile = await getUserProfile(email);
      if (profile) {
        console.log("Extended profile found:", profile);
        // Merge profile data with user data
        return {
          ...userData,
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
    } catch (profileError) {
      console.error('Error fetching profile data:', profileError);
      // Continue with basic user data
    }

    return userData;
  } catch (err) {
    console.error("Unexpected error getting user:", err);
    return null;
  }
};

export const deleteUser = async (email: string): Promise<void> => {
  try {
    const { error } = await supabase.from("users").delete().eq("email", email);
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

// User Profile operations
export const getUserProfile = async (
  email: string
): Promise<UserProfile | null> => {
  try {
    console.log("Attempting to get user profile:", email);
    
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.log("Error fetching user profile:", error.message);
      return null;
    }
    
    if (!data) {
      console.log("No profile found for email:", email);
      return null;
    }
    
    console.log("Profile found:", data);

    return data
      ? {
          id: data.id,
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
  } catch (err) {
    console.error("Unexpected error getting user profile:", err);
    return null;
  }
};

export const updateUserProfile = async (
  email: string,
  profile: Partial<UserProfile>
): Promise<UserProfile> => {
  try {
    console.log("Attempting to update profile for:", email, profile);
    
    const { data, error } = await supabase
      .from("user_profiles")
      .upsert({
        email,
        display_name: profile.displayName || '',
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
      console.error("Error updating user profile:", error);
      // Create a default profile response if we couldn't update
      return {
        id: "local-" + Date.now(),
        email,
        displayName: profile.displayName || email.split("@")[0],
        photoURL: profile.photoURL,
        ...profile,
      };
    }
    
    console.log("Profile updated successfully:", data);

    return {
      id: data.id,
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
  } catch (err) {
    console.error("Unexpected error updating user profile:", err);
    // Create a default profile response
    return {
      id: "local-" + Date.now(),
      email,
      displayName: profile.displayName || email.split("@")[0],
      photoURL: profile.photoURL,
      ...profile,
    };
  }
};
