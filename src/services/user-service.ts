import { supabase, getSupabaseClient } from "./supabase-client";
import {
  UserProfile,
  appToDbProfile,
  dbToAppProfile,
  isDbProfile,
} from "./types";

let tableChecked = false;

export function resetTableCheck() {
  tableChecked = false;
}

export async function ensureUsersTable(): Promise<void> {
  if (tableChecked) {
    return;
  }

  console.log("Starting ensureUsersTable...");
  try {
    const { error: checkError } = await supabase
      .from("users")
      .select("email")
      .limit(1);

    if (checkError) {
      console.log("Table check error:", checkError);
      if (checkError.code === "42P01") {
        console.log("Users table does not exist, creating...");
        const { error: createError } = await supabase.rpc("exec_sql", {
          sql: `
            CREATE TABLE IF NOT EXISTS public.users (
              id UUID PRIMARY KEY REFERENCES auth.users(id),
              email TEXT UNIQUE NOT NULL,
              display_name TEXT NOT NULL,
              photo_url TEXT,
              bio TEXT,
              location TEXT,
              website TEXT,
              github TEXT,
              twitter TEXT,
              role TEXT NOT NULL DEFAULT 'user',
              theme TEXT NOT NULL DEFAULT 'system',
              email_notifications BOOLEAN NOT NULL DEFAULT true,
              push_notifications BOOLEAN NOT NULL DEFAULT false,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
            );

            ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

            CREATE POLICY "Users can view their own profile" ON users
              FOR SELECT USING (
                auth.uid() = id OR 
                auth.jwt() ->> 'email' = email
              );

            CREATE POLICY "Users can update their own profile" ON users
              FOR UPDATE USING (
                auth.uid() = id OR 
                auth.jwt() ->> 'email' = email
              );

            CREATE POLICY "Users can insert their own profile" ON users
              FOR INSERT WITH CHECK (
                auth.uid() = id OR 
                auth.jwt() ->> 'email' = email
              );

            GRANT ALL ON public.users TO authenticated;
            GRANT ALL ON public.users TO service_role;
          `,
        });

        if (createError) {
          console.error("Error creating users table:", createError);
          throw createError;
        }

        console.log("Users table created successfully");
      } else {
        console.error("Unexpected error checking table:", checkError);
        throw checkError;
      }
    } else {
      console.log("Users table exists");
    }

    tableChecked = true;
  } catch (error) {
    console.error("Error in ensureUsersTable:", error);
    throw error;
  }
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
