import { supabase, getSupabaseClient } from "./supabase-client";
import {
  UserProfile,
  appToDbProfile,
  dbToAppProfile,
  isDbProfile,
} from "./types";
import { PostgrestError } from "@supabase/supabase-js";

let tableChecked = false;
let tableCheckInProgress = false;
let tableCheckPromise: Promise<{ success: boolean; error?: Error }> | null =
  null;

export function resetTableCheck() {
  tableChecked = false;
}

export async function ensureUsersTable(): Promise<{
  success: boolean;
  error?: Error;
}> {
  console.log("Starting ensureUsersTable...");

  // If table is already checked, return success
  if (tableChecked) {
    console.log("Table already checked, skipping...");
    return { success: true };
  }

  // If a check is in progress, wait for it to complete
  if (tableCheckInProgress && tableCheckPromise) {
    console.log("Table check in progress, waiting for result...");
    return tableCheckPromise;
  }

  // Set up the check
  tableCheckInProgress = true;

  const performTableCheck = async (): Promise<{
    success: boolean;
    error?: Error;
  }> => {
    try {
      // Check if users table exists
      const { error } = await supabase.from("users").select("count").limit(1);

      if (error) {
        console.error("Error in ensureUsersTable:", error);
        if (error.code === "42P01") {
          // Table does not exist
          console.log("Users table does not exist");
          return { success: false, error };
        } else if (error.code === "42501") {
          // Permission denied
          console.log("Permission denied to users table");
          return { success: false, error };
        } else {
          // Other error, assume table exists
          console.log("Other error, assuming table exists");
          tableChecked = true;
          return { success: true };
        }
      } else {
        console.log("Users table exists");
        tableChecked = true;
        return { success: true };
      }
    } catch (error) {
      console.error("Error in ensureUsersTable:", error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  };

  tableCheckPromise = new Promise<{ success: boolean; error?: Error }>(
    (resolve) => {
      const timeout = setTimeout(() => {
        console.log("Table check timed out, assuming table exists");
        tableChecked = true;
        tableCheckInProgress = false;
        tableCheckPromise = null;
        resolve({ success: true });
      }, 5000);

      performTableCheck()
        .then((result) => {
          clearTimeout(timeout);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timeout);
          console.error("Error in ensureUsersTable:", error);
          resolve({
            success: false,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        })
        .finally(() => {
          tableCheckInProgress = false;
          tableCheckPromise = null;
        });
    }
  );

  return tableCheckPromise;
}

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

export const getUserProfile = async (
  email: string
): Promise<UserProfile | null> => {
  if (!email) {
    console.error("Invalid email provided to getUserProfile");
    return null;
  }

  try {
    return await getUser(email);
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  email: string,
  profile: Partial<UserProfile>
): Promise<UserProfile> => {
  console.log("Starting updateUserProfile for email:", email);
  try {
    // Get the auth user first to ensure we have the correct id
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) {
      console.error("Error getting auth user:", authError);
      throw authError;
    }

    if (!authUser) {
      console.error("No authenticated user found");
      throw new Error("Not authenticated");
    }

    // Get current user profile
    const { data: currentProfile, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching current profile:", fetchError);
      throw fetchError;
    }

    // If no profile exists, create a new one
    if (!currentProfile) {
      console.log("No profile found, creating new profile");
      const newProfile = {
        id: authUser.id,
        email,
        displayName: profile.displayName || email.split("@")[0],
        photoURL: profile.photoURL || null,
        bio: profile.bio || null,
        location: profile.location || null,
        website: profile.website || null,
        github: profile.github || null,
        twitter: profile.twitter || null,
        role: "user",
        theme: "system",
        emailNotifications: true,
        pushNotifications: false,
      };

      const { data, error: insertError } = await supabase
        .from("users")
        .insert(newProfile)
        .select()
        .single();

      if (insertError) {
        console.error("Error creating new profile:", insertError);
        throw insertError;
      }

      console.log("New profile created successfully:", data);
      return dbToAppProfile(data);
    }

    // Convert the incoming profile to database format and include the id
    const dbProfile = appToDbProfile({
      ...currentProfile,
      ...profile,
      id: authUser.id,
    });
    console.log("Merged profile for update (DB format):", dbProfile);

    // Perform the update using both id and email for safety
    const { data, error } = await supabase
      .from("users")
      .update(dbProfile)
      .eq("id", authUser.id)
      .eq("email", email)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }

    if (!data) {
      console.error("No data returned after update");
      throw new Error("Update failed - no data returned");
    }

    console.log("Profile updated successfully:", data);
    return dbToAppProfile(data);
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
};
