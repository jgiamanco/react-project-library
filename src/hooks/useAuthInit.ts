import { useState, useEffect, useRef } from "react";
import { supabase, supabaseAdmin } from "@/services/supabase-client";
import { UserProfile } from "@/services/types";
import { getUser } from "@/services/user-service";

export const useAuthInit = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    const updateAuthState = async (session: any) => {
      try {
        if (session?.user) {
          console.log("Active session found, updating auth state...");
          const userProfile = await getUser(session.user.email);

          if (userProfile) {
            console.log("User data found in database");
            setUser(userProfile);
          } else {
            console.log("No user profile found in database");
            setUser(null);
          }
        } else {
          console.log("No active session found");
          setUser(null);
        }
      } catch (err) {
        console.error("Error updating auth state:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setUser(null);
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    // Initial session check
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state...");
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        await updateAuthState(session);
        console.log("Initial session check completed");
      } catch (err) {
        console.error("Error in initial session check:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setUser(null);
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      await updateAuthState(session);
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
};
