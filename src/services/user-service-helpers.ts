
import { supabase, handleSupabaseError } from "./supabase-client";
import { DbUserProfile, UserProfile, appToDbProfile, dbToAppProfile } from "./types";

// Fetch a user profile by email
export async function fetchUserProfile(email: string): Promise<UserProfile | null> {
  console.log("Fetching user profile for email:", email);
  
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    
    if (error) {
      handleSupabaseError(error);
    }
    
    if (!data) {
      console.log("No profile found for email:", email);
      return null;
    }
    
    console.log("Profile found:", data);
    return dbToAppProfile(data as DbUserProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// Create a new user profile
export async function createUserProfile(email: string, profile: UserProfile): Promise<UserProfile | null> {
  console.log("Creating new profile for email:", email);
  
  try {
    // Ensure profile has an ID
    if (!profile.id) {
      profile = { ...profile, id: email };
    }
    
    const dbProfile = appToDbProfile(profile);
    
    const { data, error } = await supabase
      .from("users")
      .insert(dbProfile)
      .select("*")
      .maybeSingle();
    
    if (error) {
      console.error("Error creating new profile:", error);
      throw error;
    }
    
    if (!data) {
      console.log("No profile returned after creation");
      return profile;
    }
    
    return dbToAppProfile(data as DbUserProfile);
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
}

// Update an existing user profile
export async function updateExistingProfile(
  email: string, 
  profile: UserProfile
): Promise<UserProfile | null> {
  console.log("Updating profile for email:", email);
  
  try {
    // Ensure profile has an ID
    if (!profile.id) {
      profile = { ...profile, id: email };
    }
    
    const dbProfile = appToDbProfile(profile);
    
    const { data, error } = await supabase
      .from("users")
      .update(dbProfile)
      .eq("email", email)
      .select("*")
      .maybeSingle();
    
    if (error) {
      handleSupabaseError(error);
    }
    
    if (!data) {
      console.log("No profile returned after update");
      return profile;
    }
    
    return dbToAppProfile(data as DbUserProfile);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
