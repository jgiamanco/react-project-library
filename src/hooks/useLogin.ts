import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/services/supabase-client";
import { toast as sonnerToast } from "sonner";
import { AuthTokenService } from "@/services/auth-token-service";
import { fetchUserProfile, updateUserProfile } from "@/services/user-service";
import { UserProfile } from "@/services/types";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const authTokenService = AuthTokenService.getInstance();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      sonnerToast.loading("Signing in...");

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Auth error:", error);
        sonnerToast.dismiss();
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
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

      // Fetch full profile from database
      const dbProfile = await fetchUserProfile(email);

      // Create or merge profile
      let userProfile: UserProfile;

      if (dbProfile) {
        // Use the database profile
        userProfile = dbProfile;
      } else {
        // Create basic profile if needed
        userProfile = {
          id: email,
          email: data.user.email || "",
          displayName:
            data.user.user_metadata?.display_name || email.split("@")[0],
          photoURL:
            data.user.user_metadata?.photo_url ||
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

        // Ensure profile exists in database
        try {
          await updateUserProfile(email, userProfile);
        } catch (profileError) {
          console.error("Error ensuring user profile:", profileError);
          // Continue with login anyway
        }
      }

      // Store profile in local storage
      authTokenService.setUserProfile(userProfile);

      // Success notification and redirect
      sonnerToast.dismiss();
      sonnerToast.success("Signed in successfully");
      navigate("/dashboard");

      return userProfile;
    } catch (error) {
      console.error("Login error:", error);
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
