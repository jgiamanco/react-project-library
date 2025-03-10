
import { useState, useEffect } from "react";
import { User } from "@/contexts/auth-types";
import { supabase } from "@/services/supabase-client";

export const useAuthInit = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Create a minimal fallback user profile from email
  const createBasicUserProfile = (email: string): User => {
    return {
      email,
      displayName: email.split("@")[0] || 'User',
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      location: '',
      bio: '',
      website: '',
      github: '',
      twitter: '',
      role: 'User',
      theme: 'system',
      emailNotifications: true,
      pushNotifications: false,
    };
  };

  useEffect(() => {
    // To prevent infinite loading, set a timeout
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.log("Auth check is taking too long, stopping loading state");
        setIsLoading(false);
      }
    }, 2000);

    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if there's an active Supabase session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData?.user) {
            console.log("Active session found for:", userData.user.email);
            
            // We'll use a basic profile first, which we can enrich later if possible
            const email = userData.user.email || '';
            const basicProfile = createBasicUserProfile(email);
            
            // Try to get a stored profile from localStorage
            try {
              const storedUser = localStorage.getItem("user");
              if (storedUser) {
                const parsedProfile = JSON.parse(storedUser) as User;
                // Use the stored profile with the basic profile as a fallback
                Object.keys(basicProfile).forEach((key) => {
                  if (!parsedProfile[key as keyof User]) {
                    parsedProfile[key as keyof User] = basicProfile[key as keyof User];
                  }
                });
                setUser(parsedProfile);
              } else {
                setUser(basicProfile);
              }
            } catch (e) {
              // If there's an error parsing, just use the basic profile
              setUser(basicProfile);
            }
            
            // Set authenticated state
            setIsAuthenticated(true);
            localStorage.setItem("authenticated", "true");
            localStorage.setItem("lastLoggedInEmail", email);
            
            // Always save the current user to localStorage
            if (user) {
              localStorage.setItem("user", JSON.stringify(user));
            }
          } else {
            // Clear auth state since there's no valid user
            localStorage.removeItem("authenticated");
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // No active session, check localStorage as fallback
          const storedAuth = localStorage.getItem("authenticated");
          const storedUser = localStorage.getItem("user");
          const lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail");
          
          console.log("No active session, checking localStorage:", { storedAuth, lastLoggedInEmail });
          
          if (storedAuth === "true" && storedUser && lastLoggedInEmail) {
            try {
              // Try to restore the session
              const parsedUser = JSON.parse(storedUser) as User;
              
              console.log("Found stored auth, trying to restore session");
              
              // Attempt to retrieve the session
              const { data: { session } } = await supabase.auth.getSession();
              
              if (session) {
                console.log("Valid session found, setting user");
                setUser(parsedUser);
                setIsAuthenticated(true);
              } else {
                // Try to refresh the session
                console.log("No valid session, trying to refresh");
                const { error } = await supabase.auth.refreshSession();
                
                if (!error) {
                  console.log("Session refreshed successfully");
                  setUser(parsedUser);
                  setIsAuthenticated(true);
                } else {
                  console.log("Session couldn't be refreshed:", error);
                  // Clear cached auth as session couldn't be refreshed
                  localStorage.removeItem("authenticated");
                  localStorage.removeItem("user");
                  localStorage.removeItem("lastLoggedInEmail");
                  setUser(null);
                  setIsAuthenticated(false);
                }
              }
            } catch (e) {
              console.error("Invalid stored user data:", e);
              // Invalid stored user data
              localStorage.removeItem("authenticated");
              localStorage.removeItem("user");
              localStorage.removeItem("lastLoggedInEmail");
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            console.log("No stored auth, clearing local storage");
            // No stored auth
            localStorage.removeItem("authenticated");
            localStorage.removeItem("user");
            localStorage.removeItem("lastLoggedInEmail");
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("authenticated");
        localStorage.removeItem("user");
        localStorage.removeItem("lastLoggedInEmail");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session ? "Session exists" : "No session");
      
      if (event === 'SIGNED_IN' && session) {
        await checkAuth();
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, clearing user data");
        localStorage.removeItem("authenticated");
        localStorage.removeItem("user");
        localStorage.removeItem("lastLoggedInEmail");
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    // Immediately check auth state
    checkAuth();

    // Cleanup listener and timeout on unmount
    return () => {
      clearTimeout(loadingTimeout);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated
  };
};
