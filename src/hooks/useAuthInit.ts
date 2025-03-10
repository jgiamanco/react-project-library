
import { useState, useEffect } from "react";
import { getUser, storeUser } from "@/services/db-service";
import { User } from "@/contexts/auth-types";
import { supabase } from "@/services/db-service";

export const useAuthInit = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if there's an active Supabase session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData.user) {
            // Get the user's profile from our custom table
            const userProfile = await getUser(userData.user.email || '');
            
            if (userProfile) {
              setUser(userProfile);
              setIsAuthenticated(true);
            } else {
              // If no profile exists yet, create one with basic info
              const newUser: User = {
                email: userData.user.email || '',
                displayName: userData.user.email?.split("@")[0] || 'User',
                photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.user.email}`,
              };
              
              await storeUser(newUser);
              setUser(newUser);
              setIsAuthenticated(true);
            }
          }
        } else {
          // No active session
          localStorage.removeItem("authenticated");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("authenticated");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
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
