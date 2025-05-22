import { useState, useEffect, useRef } from "react";
import { supabase } from "@/services/supabase-client";
import { UserProfile } from "@/services/types";
import { fetchUserProfile } from "@/services/user-service";
import { AuthTokenService } from "@/services/auth-token-service";

export const useAuthInit = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  const authTokenService = AuthTokenService.getInstance();

  useEffect(() => {
    console.log("useAuthInit: Initializing auth...");
    
    // Register for auth events from AuthTokenService
    const unsubscribe = authTokenService.addAuthEventListener(() => {
      console.log("useAuthInit: Auth event received, refreshing state");
      checkAuthState();
    });
    
    // Main function to check authentication state
    const checkAuthState = async () => {
      if (!mounted.current) return;
      
      try {
        setLoading(true);
        
        // Check for a session from Supabase
        const { data } = await supabase.auth.getSession();
        
        // If we have a session, load the user profile
        if (data.session?.user?.email) {
          console.log("Found existing session for user:", data.session.user.email);
          const profile = await loadUserProfile(data.session.user.email);
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          }
        } 
        // No session, try to get profile from local storage
        else {
          const storedProfile = authTokenService.getUserProfile();
          
          if (storedProfile?.email) {
            // We have a stored profile but no active session
            // Try to refresh the session once
            try {
              const { data: refreshData } = await supabase.auth.refreshSession();
              
              if (refreshData.session) {
                // Session refreshed successfully
                console.log("Session refreshed successfully");
                const profile = await loadUserProfile(storedProfile.email);
                if (profile) {
                  setUser(profile);
                  setIsAuthenticated(true);
                }
              } else {
                // Clear auth data since session couldn't be refreshed
                console.log("Session refresh failed, clearing auth data");
                authTokenService.clearAuthData();
                setUser(null);
                setIsAuthenticated(false);
              }
            } catch (sessionErr) {
              console.warn("Session refresh error:", sessionErr);
              authTokenService.clearAuthData();
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            console.log("No existing session or valid stored profile");
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error("Error during auth initialization:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    // Load user profile helper function
    const loadUserProfile = async (email: string): Promise<UserProfile | null> => {
      if (!email) return null;
      
      try {
        console.log("Loading profile for user:", email);
        
        // Try to fetch user profile from database
        const dbProfile = await fetchUserProfile(email);
        
        if (dbProfile) {
          console.log("Found existing profile in database");
          
          // Merge with stored profile if exists
          const storedProfile = authTokenService.getUserProfile();
          
          // Merge with preference to database values but keep any local-only fields
          const mergedProfile = storedProfile 
            ? { ...storedProfile, ...dbProfile } 
            : dbProfile;
            
          // Store the merged profile
          authTokenService.storeUserProfile(mergedProfile);
          return mergedProfile;
        }
        
        // Return stored profile as fallback
        return authTokenService.getUserProfile();
      } catch (err) {
        console.error("Error loading user profile:", err);
        // Use stored profile as fallback
        return authTokenService.getUserProfile();
      }
    };

    // Initial auth check
    checkAuthState();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (mounted.current) {
        if (session && ["SIGNED_IN", "TOKEN_REFRESHED", "USER_UPDATED"].includes(event)) {
          console.log("Processing", event, "event");
          
          if (session.user?.email) {
            const profile = await loadUserProfile(session.user.email);
            if (profile) {
              setUser(profile);
              setIsAuthenticated(true);
            }
          }
        } 
        else if (event === "SIGNED_OUT" || !session) {
          console.log("User signed out or session expired");
          authTokenService.clearAuthData();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    });

    return () => {
      mounted.current = false;
      subscription?.unsubscribe();
      unsubscribe();
    };
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
};
