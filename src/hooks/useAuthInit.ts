import { useState, useEffect } from "react";
import { User } from "@/contexts/auth-types";
import { supabase } from "@/services/supabase-client";

export const useAuthInit = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Create a minimal fallback user profile from email
  const createBasicUserProfile = (email: string): User => {
    return {
      email,
      displayName: email.split("@")[0] || 'User',
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
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
  };

  useEffect(() => {
    // To prevent infinite loading, set a timeout
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.log("Auth check is taking too long, stopping loading state");
        setIsLoading(false);
      }
    }, 2000);

    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // First check localStorage for faster loading
        const storedAuth = localStorage.getItem("authenticated");
        const storedUser = localStorage.getItem("user");
        const lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail");
        
        if (storedAuth === "true" && storedUser) {
          try {
            // Parse and set the user from localStorage immediately for a faster UI update
            const parsedUser = JSON.parse(storedUser) as User;
            setUser(parsedUser);
            setIsAuthenticated(true);
          } catch (e) {
            console.error("Invalid stored user data:", e);
            // Clear invalid data
            localStorage.removeItem("authenticated");
            localStorage.removeItem("user");
            localStorage.removeItem("lastLoggedInEmail");
          }
        }
        
        // Now check if there's an active Supabase session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData?.user) {
            console.log("Active session found for:", userData.user.email);
            
            // Create a basic profile for the user
            const email = userData.user.email || '';
            let userProfile = createBasicUserProfile(email);
            
            // Try to use stored profile if available
            if (storedAuth === "true" && storedUser) {
              try {
                const parsedProfile = JSON.parse(storedUser) as User;
                // Use the stored profile with the basic profile as fallback fields
                userProfile = {
                  ...userProfile,
                  ...parsedProfile,
                  email, // Always use the current session email
                };
              } catch (e) {
                console.error("Error parsing stored user:", e);
                // Keep using basic profile
              }
            }
            
            // Set user and authenticated state
            setUser(userProfile);
            setIsAuthenticated(true);
            localStorage.setItem("authenticated", "true");
            localStorage.setItem("lastLoggedInEmail", email);
            localStorage.setItem("user", JSON.stringify(userProfile));
          } else {
            // Clear auth state since session exists but no valid user
            localStorage.removeItem("authenticated");
            setUser(null);
            setIsAuthenticated(false);
          }
        } else if (storedAuth !== "true" || !storedUser) {
          // No active session and no valid localStorage data
          localStorage.removeItem("authenticated");
          localStorage.removeItem("user");
          localStorage.removeItem("lastLoggedInEmail");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Don't clear localStorage on error - the user might be offline
        // Just set authenticated state based on localStorage
        if (localStorage.getItem("authenticated") === "true" && localStorage.getItem("user")) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } finally {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session ? "Session exists" : "No session");
      
      if (event === 'SIGNED_IN' && session) {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          const email = data.user.email || '';
          const basicProfile = createBasicUserProfile(email);
          
          setUser(basicProfile);
          setIsAuthenticated(true);
          localStorage.setItem("authenticated", "true");
          localStorage.setItem("lastLoggedInEmail", email);
          localStorage.setItem("user", JSON.stringify(basicProfile));
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, clearing user data");
        localStorage.removeItem("authenticated");
        localStorage.removeItem("user");
        localStorage.removeItem("lastLoggedInEmail");
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    // Immediately check auth state
    checkAuth();

    // Cleanup listener and timeout on unmount
    return () => {
      clearTimeout(loadingTimeout);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated
  };
};
