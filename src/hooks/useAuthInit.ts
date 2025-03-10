
import { useState, useEffect } from "react";
import { getUser, storeUser, ensureUsersTable } from "@/services/db-service";
import { User } from "@/contexts/auth-types";
import { supabase } from "@/services/supabase-client";

export const useAuthInit = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Ensure the users table exists in the database
        await ensureUsersTable();
        
        // Check if there's an active Supabase session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData.user) {
            // Get the user's profile from our custom table
            let userProfile = await getUser(userData.user.email || '');
            
            if (!userProfile) {
              // If no profile exists yet, create one with basic info
              const newUser: User = {
                email: userData.user.email || '',
                displayName: userData.user.email?.split("@")[0] || 'User',
                photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.user.email}`,
              };
              
              userProfile = await storeUser(newUser);
            }
            
            // Update localStorage for backwards compatibility
            localStorage.setItem("user", JSON.stringify(userProfile));
            localStorage.setItem("authenticated", "true");
            localStorage.setItem("lastLoggedInEmail", userData.user.email || '');
            
            setUser(userProfile);
            setIsAuthenticated(true);
          }
        } else {
          // No active session, check localStorage as fallback
          const storedAuth = localStorage.getItem("authenticated");
          const storedUser = localStorage.getItem("user");
          
          if (storedAuth === "true" && storedUser) {
            try {
              // Try to restore the session
              const parsedUser = JSON.parse(storedUser) as User;
              
              // Attempt to retrieve the session
              const { data: { session } } = await supabase.auth.getSession();
              
              if (session) {
                // Valid session found, set the user
                setUser(parsedUser);
                setIsAuthenticated(true);
              } else {
                // Try to refresh the session
                const { error } = await supabase.auth.refreshSession();
                
                if (!error) {
                  // Session refreshed successfully
                  setUser(parsedUser);
                  setIsAuthenticated(true);
                } else {
                  // Clear cached auth as session couldn't be refreshed
                  localStorage.removeItem("authenticated");
                  localStorage.removeItem("user");
                  setUser(null);
                  setIsAuthenticated(false);
                }
              }
            } catch (e) {
              // Invalid stored user data
              localStorage.removeItem("authenticated");
              localStorage.removeItem("user");
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            // No stored auth
            localStorage.removeItem("authenticated");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("authenticated");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session ? "Session exists" : "No session");
      
      if (event === 'SIGNED_IN' && session) {
        await checkAuth();
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem("authenticated");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    checkAuth();

    // Cleanup listener on unmount
    return () => {
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
