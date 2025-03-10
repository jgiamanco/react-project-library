import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { storeUser } from "@/services/db-service";
import { User } from "@/contexts/auth-types";
import { supabase } from "@/services/supabase-client";

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signup = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Create new user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/dashboard'
        }
      });

      if (error) throw error;

      if (data && data.user) {
        try {
          // Create user profile
          const newUser: User = {
            email: data.user.email || '',
            displayName: data.user.email?.split("@")[0] || 'User',
            photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
          };
          
          // Store the user in our custom table
          // Wrap this in a try/catch to handle potential database errors separately
          const userProfile = await storeUser(newUser);
          
          // Update local storage
          localStorage.setItem("user", JSON.stringify(userProfile));
          localStorage.setItem("authenticated", "true");
          localStorage.setItem("lastLoggedInEmail", data.user.email || '');

          // Check if email confirmation is required
          if (data.user.identities && data.user.identities.length === 0) {
            toast({
              title: "Verification email sent",
              description: "Please check your email to verify your account before signing in.",
            });
            
            // Stay on the same page for verification
            setIsLoading(false);
            return userProfile;
          }

          toast({
            title: "Account created!",
            description: "Your account has been successfully created.",
          });

          navigate("/dashboard", { replace: true });
          return userProfile;
        } catch (dbError: any) {
          console.error("Error creating user profile:", dbError);
          
          // Even if there's an error with the profile creation, the auth was successful
          // We can let the user continue with limited functionality
          toast({
            variant: "destructive",
            title: "Partial Success",
            description: "Your account was created but there was an issue setting up your profile. Some features may be limited.",
          });
          
          // Navigate to dashboard anyway as the authentication succeeded
          navigate("/dashboard", { replace: true });
          return null;
        }
      }
      return null;
    } catch (error: any) {
      console.error("Signup error:", error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signup,
    isLoading
  };
};
