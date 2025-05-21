
import { useState, useEffect, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase-client";
import { UserProfile } from "@/services/types";
import { getUser, updateUserProfile } from "@/services/user-service";
import { AuthTokenService } from "@/services/auth-token-service";
import { toast } from "sonner";

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
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Found existing session for user:", session.user.email);
          await updateAuthState(session);
        } else {
          // Try to restore session from stored token
          console.log("No active session, checking for stored session...");
          const storedSession = await authTokenService.getStoredSession();
          
          if (storedSession) {
            console.log("Restored session from stored token for user:", storedSession.user?.email);
            await updateAuthState(storedSession);
          } else {
            console.log("No existing session or valid stored token found");
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
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (mounted.current) {
        if (session) {
          // For sign in and session update events
          if (["SIGNED_IN", "TOKEN_REFRESHED", "USER_UPDATED", "INITIAL_SESSION"].includes(event)) {
            console.log(`Processing ${event} event`);
            await authTokenService.storeSession(session);
            await updateAuthState(session);
          } 
          // For sign out event
          else if (event === "SIGNED_OUT") {
            console.log("Processing SIGNED_OUT event");
            await authTokenService.clearSession();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else if (event === "SIGNED_OUT") {
          console.log("Processing SIGNED_OUT event (no session)");
          await authTokenService.clearSession();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    });

    // Listen for storage events to sync across tabs
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === "auth_token") {
        console.log("Auth token changed in another tab, refreshing session");
        const storedSession = await authTokenService.getStoredSession();
        if (storedSession) {
          await updateAuthState(storedSession);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else if (e.key === "authenticated" && e.newValue === null) {
        // Handle logout in another tab
        console.log("User logged out in another tab");
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      mounted.current = false;
      subscription?.unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const updateAuthState = async (session: Session | null) => {
    try {
      if (session?.user) {
        console.log("Updating auth state for user:", session.user.email);
        
        if (!session.user.email) {
          console.error("Session user has no email");
          setUser(null);
          setIsAuthenticated(false);
          return;
        }

        try {
          // Get user profile from database
          console.log("Fetching user profile from database...");
          const userProfile = await getUser(session.user.email);
          
          if (userProfile) {
            console.log("User profile found in database");
            setUser(userProfile);
            setIsAuthenticated(true);
          } else {
            console.log("No user profile found in database, creating one");
            // Create basic profile from session data
            const basicProfile: UserProfile = {
              email: session.user.email,
              displayName: session.user.user_metadata?.display_name || 
                           session.user.email.split("@")[0] || 
                           "User",
              photoURL: session.user.user_metadata?.photo_url || 
                       `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
              location: session.user.user_metadata?.location || "",
              bio: "",
              website: "",
              github: "",
              twitter: "",
              role: "User",
              theme: "system",
              emailNotifications: true,
              pushNotifications: false,
            };

            try {
              // Store the profile and use it
              await updateUserProfile(session.user.email, basicProfile);
              console.log("Basic profile created and stored");
              setUser(basicProfile);
              setIsAuthenticated(true);
            } catch (storeError) {
              console.error("Error storing user profile:", storeError);
              // Still set user as authenticated with basic profile
              setUser(basicProfile);
              setIsAuthenticated(true);
            }
          }
        } catch (profileError) {
          console.error("Error getting user profile:", profileError);
          // Create a minimal profile from session to avoid login failures
          const minimalProfile: UserProfile = {
            email: session.user.email,
            displayName: session.user.user_metadata?.display_name || 
                        session.user.email.split("@")[0] || 
                        "User",
            photoURL: session.user.user_metadata?.photo_url || 
                     `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
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
          setUser(minimalProfile);
          setIsAuthenticated(true);
          toast.error("Error loading complete profile data");
        }
      } else {
        console.log("No active session found");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Error updating auth state:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
};
