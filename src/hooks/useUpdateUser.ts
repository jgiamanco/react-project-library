
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { updateUserProfile } from "@/services/user-service";
import { User } from "@/contexts/auth-types";
import { toast as sonnerToast } from "sonner";
import { supabase } from "@/services/supabase-client";

export const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateUser = useCallback(
    async (user: User, updates: Partial<User>): Promise<User | null> => {
      if (!user || !user.email) {
        console.error("Cannot update user: No user or email provided");
        return null;
      }

      try {
        setIsLoading(true);
        console.log("useUpdateUser: Updating user with:", updates);

        // Create a merged user object for updates
        const updatedUser = { ...user, ...updates };

        // First, update user metadata in Supabase Auth
        try {
          const { error: authUpdateError } = await supabase.auth.updateUser({
            data: {
              display_name: updatedUser.displayName,
              photo_url: updatedUser.photoURL,
              location: updatedUser.location,
              bio: updatedUser.bio,
              website: updatedUser.website,
              github: updatedUser.github,
              twitter: updatedUser.twitter,
              role: updatedUser.role,
              theme: updatedUser.theme,
              email_notifications: updatedUser.emailNotifications,
              push_notifications: updatedUser.pushNotifications,
              // Store the complete profile data in metadata
              profile_data: updatedUser,
            },
          });

          if (authUpdateError) {
            console.warn(
              `Auth metadata update warning: ${authUpdateError.message}`
            );
            // Continue anyway to update the profile in database
          } else {
            console.log("Auth metadata updated successfully");
          }
        } catch (authError) {
          console.warn("Error updating auth metadata:", authError);
          // Continue anyway to update the profile in database
        }

        // Update in our custom table using updateUserProfile
        let result;
        try {
          result = await updateUserProfile(user.email, updatedUser);
          console.log("Profile updated in database:", result);
        } catch (dbError) {
          console.error("Failed to update profile in database:", dbError);
          sonnerToast.error("Database update failed", {
            description: "Profile was only updated locally. Changes may not persist.",
          });
          // We'll still update localStorage and consider it a success from the user's perspective
        }

        // Always update in localStorage for compatibility and fallback
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("user_profile", JSON.stringify(updatedUser));

        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });

        // Return the updated user regardless of whether the database update was successful
        return updatedUser;
      } catch (error) {
        console.error("Update user error:", error);
        sonnerToast.error("Update failed", {
          description: "Failed to update your profile. Please try again.",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  return {
    updateUser,
    isLoading,
  };
};
