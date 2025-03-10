
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getUser, storeUser } from "@/services/db-service";
import { User } from "@/contexts/auth-types";
import { supabase } from "@/services/supabase-client";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Special handling for email_not_confirmed error
        if (error.message.includes("Email not confirmed") || error.code === "email_not_confirmed") {
          console.log("Email not confirmed error detected, sending new verification email");
          
          // Get the current site URL for redirection
          const siteUrl = window.location.origin;
          
          // Resend confirmation email
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email,
            options: {
              emailRedirectTo: siteUrl + '/dashboard'
            }
          });

          if (resendError) {
            console.error("Error resending verification email:", resendError);
          }
          
          toast({
            title: "Email verification required",
            description: "Please check your inbox for a verification email. We've sent a new one just now.",
          });
          
          throw new Error("Email not confirmed. Please check your inbox for the verification link.");
        }
        throw error;
      }

      if (data && data.user) {
        // Get or create user profile
        let userProfile = await getUser(data.user.email || '');
        
        if (!userProfile) {
          // Create user profile if it doesn't exist
          const newUser: User = {
            email: data.user.email || '',
            displayName: data.user.email?.split("@")[0] || 'User',
            photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
          };
          
          userProfile = await storeUser(newUser);
        }
        
        // Store in localStorage for backwards compatibility
        localStorage.setItem("user", JSON.stringify(userProfile));
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("lastLoggedInEmail", data.user.email || '');

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });

        navigate("/dashboard", { replace: true });
        
        return userProfile;
      }
      return null;
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Don't clear user data for email confirmation errors
      if (error.message && !error.message.includes("Email not confirmed")) {
        localStorage.removeItem("user");
        localStorage.removeItem("authenticated");
        localStorage.removeItem("lastLoggedInEmail");
      }
      
      if (!error.message.includes("Email not confirmed")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to sign in. Please try again.",
        });
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading
  };
};
