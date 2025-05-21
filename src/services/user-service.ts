
import { fetchUserProfile, createUserProfile, updateExistingProfile } from "./user-service-helpers";
import { UserProfile } from "./types";

// This is needed for backwards compatibility - renamed fetchUserProfile to getUserProfile
export const getUserProfile = fetchUserProfile;

// Update or create a user profile
export async function updateUserProfile(email: string, profile: Partial<UserProfile>): Promise<UserProfile | null> {
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
      // Create a complete profile with required fields
      const newProfile: UserProfile = {
        id: profile.id || email,
        email: email,
        displayName: profile.displayName || email.split('@')[0] || 'User',
        photoURL: profile.photoURL,
        bio: profile.bio || "Tell us about yourself...",
        location: profile.location,
        website: profile.website,
        github: profile.github,
        twitter: profile.twitter,
        role: profile.role || "Developer",
        theme: profile.theme || "system",
        emailNotifications: profile.emailNotifications !== undefined ? profile.emailNotifications : true,
        pushNotifications: profile.pushNotifications !== undefined ? profile.pushNotifications : false
      };
      return await createUserProfile(email, newProfile);
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
