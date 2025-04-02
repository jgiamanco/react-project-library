import { useState, useEffect, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase, supabaseAdmin } from "@/services/supabase-client";
import { UserProfile } from "@/services/types";
import { getUser } from "@/services/user-service";

export const useAuthInit = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  const sessionTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const updateAuthState = async (session: Session | null) => {
      try {
        if (session?.user) {
          console.log("Active session found, updating auth state...");

          // Clear any existing timeout
          if (sessionTimeout.current) {
            clearTimeout(sessionTimeout.current);
          }

          // Set a new timeout to refresh the session
          sessionTimeout.current = setTimeout(async () => {
            const {
              data: { session: newSession },
              error: refreshError,
            } = await supabase.auth.refreshSession();

            if (refreshError) {
              console.error("Session refresh error:", refreshError);
              setUser(null);
              return;
            }

            if (newSession) {
              await updateAuthState(newSession);
            }
          }, 1000 * 60 * 10); // Refresh every 10 minutes

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
      if (sessionTimeout.current) {
        clearTimeout(sessionTimeout.current);
      }
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
};
