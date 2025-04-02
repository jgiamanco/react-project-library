import { useState, useEffect, useCallback } from "react";
import { User } from "@/contexts/auth-types";
import { supabase } from "@/services/supabase-client";
import { getUser } from "@/services/user-service";
import { Session } from "@supabase/supabase-js";

export const useAuthInit = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateAuthState = useCallback(async (session: Session | null) => {
    try {
      if (!session?.user) {
        console.log("No active session found");
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("authenticated");
        localStorage.removeItem("user");
        return;
      }

      console.log("Active session found, updating auth state...");

      // First try to get user from localStorage for faster initial load
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          if (parsedUser.email === session.user.email) {
            console.log("Using stored user data");
            setUser(parsedUser);
            setIsAuthenticated(true);
            return;
          }
        } catch (e) {
          console.error("Invalid stored user data:", e);
          localStorage.removeItem("user");
        }
      }

      // If no valid stored user, try to get from database
      console.log("Fetching user data from database...");
      const userData = await getUser(session.user.email || "");

      if (userData) {
        console.log("User data found in database");
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("authenticated", "true");
      } else {
        console.log("No user data found in database");
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        localStorage.removeItem("authenticated");
      }
    } catch (err) {
      console.error("Error updating auth state:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update auth state"
      );
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("authenticated");
    }
  }, []);

  useEffect(() => {
    console.log("Initializing auth state...");

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      await updateAuthState(session);
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check completed");
      updateAuthState(session).finally(() => {
        setIsLoading(false);
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [updateAuthState]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
};
