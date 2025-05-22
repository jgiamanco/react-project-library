import { useState, useEffect, useRef } from "react";
import { supabase } from "@/services/supabase-client";
import { UserProfile } from "@/services/types";
import { fetchUserProfile, createUserProfile } from "@/services/user-service";
import { AuthTokenService } from "@/services/auth-token-service";

export const useAuthInit = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  const authTokenService = AuthTokenService.getInstance();
  const initAttempted = useRef(false);

  useEffect(() => {
    console.log("useAuthInit: Initializing auth...");
    
    const initializeAuth = async () => {
      if (initAttempted.current) return;
      initAttempted.current = true;
      
      try {
        // Check for an existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.email) {
          console.log("Found existing session for user:", session.user.email);
          await loadUserProfile(session.user.email);
        } else {
          // Try to restore from stored profile
          const storedProfile = authTokenService.getUserProfile();
          
          if (storedProfile?.email) {
            console.log("Found stored profile for:", storedProfile.email);
            
            // Try to validate the session
            try {
              const { data: { user: supabaseUser } } = await supabase.auth.getUser();
              
              if (supabaseUser) {
                // Valid session and stored profile match
                console.log("Session validated for stored profile");
                setUser(storedProfile);
                setIsAuthenticated(true);
              } else {
                // No valid session but we have a stored profile
                // This is unusual, but try to continue with the stored profile
                console.log("No valid session but using stored profile");
                setUser(storedProfile);
                setIsAuthenticated(true);
                
                // Schedule a check to verify if the profile is still valid
                setTimeout(() => {
                  validateStoredProfile(storedProfile);
                }, 500);
              }
            } catch (sessionErr) {
              console.warn("Session validation error:", sessionErr);
              // Fall back to stored profile for now
              setUser(storedProfile);
              setIsAuthenticated(true);
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

    // Validate a stored profile by checking the database
    const validateStoredProfile = async (storedProfile: UserProfile) => {
      try {
        // Check if profile still exists in database
        const dbProfile = await fetchUserProfile(storedProfile.email);
        
        if (!dbProfile) {
          console.warn("Stored profile not found in database, clearing auth");
          authTokenService.clearAuthData();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        // Keep the existing auth state on error
        console.error("Error validating stored profile:", err);
      }
    };

    // Load user profile helper function
    const loadUserProfile = async (email: string) => {
      if (!email) {
        console.log("No email provided for loading user profile");
        return;
      }
      
      try {
        console.log("Loading profile for user:", email);
        // Try to fetch user profile
        const existingProfile = await fetchUserProfile(email);
        
        if (existingProfile) {
          console.log("Found existing profile in database");
          
          // We might have a profile in local storage too - merge them
          const storedProfile = authTokenService.getUserProfile();
          
          // Merge with preference to database values but keep any local-only fields
          const mergedProfile = storedProfile 
            ? { ...storedProfile, ...existingProfile } 
            : existingProfile;
            
          setUser(mergedProfile);
          setIsAuthenticated(true);
          
          // Store the merged profile for consistency
          authTokenService.storeUserProfile(mergedProfile);
          return;
        }
        
        // Create a minimal profile if not found
        const minimalProfile: UserProfile = {
          id: email,
          email: email,
          displayName: email.split("@")[0],
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          location: "",
          bio: "",
          website: "",
          github: "",
          twitter: "",
          role: "User",
          theme: "system",
          emailNotifications: true,
          pushNotifications: false,
        };

        // Create the profile in database
        const userProfile = await createUserProfile(email, minimalProfile);
        
        if (userProfile) {
          console.log("Created new profile");
          setUser(userProfile);
          authTokenService.storeUserProfile(userProfile);
        } else {
          setUser(minimalProfile);
          authTokenService.storeUserProfile(minimalProfile);
        }
        
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Error loading user profile:", err);
        setError("Failed to load user profile");
        
        // Even on error, try to use cached profile data if available
        const storedProfile = authTokenService.getUserProfile();
        if (storedProfile?.email === email) {
          console.log("Using cached profile data on error");
          setUser(storedProfile);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (mounted.current) {
        if (session && ["SIGNED_IN", "TOKEN_REFRESHED", "USER_UPDATED"].includes(event)) {
          console.log("Processing", event, "event");
          
          if (session.user?.email) {
            await loadUserProfile(session.user.email);
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
    };
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
};
