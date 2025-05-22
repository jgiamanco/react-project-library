
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
        // 1. Start with stored profile for complete data
        // 2. Add current user state (which may have newer values)
        // 3. Apply requested updates
        const updatedUser = { 
          ...storedProfile,  // Baseline profile data
          ...user,           // Current user state
          ...updates         // New updates (highest priority)
        };
        
        // Ensure ID is correctly set
        if (!updatedUser.id) {
          updatedUser.id = user.email;
        }

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
            // Continue despite auth metadata update error
          }

          // Update local storage with complete data
          authTokenService.storeUserProfile(result);
          
          toast({
            title: "Profile updated",
            description: "Your profile has been successfully updated.",
          });
          
          return result;
        } else {
          // Even if the server update fails, update local storage
          // This ensures UI consistency even with backend issues
          authTokenService.storeUserProfile(updatedUser);
          
          sonnerToast.error("Server update failed", {
            description: "Your changes were saved locally but not to the server.",
          });
          
          // Return the locally updated user despite server failure
          return updatedUser;
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
