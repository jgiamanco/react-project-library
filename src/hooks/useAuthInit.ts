
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

  useEffect(() => {
    console.log("useAuthInit: Initializing auth...");
    
    const initializeAuth = async () => {
      try {
        // First check for an existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Found existing session for user:", session.user.email);
          await authTokenService.storeSession(session);
          await loadUserProfile(session.user.email);
        } else {
          // Try to restore session from stored token
          console.log("No active session, checking for stored session...");
          const storedSession = await authTokenService.getStoredSession();
          
          if (storedSession?.user?.email) {
            console.log("Restored session from stored token");
            await loadUserProfile(storedSession.user.email);
          } else {
            console.log("No existing session or valid stored token");
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
          setUser(existingProfile);
          setIsAuthenticated(true);
          
          // Store in local storage for quick access
          authTokenService.storeUserProfile(existingProfile);
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
        }
        
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Error loading user profile:", err);
        setError("Failed to load user profile");
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (mounted.current) {
        if (session && ["SIGNED_IN", "TOKEN_REFRESHED", "USER_UPDATED"].includes(event)) {
          console.log("Processing", event, "event");
          const expiresIn = session.expires_at 
            ? Math.floor(session.expires_at - Date.now() / 1000)
            : 3600;
          console.log(`Scheduling token refresh in ${expiresIn} seconds`);
          
          await authTokenService.storeSession(session);
          console.log("Session stored successfully, token refresh scheduled");
          
          console.log("Updating auth state for user:", session.user?.email);
          if (session.user?.email) {
            await loadUserProfile(session.user.email);
          }
        } 
        else if (event === "SIGNED_OUT" || !session) {
          console.log("User signed out or session expired");
          await authTokenService.clearAllAuthData();
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
