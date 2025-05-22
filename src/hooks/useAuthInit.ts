import { useState, useEffect } from "react";
import { supabase } from "@/services/supabase-client";
import { AuthTokenService } from "@/services/auth-token-service";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/services/types";
import { getUserProfile } from "@/services/user-service";

export const useAuthInit = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, setUserProfile } = useAuth();
  const authTokenService = AuthTokenService.getInstance();

  useEffect(() => {
    let mounted = true;
    let authListener: {
      data: { subscription: { unsubscribe: () => void } };
    } | null = null;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Convert Supabase user to UserProfile
          const userProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email!,
            displayName:
              session.user.user_metadata?.display_name || session.user.email!,
            photoURL: session.user.user_metadata?.photo_url,
            location: session.user.user_metadata?.location,
            role: session.user.user_metadata?.role || "user",
            theme: session.user.user_metadata?.theme || "system",
            emailNotifications:
              session.user.user_metadata?.email_notifications ?? true,
            pushNotifications:
              session.user.user_metadata?.push_notifications ?? false,
          };

          // Set user in context
          setUser(userProfile);

          // Check if we have a stored profile
          let profile = authTokenService.getUserProfile();

          // If no stored profile, try to load it
          if (!profile) {
            try {
              profile = await getUserProfile(session.user.email!);
              if (profile) {
                authTokenService.setUserProfile(profile);
              }
            } catch (error) {
              console.error("Error loading user profile:", error);
            }
          }

          // Set profile in context if we have one
          if (profile) {
            setUserProfile(profile);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Initialize auth state
    initializeAuth();

    // Set up auth state change listener
    authListener = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          // Convert Supabase user to UserProfile
          const userProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email!,
            displayName:
              session.user.user_metadata?.display_name || session.user.email!,
            photoURL: session.user.user_metadata?.photo_url,
            location: session.user.user_metadata?.location,
            role: session.user.user_metadata?.role || "user",
            theme: session.user.user_metadata?.theme || "system",
            emailNotifications:
              session.user.user_metadata?.email_notifications ?? true,
            pushNotifications:
              session.user.user_metadata?.push_notifications ?? false,
          };

          setUser(userProfile);

          // Try to load profile if we don't have one
          let profile = authTokenService.getUserProfile();
          if (!profile) {
            try {
              profile = await getUserProfile(session.user.email!);
              if (profile) {
                authTokenService.setUserProfile(profile);
                setUserProfile(profile);
              }
            } catch (error) {
              console.error("Error loading user profile:", error);
            }
          } else {
            setUserProfile(profile);
          }
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setUserProfile(null);
        authTokenService.clearAuthData();
      }
    });

    // Set up storage event listener for cross-tab sync
    const handleStorageChange = async () => {
      const profile = authTokenService.getUserProfile();
      if (profile) {
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    };

    const unsubscribe =
      authTokenService.addAuthEventListener(handleStorageChange);

    return () => {
      mounted = false;
      if (authListener?.data?.subscription) {
        authListener.data.subscription.unsubscribe();
      }
      unsubscribe();
    };
  }, [setUser, setUserProfile, authTokenService]);

  return { isLoading };
};
