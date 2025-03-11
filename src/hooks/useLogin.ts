
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getUser } from "@/services/db-service";
import { User } from "@/contexts/auth-types";
import { supabase } from "@/services/supabase-client";
import { toast as sonnerToast } from "sonner";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      sonnerToast.dismiss(); // Clear any existing toasts

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
        try {
          // Try to get user profile from database
          const userProfile = await getUser(data.user.email || '');
          
          // Create a basic profile regardless of database access
          const basicProfile: User = {
            email: data.user.email || '',
            displayName: data.user.email?.split("@")[0] || 'User',
            photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
            location: '',
            bio: '',
            website: '',
            github: '',
            twitter: '',
            role: 'User',
            theme: 'system',
            emailNotifications: true,
            pushNotifications: false,
          };
          
          // Use the database profile if available, otherwise use basic profile
          const finalProfile = userProfile || basicProfile;
          
          // Store in localStorage
          localStorage.setItem("user", JSON.stringify(finalProfile));
          localStorage.setItem("authenticated", "true");
          localStorage.setItem("lastLoggedInEmail", data.user.email || '');

          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });

          navigate("/dashboard", { replace: true });
          
          return finalProfile;
        } catch (profileError) {
          console.error("Error getting user profile, using basic profile:", profileError);
          
          // Create a basic profile as fallback
          const fallbackProfile: User = {
            email: data.user.email || '',
            displayName: data.user.email?.split("@")[0] || 'User',
            photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
            location: '',
            bio: '',
            website: '',
            github: '',
            twitter: '',
            role: 'User',
            theme: 'system',
            emailNotifications: true,
            pushNotifications: false,
          };
          
          // Store in localStorage
          localStorage.setItem("user", JSON.stringify(fallbackProfile));
          localStorage.setItem("authenticated", "true");
          localStorage.setItem("lastLoggedInEmail", data.user.email || '');

          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });

          navigate("/dashboard", { replace: true });
          
          return fallbackProfile;
        }
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
