import {
  supabase,
  handleSupabaseError,
  getSupabaseClient,
} from "./supabase-client";
import {
  UserProfile,
  DbProfile,
  appToDbProfile,
  dbToAppProfile,
  isDbProfile,
} from "./types";
import { PostgrestResponse } from "@supabase/supabase-js";

const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = 5000
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

export async function ensureUsersTable(): Promise<void> {
  console.log("Starting ensureUsersTable...");
  try {
    const { data: tableCheck, error: checkError } = await supabase
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
              email TEXT PRIMARY KEY,
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

            CREATE POLICY "Users can view their own profile"
              ON public.users FOR SELECT
              USING (auth.uid()::text = email);

            CREATE POLICY "Users can update their own profile"
              ON public.users FOR UPDATE
              USING (auth.uid()::text = email);

            CREATE POLICY "Users can insert their own profile"
              ON public.users FOR INSERT
              WITH CHECK (auth.uid()::text = email);

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

    const { data: structureCheck, error: structureError } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (structureError) {
      console.error("Error verifying table structure:", structureError);
      throw structureError;
    }

    console.log("Table structure verified successfully");
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
    // Use the existing getUser function which already uses the users table
    const userProfile = await getUser(email);
    if (!userProfile) {
      console.log("No profile found for email:", email);
      return null;
    }

    console.log("Successfully retrieved user profile:", userProfile);
    return userProfile;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    throw error;
  }
};

const convertDbProfileToUserProfile = (data: DbProfile): UserProfile | null => {
  if (!data) return null;

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
  console.log("Starting updateUserProfile for email:", email);
  console.log("Profile data to update:", profile);

  if (!email) {
    throw new Error("Email is required for profile update");
  }

  try {
    // Get the auth user
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) {
      throw new Error("No authenticated user found");
    }

    // Get current profile from database
    const currentProfile = await getUser(email);

    // If no current profile exists, create a new one
    if (!currentProfile) {
      console.log("No existing profile found, creating new profile");
      const newProfile: UserProfile = {
        email,
        displayName: profile.displayName || email.split("@")[0] || "User",
        photoURL:
          profile.photoURL ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        location: profile.location || "",
        bio: profile.bio || "",
        website: profile.website || "",
        github: profile.github || "",
        twitter: profile.twitter || "",
        role: profile.role || "User",
        theme: profile.theme || "system",
        emailNotifications: profile.emailNotifications ?? true,
        pushNotifications: profile.pushNotifications ?? false,
      };

      // Convert to DB format
      const dbProfile = appToDbProfile(newProfile);
      console.log("Creating new profile:", dbProfile);

      // Insert new profile with auth user reference
      const { error: insertError } = await supabase.from("users").insert({
        ...dbProfile,
        id: authUser.id,
      });

      if (insertError) {
        console.error("Error creating new profile:", insertError);
        throw insertError;
      }

      console.log("New profile created successfully");
      return newProfile;
    }

    // Merge current profile with updates
    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...profile,
      email, // Ensure email is preserved
    };

    // Convert to DB format
    const dbProfile = appToDbProfile(updatedProfile);
    console.log("Converted to DB profile:", dbProfile);

    // Update the users table with auth user ID
    console.log("Sending upsert to users table:", dbProfile);
    const { error: usersError } = await supabase.from("users").upsert(
      {
        ...dbProfile,
        id: authUser.id,
      },
      {
        onConflict: "email",
      }
    );

    if (usersError) {
      console.error("Users table update failed:", usersError);
      throw usersError;
    }

    console.log("Profile updated successfully");
    return updatedProfile;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
};
