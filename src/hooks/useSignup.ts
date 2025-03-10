
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { storeUser, updateUserProfile } from "@/services/db-service";
import { User } from "@/contexts/auth-types";
import { supabase } from "@/services/supabase-client";

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signup = async (email: string, password: string, profileData: Partial<User> = {}) => {
    try {
      setIsLoading(true);

      // Get the current site URL for redirection
      const siteUrl = window.location.origin;
      console.log("Using redirect URL:", siteUrl + '/dashboard');

      // Create new user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: siteUrl + '/dashboard'
        }
      });

      if (error) throw error;

      if (data && data.user) {
        try {
          console.log("Creating user profile with data:", profileData);
          
          // Create user profile with additional data provided
          const newUser: User = {
            email: data.user.email || '',
            displayName: profileData.displayName || data.user.email?.split("@")[0] || 'User',
            photoURL: profileData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
            location: profileData.location || '',
            bio: profileData.bio || '',
            website: profileData.website || '',
            github: profileData.github || '',
            twitter: profileData.twitter || '',
            role: profileData.role || 'User',
            theme: profileData.theme || 'system',
            emailNotifications: profileData.emailNotifications !== undefined ? profileData.emailNotifications : true,
            pushNotifications: profileData.pushNotifications !== undefined ? profileData.pushNotifications : false,
          };
          
          // Store the user in our custom table
          // This now gracefully handles database errors
          const basicUserProfile = await storeUser(newUser);
          
          // Also store extended profile fields
          const fullUserProfile = await updateUserProfile(newUser.email, newUser);
          
          // Use the profile with more fields if available
          const userProfile = fullUserProfile || basicUserProfile;
          
          // Store in localStorage for later persistence
          localStorage.setItem("user", JSON.stringify(userProfile));
          
          // If email confirmation is required (which is the default for Supabase)
          const needsEmailConfirmation = !data.user.email_confirmed_at;
          
          if (needsEmailConfirmation) {
            toast({
              title: "Verification email sent",
              description: "Please check your email to verify your account before signing in.",
            });
            
            // Explicitly sign them out so they need to verify first
            await supabase.auth.signOut();
            
            // Navigate to signin page to wait for verification
            navigate("/signin", { replace: true });
            return userProfile;
          }
          
          // If email doesn't need confirmation (unusual for Supabase)
          localStorage.setItem("authenticated", "true");
          localStorage.setItem("lastLoggedInEmail", data.user.email || '');

          toast({
            title: "Account created!",
            description: "Your account has been successfully created.",
          });

          navigate("/dashboard", { replace: true });
          return userProfile;
        } catch (dbError: any) {
          console.error("Error creating user profile:", dbError);
          
          // Even if there's an error with the profile creation, the auth was successful
          // We can let the user continue with a local profile
          const fallbackProfile = {
            email: data.user.email || '',
            displayName: profileData.displayName || data.user.email?.split("@")[0] || 'User',
            photoURL: profileData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
            location: profileData.location || '',
            bio: profileData.bio || '',
          };
          
          // Save to localStorage 
          localStorage.setItem("user", JSON.stringify(fallbackProfile));
          
          // If email confirmation is required
          if (!data.user.email_confirmed_at) {
            toast({
              variant: "default",
              title: "Verification email sent",
              description: "Please check your email to verify your account before signing in.",
            });
            
            // Explicitly sign them out so they need to verify first
            await supabase.auth.signOut();
            
            // Navigate to signin page to wait for verification
            navigate("/signin", { replace: true });
            return fallbackProfile;
          }
          
          localStorage.setItem("authenticated", "true");
          localStorage.setItem("lastLoggedInEmail", data.user.email || '');
          
          toast({
            variant: "default",
            title: "Account created",
            description: "Your account was created successfully. Some profile features may be limited.",
          });
          
          // Navigate to dashboard anyway as the authentication succeeded
          navigate("/dashboard", { replace: true });
          return fallbackProfile;
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
