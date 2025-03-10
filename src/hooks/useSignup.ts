
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/contexts/auth-types";
import { supabase } from "@/services/supabase-client";
import { toast as sonnerToast } from "sonner";

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const createUserInSupabase = async (userData: User) => {
    try {
      // First, try to directly create a user using SQL to ensure the table exists
      const { data: tableData, error: tableError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS users (
            email VARCHAR PRIMARY KEY,
            display_name VARCHAR NOT NULL,
            photo_url VARCHAR,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
          );
        `
      });
      
      if (tableError) {
        console.error("Error creating users table:", tableError);
        return false;
      }
      
      // Now try to insert the user
      const { error: insertError } = await supabase
        .from("users")
        .upsert({
          email: userData.email,
          display_name: userData.displayName,
          photo_url: userData.photoURL,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'email'
        });
        
      if (insertError) {
        console.error("Error inserting user:", insertError);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Error in createUserInSupabase:", err);
      return false;
    }
  };

  const signup = async (email: string, password: string, profileData: Partial<User> = {}) => {
    try {
      setIsLoading(true);
      sonnerToast.dismiss(); // Clear any existing toasts

      // Show loading toast
      const loadingToastId = sonnerToast.loading("Creating your account...");

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

      if (error) {
        sonnerToast.dismiss(loadingToastId);
        throw error;
      }

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
          
          // Store local copy regardless of database success
          localStorage.setItem("user", JSON.stringify(newUser));
          
          // Try to store in database, but don't fail if it doesn't work
          const dbStored = await createUserInSupabase(newUser);
          console.log("User stored in database:", dbStored);
          
          // If email confirmation is required (which is the default for Supabase)
          const needsEmailConfirmation = !data.user.email_confirmed_at;
          
          // Dismiss the loading toast
          sonnerToast.dismiss(loadingToastId);
          
          if (needsEmailConfirmation) {
            // Show verification email sent toast
            toast({
              title: "Verification email sent",
              description: "Please check your email to verify your account before signing in.",
            });
            
            // Explicitly sign them out so they need to verify first
            await supabase.auth.signOut();
            
            // Navigate to signin page to wait for verification
            navigate("/signin", { replace: true });
            return newUser;
          }
          
          // If email doesn't need confirmation (unusual for Supabase)
          localStorage.setItem("authenticated", "true");
          localStorage.setItem("lastLoggedInEmail", data.user.email || '');
          
          toast({
            title: "Account created!",
            description: "Your account has been successfully created.",
          });

          navigate("/dashboard", { replace: true });
          return newUser;
        } catch (dbError: any) {
          console.error("Error creating user profile:", dbError);
          
          // Dismiss the loading toast
          sonnerToast.dismiss(loadingToastId);
          
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
      
      // If we get here, no user was created, dismiss loading toast
      sonnerToast.dismiss(loadingToastId);
      return null;
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Make sure any loading toasts are dismissed
      sonnerToast.dismiss();
      
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
