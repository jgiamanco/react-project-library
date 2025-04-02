import { useState, useEffect, useCallback, useRef } from "react";
import { User } from "@/contexts/auth-types";
import { supabase } from "@/services/supabase-client";
import { getUser } from "@/services/user-service";
import { measureExecutionTime } from "@/utils/performance-monitoring";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

interface UserMetadata {
  display_name?: string;
  photo_url?: string;
  location?: string;
}

// Helper function to add timeout to a promise
const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = 10000
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
    ),
  ]);
};

export const useAuthInit = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authCheckStarted = useRef(false);
  const authStateUpdateTimeout = useRef<NodeJS.Timeout>();
  const retryCount = useRef(0);
  const maxRetries = 3;

  // Create a minimal fallback user profile from email
  const createBasicUserProfile = useCallback(
    (email: string, userData: UserMetadata = {}): User => {
      return {
        email,
        displayName: userData?.display_name || email.split("@")[0] || "User",
        photoURL:
          userData?.photo_url ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        location: userData?.location || "",
        bio: "",
        website: "",
        github: "",
        twitter: "",
        role: "User",
        theme: "system",
        emailNotifications: true,
        pushNotifications: false,
      };
    },
    []
  );

  const updateAuthState = useCallback(
    async (session: Session | null) => {
      if (session?.user) {
        try {
          const { data } = await withTimeout(supabase.auth.getUser());
          if (data?.user) {
            const email = data.user.email || "";
            const userMetadata = data.user.user_metadata as UserMetadata;

            try {
              // Try to get user profile with retries
              let userProfile = null;
              while (retryCount.current < maxRetries) {
                try {
                  userProfile = await withTimeout(getUser(email));
                  if (userProfile) break;
                } catch (err) {
                  console.warn(
                    `Attempt ${retryCount.current + 1} failed:`,
                    err
                  );
                  retryCount.current++;
                }
              }

              const finalUserProfile =
                userProfile || createBasicUserProfile(email, userMetadata);

              setUser(finalUserProfile);
              setIsAuthenticated(true);
              localStorage.setItem("authenticated", "true");
              localStorage.setItem("user", JSON.stringify(finalUserProfile));
              setError(null);
              retryCount.current = 0; // Reset retry count on success
            } catch (error) {
              console.error("Error updating auth state:", error);
              // On error, clear auth state to prevent inconsistent state
              localStorage.removeItem("authenticated");
              localStorage.removeItem("user");
              setUser(null);
              setIsAuthenticated(false);
              setError("Failed to load user profile");
            }
          }
        } catch (error) {
          console.error("Error getting user data:", error);
          setError("Failed to get user data");
        }
      } else {
        localStorage.removeItem("authenticated");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
      }
    },
    [createBasicUserProfile]
  );

  useEffect(() => {
    if (authCheckStarted.current) return;
    authCheckStarted.current = true;

    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.log("Auth check is taking too long, stopping loading state");
        setIsLoading(false);
        setError("Authentication check timed out");
      }
    }, 10000); // Increased timeout to 10 seconds

    const checkAuth = async () => {
      try {
        // Check Supabase session first
        const { data: sessionData } = await withTimeout(
          measureExecutionTime(
            () => supabase.auth.getSession(),
            "supabase.auth.getSession"
          )
        );

        if (sessionData?.session) {
          await updateAuthState(sessionData.session);
        } else {
          // If no active session, check localStorage as fallback
          const storedAuth = localStorage.getItem("authenticated");
          const storedUser = localStorage.getItem("user");

          if (storedAuth === "true" && storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser) as User;
              setUser(parsedUser);
              setIsAuthenticated(true);
              setError(null);
            } catch (e) {
              console.error("Invalid stored user data:", e);
              localStorage.removeItem("authenticated");
              localStorage.removeItem("user");
              setUser(null);
              setIsAuthenticated(false);
              setError("Invalid stored user data");
            }
          } else {
            setUser(null);
            setIsAuthenticated(false);
            setError(null);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // On error, clear auth state to prevent inconsistent state
        localStorage.removeItem("authenticated");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
        setError("Authentication check failed");
      } finally {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      }
    };

    // Set up auth state change listener with debouncing
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (authStateUpdateTimeout.current) {
          clearTimeout(authStateUpdateTimeout.current);
        }

        authStateUpdateTimeout.current = setTimeout(() => {
          if (event === "SIGNED_IN") {
            updateAuthState(session);
          } else if (event === "SIGNED_OUT") {
            localStorage.removeItem("authenticated");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
            setError(null);
          }
        }, 300); // Debounce auth state changes
      }
    );

    // Check auth state
    checkAuth();

    // Cleanup
    return () => {
      clearTimeout(loadingTimeout);
      if (authStateUpdateTimeout.current) {
        clearTimeout(authStateUpdateTimeout.current);
      }
      authListener.subscription.unsubscribe();
    };
  }, [updateAuthState]);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,
    error,
  };
};
