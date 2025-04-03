import { useState, useEffect, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase-client";
import { UserProfile } from "@/services/types";
import { getUser, updateUserProfile } from "@/services/user-service";
import { toast } from "sonner";

export const useAuthInit = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  const initialCheckDone = useRef(false);

  useEffect(() => {
    console.log("useAuthInit: Initializing auth...");
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      await updateAuthState(session);
    });

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted.current) {
        updateAuthState(session);
      }
    });

    // Cleanup
    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const updateAuthState = async (session: Session | null) => {
    try {
      if (session?.user) {
        console.log("Active session found for user:", session.user.email);

        // Only store essential auth data in localStorage
        localStorage.setItem("auth_token", session.access_token);
        localStorage.setItem("user_email", session.user.email || "");

        try {
          // Get user profile from database
          const userProfile = await getUser(session.user.email || "");

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
              await updateUserProfile(session.user.email || "", basicProfile);
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
        // Clear only auth-related localStorage items
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_email");
      }
    } catch (err) {
      console.error("Error updating auth state:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      if (mounted.current && !initialCheckDone.current) {
        setLoading(false);
        initialCheckDone.current = true;
      }
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
};
