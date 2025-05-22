
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { updateUserProfile } from "@/services/user-service";
import { User } from "@/contexts/auth-types";
import { toast as sonnerToast } from "sonner";
import { supabase } from "@/services/supabase-client";
import { AuthTokenService } from "@/services/auth-token-service";

export const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const authTokenService = AuthTokenService.getInstance();

  const updateUser = useCallback(
    async (user: User, updates: Partial<User>): Promise<User | null> => {
      if (!user || !user.email) {
        console.error("Cannot update user: No user or email provided");
        return null;
      }

      try {
        setIsLoading(true);
        console.log("useUpdateUser: Updating user with:", updates);

        // Get current stored profile to ensure we don't lose data
        const storedProfile = authTokenService.getUserProfile();
        
        // Create a merged user object for updates, preserving existing data
        const updatedUser = { 
          ...storedProfile,  // Start with stored profile (complete data)
          ...user,           // Add current user state
          ...updates         // Apply requested updates
        };

        // Update in database through user service
        const result = await updateUserProfile(user.email, updatedUser);
        
        if (result) {
          console.log("Profile updated in database:", result);
          
          // Update auth metadata with essential user info
          try {
            await supabase.auth.updateUser({
              data: {
                display_name: updatedUser.displayName,
                photo_url: updatedUser.photoURL,
                location: updatedUser.location,
                role: updatedUser.role,
              },
            });
            console.log("Auth metadata updated successfully");
          } catch (authError) {
            console.warn("Error updating auth metadata:", authError);
          }

          // Update local storage with merged data for cross-tab consistency
          authTokenService.storeUserProfile(updatedUser);
          
          toast({
            title: "Profile updated",
            description: "Your profile has been successfully updated.",
          });
          
          return updatedUser;
        } else {
          sonnerToast.error("Update failed", {
            description: "Failed to update your profile. Please try again.",
          });
          return null;
        }
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
