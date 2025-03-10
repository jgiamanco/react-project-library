
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { storeUser, getUser } from "@/services/db-service";
import { User } from "@/contexts/auth-types";
import { supabase } from "@/services/db-service";

export const useAuthOperations = () => {
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

      if (error) throw error;

      if (data.user) {
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
      localStorage.removeItem("user");
      localStorage.removeItem("authenticated");
      localStorage.removeItem("lastLoggedInEmail");
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in. Please try again.",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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

  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clean up local storage
      localStorage.removeItem("user");
      localStorage.removeItem("authenticated");
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = async (user: User, updates: Partial<User>) => {
    if (!user) return null;

    try {
      const updatedUser = { ...user, ...updates };
      
      // Update in our custom table
      await storeUser(updatedUser);
      
      // Update in localStorage for compatibility
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      return updatedUser;
    } catch (error) {
      console.error("Update user error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update your profile. Please try again.",
      });
      return null;
    }
  };

  return {
    login,
    signup,
    logout,
    updateUser,
    isLoading,
  };
};
