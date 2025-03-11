
import { useState, useEffect, useCallback, useRef } from "react";
import { User } from "@/contexts/auth-types";
import { supabase } from "@/services/supabase-client";
import { getUser } from "@/services/user-service";
import { measureExecutionTime } from "@/utils/performance-monitoring";

export const useAuthInit = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authCheckStarted = useRef(false);

  // Create a minimal fallback user profile from email
  const createBasicUserProfile = useCallback((email: string, userData: any = {}): User => {
    return {
      email,
      displayName: userData?.display_name || email.split("@")[0] || 'User',
      photoURL: userData?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      location: userData?.location || '',
      bio: '',
      website: '',
      github: '',
      twitter: '',
      role: 'User',
      theme: 'system',
      emailNotifications: true,
      pushNotifications: false,
    };
  }, []);

  useEffect(() => {
    if (authCheckStarted.current) return;
    authCheckStarted.current = true;
    
    // To prevent infinite loading, set a timeout that's shorter
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.log("Auth check is taking too long, stopping loading state");
        setIsLoading(false);
      }
    }, 1000); // Reduced from 2000ms to 1000ms

    const checkAuth = async () => {
      try {
        // First check localStorage for faster loading
        const storedAuth = localStorage.getItem("authenticated");
        const storedUser = localStorage.getItem("user");
        
        // Immediate UI update from localStorage
        if (storedAuth === "true" && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser) as User;
            setUser(parsedUser);
            setIsAuthenticated(true);
            // Don't set isLoading to false yet, continue checking with Supabase
          } catch (e) {
            console.error("Invalid stored user data:", e);
            localStorage.removeItem("authenticated");
            localStorage.removeItem("user");
          }
        }
        
        // Now check if there's an active Supabase session
        const { data: sessionData } = await measureExecutionTime(
          () => supabase.auth.getSession(),
          "supabase.auth.getSession"
        );
        
        if (sessionData?.session) {
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData?.user) {
            const email = userData.user.email || '';
            
            // Try to get user profile from database
            const userProfile = await getUser(email).catch(() => null);
            
            const finalUserProfile = userProfile || createBasicUserProfile(
              email, 
              userData.user.user_metadata
            );
            
            // Set user and authenticated state
            setUser(finalUserProfile);
            setIsAuthenticated(true);
            localStorage.setItem("authenticated", "true");
            localStorage.setItem("user", JSON.stringify(finalUserProfile));
          } else {
            // Clear auth state if no valid user
            if (storedAuth === "true") {
              localStorage.removeItem("authenticated");
              localStorage.removeItem("user");
            }
            setUser(null);
            setIsAuthenticated(false);
          }
        } else if (storedAuth !== "true") {
          // No active session and no valid localStorage data
          localStorage.removeItem("authenticated");
          localStorage.removeItem("user");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Don't clear localStorage on error - the user might be offline
      } finally {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          const email = data.user.email || '';
          
          try {
            const userProfile = await getUser(email).catch(() => null);
            
            const finalUserProfile = userProfile || createBasicUserProfile(
              email, 
              data.user.user_metadata
            );
            
            setUser(finalUserProfile);
            setIsAuthenticated(true);
            localStorage.setItem("authenticated", "true");
            localStorage.setItem("user", JSON.stringify(finalUserProfile));
          } catch (error) {
            console.error("Error in auth state change:", error);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem("authenticated");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    // Immediately check auth state using requestIdleCallback if available
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => checkAuth(), { timeout: 1000 });
    } else {
      checkAuth();
    }

    // Cleanup listener and timeout on unmount
    return () => {
      clearTimeout(loadingTimeout);
      authListener.subscription.unsubscribe();
    };
  }, [createBasicUserProfile]);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated
  };
};
