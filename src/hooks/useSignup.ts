import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase, supabaseAdmin } from "@/services/supabase-client";
import { UserProfile } from "../services/types";

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
      const loadingToast = toast({
        title: "Creating your account...",
        description: "Please wait while we set up your profile.",
      });

      // Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: profile.displayName,
            photo_url: profile.photoURL,
          },
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        toast({
          variant: "destructive",
          title: "Error",
          description: authError.message,
        });
        return;
      }

      if (!authData.user) {
        console.error("No user data returned");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create account",
        });
        return;
      }

      // Wait for the session to be established
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("Session error:", sessionError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to establish session",
        });
        return;
      }

      // Store user profile in database using the admin client to bypass RLS
      const { error: dbError } = await supabaseAdmin.from("users").upsert({
        email: authData.user.email,
        display_name: profile.displayName,
        photo_url: profile.photoURL,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        github: profile.github,
        twitter: profile.twitter,
        role: profile.role,
        theme: profile.theme,
        email_notifications: profile.emailNotifications,
        push_notifications: profile.pushNotifications,
      });

      if (dbError) {
        console.error("Database error:", dbError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create user profile",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading };
};
