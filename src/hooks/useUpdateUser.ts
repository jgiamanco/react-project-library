
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { updateUserProfile } from "@/services/db-service";
import { User } from "@/contexts/auth-types";
import { toast as sonnerToast } from "sonner";

export const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateUser = async (user: User, updates: Partial<User>) => {
    if (!user) return null;

    try {
      setIsLoading(true);
      console.log("Updating user with data:", updates);
      
      const updatedUser = { ...user, ...updates };
      
      // Update in our custom table using updateUserProfile for better field handling
      const result = await updateUserProfile(user.email, updatedUser);
      
      if (!result) {
        throw new Error("Failed to update profile in database");
      }
      
      console.log("Profile updated in database:", result);
      
      // Update in localStorage for compatibility and fallback
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
