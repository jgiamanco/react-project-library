import { fetchUserProfile, createUserProfile, updateExistingProfile } from "./user-service-helpers";
import { UserProfile } from "./types";

// Update or create a user profile
export async function updateUserProfile(email: string, profile: UserProfile): Promise<UserProfile | null> {
  console.log("Starting updateUserProfile for email:", email);
  
  try {
    // Try to fetch existing profile
    const existingProfile = await fetchUserProfile(email);
    
    if (existingProfile) {
      // Update existing profile
      console.log("Profile exists, updating...");
      // Merge profile data with existing profile
      const mergedProfile = { ...existingProfile, ...profile };
      return await updateExistingProfile(email, mergedProfile);
    } else {
      // Create new profile if not found
      console.log("No profile found, creating new profile");
      // Ensure profile has an ID
      if (!profile.id) {
        profile = { ...profile, id: email };
      }
      return await createUserProfile(email, profile);
    }
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
}

// Keep existing functions exported here
export { fetchUserProfile, createUserProfile };
