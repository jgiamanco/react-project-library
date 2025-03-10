
import { supabase } from "./supabase-client";
import { UserData, UserProfile } from "./types";

// User operations
export const storeUser = async (userData: UserData): Promise<UserData> => {
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
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from user creation');
  }

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
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return null;

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
};

export const updateUserProfile = async (
  email: string,
  profile: Partial<UserProfile>
): Promise<UserProfile> => {
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

  if (error) throw error;

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
};
