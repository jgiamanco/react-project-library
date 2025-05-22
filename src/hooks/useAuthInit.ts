import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase-client";
import { AuthTokenService } from "@/services/auth-token-service";
import { UserProfile } from "@/services/types";

export const useAuthInit = () => {
  const [isLoading, setIsLoading] = useState(true);
  const authTokenService = AuthTokenService.getInstance();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get the current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          // Get user profile from token service
          const profile = authTokenService.getUserProfile();

          if (!profile) {
            // If no profile in token service, try to get it from the database
            const { data: userData, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (error) {
              console.error("Error fetching user profile:", error);
              return;
            }

            if (userData) {
              // Store the profile in token service
              authTokenService.setUserProfile(userData as UserProfile);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Get user profile from database
        const { data: userData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
          return;
        }

        if (userData) {
          // Store the profile in token service
          authTokenService.setUserProfile(userData as UserProfile);
        }
      } else if (event === "SIGNED_OUT") {
        // Clear auth data
        authTokenService.clearAuthData();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [authTokenService]);

  return { isLoading };
};
