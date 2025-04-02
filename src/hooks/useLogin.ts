
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Auth sign-in error:", error);
        sonnerToast.dismiss();
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to sign in",
        });
        throw error;
      }

      if (!data?.user) {
        console.error("No user data returned from auth");
        sonnerToast.dismiss();
        toast({
          variant: "destructive",
          title: "Error",
          description: "No user data returned",
        });
        throw new Error("No user data returned");
      }

      // Step 2: Get user profile from database
      console.log("Getting user profile from database...");
      let userProfile: User | null = await getUser(data.user.email || "");
      
      // If no profile exists in the database, create one from auth data
      if (!userProfile) {
        console.log("No profile found in database, creating one from auth data");
        const basicProfile: User = {
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
        
        // Store in database
        try {
          await storeUser(basicProfile);
          userProfile = basicProfile;
        } catch (dbError) {
          console.error("Error storing user in database:", dbError);
          // Continue despite database error, using the basic profile
          userProfile = basicProfile;
        }
      }

      // Step 3: Store in localStorage for immediate access
      console.log("Storing user data in localStorage...");
      localStorage.setItem("user", JSON.stringify(userProfile));
      localStorage.setItem("authenticated", "true");
      localStorage.setItem("lastLoggedInEmail", data.user.email || "");

      // Step 4: Success - dismiss loading toast
      sonnerToast.dismiss();
      sonnerToast.success("Signed in successfully");
      navigate("/dashboard");
      
      return userProfile;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      sonnerToast.dismiss();
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign in",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
