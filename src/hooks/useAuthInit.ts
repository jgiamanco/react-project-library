import { useState, useEffect } from "react";
import { supabase } from "@/services/supabase-client";
import { UserProfile } from "@/services/types";
import { fetchUserProfile } from "@/services/user-service";
import { AuthTokenService } from "@/services/auth-token-service";

export const useAuthInit = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authTokenService = AuthTokenService.getInstance();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        setLoading(true);

        // Check for a session from Supabase
        const { data } = await supabase.auth.getSession();

        if (data.session?.user?.email) {
          const profile = await fetchUserProfile(data.session.user.email);
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
            authTokenService.setUserProfile(profile);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          authTokenService.clearAuthData();
        }
      } catch (err) {
        console.error("Error during auth initialization:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setUser(null);
        setIsAuthenticated(false);
        authTokenService.clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    // Initial auth check
    checkAuthState();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user?.email) {
          const profile = await fetchUserProfile(session.user.email);
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
            authTokenService.setUserProfile(profile);
          }
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setIsAuthenticated(false);
        authTokenService.clearAuthData();
      }
    });

    return () => {
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
