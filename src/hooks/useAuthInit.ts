
import { useState, useEffect } from "react";
import { getUser, storeUser, ensureUsersTable } from "@/services/db-service";
import { User } from "@/contexts/auth-types";
import { supabase } from "@/services/supabase-client";

export const useAuthInit = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // To prevent infinite loading, set a timeout - reduced from 5000ms to 2000ms
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
          
          if (userData.user) {
            console.log("Active session found for:", userData.user.email);
            
            try {
              // Ensure the users table exists in the database
              await ensureUsersTable();
              
              // Get the user's profile from our custom table
              let userProfile = await getUser(userData.user.email || '');
              
              if (!userProfile) {
                console.log("No profile found in database, creating one with stored data");
                
                // Try to get profile data from localStorage
                const storedUser = localStorage.getItem("user");
                let parsedUser: User | null = null;
                
                try {
                  if (storedUser) {
                    parsedUser = JSON.parse(storedUser) as User;
                    console.log("Found stored user data:", parsedUser);
                  }
                } catch (e) {
                  console.error("Error parsing stored user:", e);
                }
                
                // Create new user profile with basic info + any stored data
                const newUser: User = {
                  email: userData.user.email || '',
                  displayName: parsedUser?.displayName || userData.user.email?.split("@")[0] || 'User',
                  photoURL: parsedUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.user.email}`,
                  location: parsedUser?.location || '',
                  bio: parsedUser?.bio || '',
                  website: parsedUser?.website || '',
                  github: parsedUser?.github || '',
                  twitter: parsedUser?.twitter || '',
                  role: parsedUser?.role || 'User',
                  theme: parsedUser?.theme || 'system',
                  emailNotifications: parsedUser?.emailNotifications !== undefined ? parsedUser.emailNotifications : true,
                  pushNotifications: parsedUser?.pushNotifications !== undefined ? parsedUser.pushNotifications : false,
                };
                
                console.log("Creating new user profile:", newUser);
                userProfile = await storeUser(newUser);
                console.log("New profile created:", userProfile);
              } else {
                console.log("Found user profile in database:", userProfile);
              }
              
              // Update localStorage for backwards compatibility
              localStorage.setItem("user", JSON.stringify(userProfile));
              localStorage.setItem("authenticated", "true");
              localStorage.setItem("lastLoggedInEmail", userData.user.email || '');
              
              setUser(userProfile);
              setIsAuthenticated(true);
            } catch (error) {
              console.error("Error while processing user profile:", error);
              // Despite the error, we still have an authenticated user from Supabase
              // Let's create a basic profile from the auth data
              const basicUser: User = {
                email: userData.user.email || '',
                displayName: userData.user.email?.split("@")[0] || 'User',
                photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.user.email}`,
              };
              setUser(basicUser);
              setIsAuthenticated(true);
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
                // Check if we need to update from database
                const dbUser = await getUser(parsedUser.email);
                if (dbUser) {
                  console.log("Updated user data from database:", dbUser);
                  setUser(dbUser);
                  localStorage.setItem("user", JSON.stringify(dbUser));
                } else {
                  setUser(parsedUser);
                }
                setIsAuthenticated(true);
              } else {
                // Try to refresh the session
                console.log("No valid session, trying to refresh");
                const { error } = await supabase.auth.refreshSession();
                
                if (!error) {
                  console.log("Session refreshed successfully");
                  // Check if we need to update from database
                  const dbUser = await getUser(parsedUser.email);
                  if (dbUser) {
                    console.log("Updated user data from database:", dbUser);
                    setUser(dbUser);
                    localStorage.setItem("user", JSON.stringify(dbUser));
                  } else {
                    setUser(parsedUser);
                  }
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
