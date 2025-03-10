
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { updateUserProfile } from "@/services/db-service";
import { User } from "@/contexts/auth-types";

export const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateUser = async (user: User, updates: Partial<User>) => {
    if (!user) return null;

    try {
      setIsLoading(true);
      const updatedUser = { ...user, ...updates };
      
      // Update in our custom table using updateUserProfile for better field handling
      const result = await updateUserProfile(user.email, updatedUser);
      
      // Update in localStorage for compatibility
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      return updatedUser;
    } catch (error) {
      console.error("Update user error:", error);
      toast({
        variant: "destructive",
        title: "Error",
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
