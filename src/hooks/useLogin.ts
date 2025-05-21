
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/services/supabase-client";
import { toast as sonnerToast } from "sonner";
import { AuthTokenService } from "@/services/auth-token-service";
import { updateUserProfile } from "@/services/user-service";
import { UserProfile } from "@/services/types";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const authTokenService = AuthTokenService.getInstance();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      sonnerToast.dismiss(); // Clear any existing toasts
      sonnerToast.loading("Signing in...");

      console.log("Attempting Supabase auth sign-in...");
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Auth error:", authError);
        sonnerToast.dismiss();
        toast({
          variant: "destructive",
          title: "Error",
          description: authError.message,
        });
        return null;
      }

      if (!data.user || !data.session) {
        console.error("No user or session data returned");
        sonnerToast.dismiss();
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to sign in",
        });
        return null;
      }

      console.log("Storing session data...");
      // Store the session for later use
      await authTokenService.storeSession(data.session);

      // Ensure user profile exists
      try {
        const userProfile: UserProfile = {
          email: data.user.email || "",
          displayName: data.user.user_metadata?.display_name || email.split("@")[0],
          photoURL: data.user.user_metadata?.photo_url || 
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
          location: data.user.user_metadata?.location || "",
          bio: "",
          website: "",
          github: "",
          twitter: "",
          role: "User",
          theme: "system",
          emailNotifications: true,
          pushNotifications: false,
        };
        
        // Update/create user profile without throwing errors
        await updateUserProfile(email, userProfile);
      } catch (profileError) {
        console.error("Error ensuring user profile:", profileError);
        // Continue with login anyway
      }

      // Success
      sonnerToast.dismiss();
      sonnerToast.success("Signed in successfully");
      navigate("/dashboard");

      return {
        email: data.user.email || "",
        displayName: data.user.user_metadata?.display_name || email.split("@")[0],
        photoURL: data.user.user_metadata?.photo_url || 
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
        location: data.user.user_metadata?.location || "",
        bio: "",
        website: "",
        github: "",
        twitter: "",
        role: "User",
        theme: "system",
        emailNotifications: true,
        pushNotifications: false,
      };
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      sonnerToast.dismiss();
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred during sign in",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
