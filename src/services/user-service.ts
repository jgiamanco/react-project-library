
import { fetchUserProfile, createUserProfile, updateExistingProfile } from "./user-service-helpers";
import { UserProfile } from "./types";

// This is needed for backwards compatibility - renamed fetchUserProfile to getUserProfile
export const getUserProfile = fetchUserProfile;

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
      // Ensure ID is always set
      if (!mergedProfile.id) {
        mergedProfile.id = email;
      }
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

// Legacy functions for backward compatibility
export const storeUser = createUserProfile;
export const getUser = fetchUserProfile;
export const deleteUser = async (email: string): Promise<boolean> => {
  console.log("deleteUser function is deprecated");
  // This is just a stub for backward compatibility
  return true;
};
export const ensureUsersTable = async (): Promise<boolean> => {
  console.log("ensureUsersTable function is deprecated");
  // This is just a stub for backward compatibility
  return true;
};

// Export other functions for use elsewhere
export { fetchUserProfile, createUserProfile };
