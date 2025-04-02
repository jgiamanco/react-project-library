import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/contexts/auth-types";
import { supabase } from "@/services/supabase-client";
import { toast as sonnerToast } from "sonner";
import { storeUser } from "@/services/user-service";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      sonnerToast.dismiss(); // Clear any existing toasts

      // Show loading toast
      const loadingToastId = sonnerToast.loading("Signing in...");

      // Step 1: Sign in with Supabase Auth
      console.log("Attempting Supabase auth sign-in...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Auth sign-in error:", error);
        sonnerToast.dismiss(loadingToastId);
        throw error;
      }

      if (!data?.user) {
        console.error("No user data returned from auth");
        sonnerToast.dismiss(loadingToastId);
        throw new Error("No user data returned");
      }

      // Step 2: Create basic user profile from auth data
      console.log("Creating basic user profile from auth data...");
      const basicProfile: User = {
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

      // Step 3: Store in localStorage first for immediate access
      console.log("Storing user data in localStorage...");
      localStorage.setItem("user", JSON.stringify(basicProfile));
      localStorage.setItem("authenticated", "true");
      localStorage.setItem("lastLoggedInEmail", data.user.email || "");

      // Step 4: Try to store in database (non-blocking)
      console.log("Attempting to store user in database...");
      try {
        await storeUser(basicProfile);
        console.log("User stored in database successfully");
      } catch (dbError) {
        console.error("Database storage failed:", dbError);
        // Don't throw here - we already have the user in localStorage
      }

      // Step 5: Success - dismiss loading toast and navigate
      sonnerToast.dismiss(loadingToastId);
      sonnerToast.success("Signed in successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
