
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase, supabaseAdmin } from "@/services/supabase-client";
import { UserProfile } from "@/services/types";
import { toast as sonnerToast } from "sonner";

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

      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .from("users")
        .select("email")
        .eq("email", email)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // If error is not "not found", then it's a real error
        console.error("Check user error:", checkError);
        sonnerToast.dismiss();
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check if user exists",
        });
        return null;
      }

      if (existingUser) {
        sonnerToast.dismiss();
        toast({
          variant: "destructive",
          title: "Error",
          description: "An account with this email already exists.",
        });
        return null;
      }

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

      // Store user profile in database using the admin client to bypass RLS
      const { error: dbError } = await supabaseAdmin.from("users").upsert({
        email: authData.user.email,
        display_name: profile.displayName,
        photo_url: profile.photoURL,
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        github: profile.github || "",
        twitter: profile.twitter || "",
        role: profile.role || "User",
        theme: profile.theme || "system",
        email_notifications: profile.emailNotifications || true,
        push_notifications: profile.pushNotifications || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (dbError) {
        console.error("Database error:", dbError);
        sonnerToast.dismiss();
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create user profile",
        });
        return null;
      }

      sonnerToast.dismiss();
      toast({
        title: "Success",
        description: "Account created successfully!",
      });

      // Don't automatically navigate - let the client handle this
      // based on email verification needs
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
