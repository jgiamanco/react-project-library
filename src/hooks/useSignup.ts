
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase, supabaseAdmin } from "@/services/supabase-client";
import { UserProfile } from "@/services/types";
import { toast as sonnerToast } from "sonner";
import { updateUserProfile } from "@/services/user-service";

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signUp = async (
    email: string,
    password: string,
    profile: UserProfile
  ) => {
    try {
      setLoading(true);
      sonnerToast.loading("Creating your account...");

      // Create the user in Supabase Auth
      console.log("Creating auth user...");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: profile.displayName,
            photo_url: profile.photoURL,
            location: profile.location || "",
          },
        },
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

      if (!authData.user) {
        console.error("No user data returned");
        sonnerToast.dismiss();
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create account",
        });
        return null;
      }

      console.log("Auth user created successfully");

      // Store user profile in database
      try {
        console.log("Storing user profile in database...");
        
        // The updateUserProfile function is more robust than storeUser
        await updateUserProfile(email, {
          email: email,
          displayName: profile.displayName,
          photoURL: profile.photoURL,
          bio: profile.bio || "",
          location: profile.location || "",
          website: profile.website || "",
          github: profile.github || "",
          twitter: profile.twitter || "",
          role: profile.role || "User",
          theme: profile.theme || "system",
          emailNotifications: profile.emailNotifications || true,
          pushNotifications: profile.pushNotifications || false,
        });
        
        console.log("User profile stored successfully");
      } catch (dbError) {
        console.error("Error storing user profile:", dbError);
        // Continue with signup even if profile storage fails temporarily
      }

      sonnerToast.dismiss();
      toast({
        title: "Success",
        description: "Account created successfully! Please verify your email.",
      });

      // Return the user object
      return authData.user;
    } catch (error) {
      console.error("Sign up error:", error);
      sonnerToast.dismiss();
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading };
};
