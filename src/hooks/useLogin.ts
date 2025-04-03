import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/contexts/auth-types";
import { supabase } from "@/services/supabase-client";
import { toast as sonnerToast } from "sonner";
import { storeUser, getUser } from "@/services/user-service";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      sonnerToast.dismiss(); // Clear any existing toasts

      // Show loading toast
      sonnerToast.loading("Signing in...");

      // Step 1: Sign in with Supabase Auth
      console.log("Attempting Supabase auth sign-in...");
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

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

      if (!data.user) {
        console.error("No user data returned");
        sonnerToast.dismiss();
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to sign in",
        });
        return null;
      }

      // Step 2: Store only essential auth data in localStorage
      console.log("Storing user data in localStorage...");
      localStorage.setItem("auth_token", data.session?.access_token || "");
      localStorage.setItem("user_email", data.user.email || "");

      // Step 3: Success - dismiss loading toast
      sonnerToast.dismiss();
      sonnerToast.success("Signed in successfully");
      navigate("/dashboard");

      // Return the user data from the auth response
      return {
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
