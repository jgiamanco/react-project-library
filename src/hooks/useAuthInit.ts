import { useState, useEffect, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase-client";
import { UserProfile } from "@/services/types";
import {
  getUser,
  updateUserProfile,
  ensureUsersTable,
} from "@/services/user-service";
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
    let isInitializing = true;

    const initializeAuth = async () => {
      try {
        // Check for existing session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log(
          "Initial session check result:",
          session ? "Found session" : "No session"
        );

        if (session) {
          console.log("Found existing session for user:", session.user.email);
          setLoading(true);
          await updateAuthState(session);
          setLoading(false);
        } else {
          // Try to restore session from stored token
          const storedSession = await authTokenService.getStoredSession();
          if (storedSession) {
            console.log("Restored session from stored token");
            setLoading(true);
            await updateAuthState(storedSession);
            setLoading(false);
          } else {
            console.log("No existing session or valid stored token found");
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error checking session:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      } finally {
        isInitializing = false;
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      if (mounted.current) {
        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
          console.log("Processing SIGNED_IN/INITIAL_SESSION event");
          setLoading(true);
          try {
            if (session) {
              await authTokenService.storeSession(session);
            }
            await updateAuthState(session);
          } catch (err) {
            console.error("Error in auth state change handler:", err);
            setError(err instanceof Error ? err.message : "An error occurred");
          } finally {
            setLoading(false);
          }
        } else if (event === "SIGNED_OUT") {
          console.log("Processing SIGNED_OUT event");
          await authTokenService.clearSession();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    });

    // Listen for storage events to sync across tabs
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === "auth_token" && e.newValue && !isInitializing) {
        console.log("Auth token changed in another tab, refreshing session");
        setLoading(true);
        try {
          const storedSession = await authTokenService.getStoredSession();
          if (storedSession) {
            await updateAuthState(storedSession);
          }
        } catch (err) {
          console.error("Error handling storage change:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const updateAuthState = async (session: Session | null) => {
    try {
      if (session?.user) {
        console.log("Active session found for user:", session.user.email);

        try {
          // Get user profile from database
          console.log(
            "Attempting to get user profile for:",
            session.user.email
          );
          const { success: tableCheckSuccess } = await ensureUsersTable();

          if (!tableCheckSuccess) {
            console.log("Table check failed, creating basic profile");
            // Create a basic profile from session data
            const basicProfile: UserProfile = {
              email: session.user.email || "",
              displayName:
                session.user.user_metadata?.display_name ||
                session.user.email?.split("@")[0] ||
                "User",
              photoURL:
                session.user.user_metadata?.photo_url ||
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
            setUser(basicProfile);
            setIsAuthenticated(true);
            return;
          }

          const userProfile = await getUser(session.user.email || "");
          console.log(
            "User profile fetch result:",
            userProfile ? "Found profile" : "No profile"
          );

          if (userProfile) {
            console.log("User profile found in database:", userProfile.email);
            setUser(userProfile);
            setIsAuthenticated(true);
          } else {
            console.log("No user profile found in database, creating one");
            // Create a basic profile from session data
            const basicProfile: UserProfile = {
              email: session.user.email || "",
              displayName:
                session.user.user_metadata?.display_name ||
                session.user.email?.split("@")[0] ||
                "User",
              photoURL:
                session.user.user_metadata?.photo_url ||
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

            // Store the basic profile in the database
            try {
              console.log("Attempting to store basic profile");
              await updateUserProfile(session.user.email || "", basicProfile);
              console.log("Basic profile created and stored");
              setUser(basicProfile);
              setIsAuthenticated(true);
            } catch (dbError) {
              console.error("Error storing basic profile:", dbError);
              // Still set the basic profile even if database storage fails
              setUser(basicProfile);
              setIsAuthenticated(true);
            }
          }
        } catch (profileError) {
          console.error("Error getting user profile:", profileError);
          setError("Failed to load user profile");
          toast.error("Error loading profile", {
            description: "Failed to load user profile data",
          });
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

  // Debug logging for state changes
  useEffect(() => {
    console.log(
      "Auth state updated - isAuthenticated:",
      isAuthenticated,
      "isLoading:",
      isLoading,
      "user:",
      user?.email
    );
  }, [isAuthenticated, isLoading, user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
};
