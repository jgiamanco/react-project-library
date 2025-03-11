
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { updateUserProfile } from "@/services/user-service";
import { User } from "@/contexts/auth-types";
import { toast as sonnerToast } from "sonner";
import { supabase } from "@/services/supabase-client";

export const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateUser = async (user: User, updates: Partial<User>) => {
    if (!user) return null;

    try {
      setIsLoading(true);
      console.log("Updating user with data:", updates);
      
      const updatedUser = { ...user, ...updates };
      
      // First, update user metadata in Supabase Auth
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: {
          display_name: updatedUser.displayName,
          photo_url: updatedUser.photoURL,
          location: updatedUser.location
        }
      });
      
      if (authUpdateError) {
        console.error("Error updating auth metadata:", authUpdateError);
      } else {
        console.log("Successfully updated auth metadata");
      }
      
      // Update in our custom table using updateUserProfile
      console.log("Updating user profile in database tables");
      const result = await updateUserProfile(user.email, updatedUser);
      console.log("Profile update result:", result);
      
      if (!result) {
        throw new Error("Failed to update profile in database");
      }
      
      // Update in localStorage for compatibility and fallback
      console.log("Updating local storage with new profile data");
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
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
  };

  return {
    updateUser,
    isLoading
  };
};
