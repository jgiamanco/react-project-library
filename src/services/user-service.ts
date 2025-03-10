import { supabase } from "./supabase-client";
import { UserData, UserProfile } from "./types";

// Helper function to ensure the users table exists
const ensureUsersTable = async () => {
  try {
    // Check if users table exists by attempting to get its schema
    const { error } = await supabase
      .from('users')
      .select('email')
      .limit(1);
    
    // If no error, table exists
    if (!error) return true;
    
    // If table doesn't exist, we'll log this for debugging
    console.log("Users table doesn't exist or is not accessible:", error.message);
    
    // We'll return false and handle the error more gracefully
    return false;
  } catch (err) {
    console.error("Error checking users table:", err);
    return false;
  }
};

// User operations
export const storeUser = async (userData: UserData): Promise<UserData> => {
  try {
    // First check if the users table exists
    const tableExists = await ensureUsersTable();
    
    if (!tableExists) {
      // If table doesn't exist, fallback to storing in localStorage only
      console.log("Users table not available, storing user in localStorage only");
      // Return the userData as-is since we can't store it in the database
      return userData;
    }

    const { data, error } = await supabase
      .from("users")
      .upsert({
        email: userData.email,
        display_name: userData.displayName,
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

    return {
      email: data.email,
      displayName: data.display_name,
      photoURL: data.photo_url,
    };
  } catch (err) {
    console.error('Unexpected error storing user:', err);
    // In case of any error, return the original userData
    return userData;
  }
};

export const getUser = async (email: string): Promise<UserData | null> => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("email", email)
    .single();

  if (error) return null;

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

  if (error) throw error;
};

// User Profile operations
export const getUserProfile = async (
  email: string
): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.log("Error fetching user profile:", error.message);
      return null;
    }

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
