
import { useState, useEffect, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase-client";
import { UserProfile } from "@/services/types";
import { getUser } from "@/services/user-service";
import { toast } from "sonner";

export const useAuthInit = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const mounted = useRef(true);
  const sessionTimeout = useRef<NodeJS.Timeout>();
  const initialCheckDone = useRef(false);

  useEffect(() => {
    console.log("useAuthInit: Initializing auth...");
    
    const updateAuthState = async (session: Session | null) => {
      try {
        if (session?.user) {
          console.log("Active session found:", session.user.email);

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
              setIsAuthenticated(false);
              return;
            }

            if (newSession) {
              await updateAuthState(newSession);
            }
          }, 1000 * 60 * 10); // Refresh every 10 minutes

          try {
            const userProfile = await getUser(session.user.email || "");

            if (userProfile) {
              console.log("User profile found in database:", userProfile.email);
              setUser(userProfile);
              setIsAuthenticated(true);
              // Update localStorage for backward compatibility
              localStorage.setItem("authenticated", "true");
              localStorage.setItem("user", JSON.stringify(userProfile));
            } else {
              console.log("No user profile found in database");
              
              // Create a basic profile from session data
              const basicProfile: UserProfile = {
                email: session.user.email || "",
                displayName: session.user.user_metadata?.display_name || session.user.email?.split("@")[0] || "User",
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
              
              setUser(basicProfile);
              setIsAuthenticated(true);
              localStorage.setItem("authenticated", "true");
              localStorage.setItem("user", JSON.stringify(basicProfile));
            }
          } catch (profileError) {
            console.error("Error getting user profile:", profileError);
            
            // Use session data as fallback
            const fallbackProfile: UserProfile = {
              email: session.user.email || "",
              displayName: session.user.user_metadata?.display_name || session.user.email?.split("@")[0] || "User",
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
            
            setUser(fallbackProfile);
            setIsAuthenticated(true);
            localStorage.setItem("authenticated", "true");
            localStorage.setItem("user", JSON.stringify(fallbackProfile));
            
            toast.error("Error loading profile", {
              description: "Using basic profile information"
            });
          }
        } else {
          console.log("No active session found");
          setUser(null);
          setIsAuthenticated(false);
          // Clear localStorage
          localStorage.removeItem("authenticated");
          localStorage.removeItem("user");
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

    // Initial session check
    const initializeAuth = async () => {
      try {
        console.log("Starting initial session check...");
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
        setIsAuthenticated(false);
      } finally {
        if (mounted.current) {
          setLoading(false);
          initialCheckDone.current = true;
        }
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_IN') {
        toast.success("Signed in successfully");
      } else if (event === 'SIGNED_OUT') {
        toast.info("Signed out");
      }
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

  return { user, setUser, loading, error, isAuthenticated, setIsAuthenticated };
};
