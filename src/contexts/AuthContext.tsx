
import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { User } from "./auth-types";
import { UserProfile } from "@/services/types";
import { AuthTokenService } from "@/services/auth-token-service";
import { AuthContext } from "./auth-context";
import { supabase } from "@/services/supabase-client";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const authTokenService = AuthTokenService.getInstance();

  // Get auth operations
  const {
    login: performLogin,
    signUp: performSignup,
    logout: performLogout,
    updateUser: performUpdateUser,
    loading: operationsLoading,
  } = useAuthOperations();

  // Initialize auth and check for existing sessions
  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        // Check if we have an existing profile
        const profile = authTokenService.getUserProfile();
        
        if (profile) {
          // Validate the session with Supabase
          const { data } = await supabase.auth.getSession();
          
          if (data.session) {
            // Valid session, set authenticated state
            if (mounted) {
              setUser(profile);
              setIsAuthenticated(true);
            }
          } else {
            // No valid session, clear local data
            authTokenService.clearAuthData();
            if (mounted) {
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        const profile = authTokenService.getUserProfile();
        
        if (profile) {
          setUser(profile);
          setIsAuthenticated(true);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        authTokenService.clearAuthData();
      }
    });
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Wrap auth operations to update our state consistently
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await performLogin(email, password);
      if (result) {
        setUser(result);
        setIsAuthenticated(true);
      }
      return result;
    } catch (error) {
      console.error("Login error in context:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [performLogin]);

  const signup = useCallback(async (
    email: string, 
    password: string, 
    profile: Partial<User>
  ) => {
    setLoading(true);
    try {
      await performSignup(email, password, profile as UserProfile);
    } catch (error) {
      console.error("Signup error in context:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [performSignup]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await performLogout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error in context:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [performLogout]);

  const updateUser = useCallback(async (
    updates: Partial<User>
  ): Promise<User | null> => {
    if (!user) return null;

    try {
      // Get current profile data
      const currentProfile = authTokenService.getUserProfile() || user;
      
      // Create updated profile
      const updatedProfile = { ...currentProfile, ...updates } as UserProfile;
      
      // Perform the update
      const result = await performUpdateUser(updatedProfile);
      
      // Handle the result
      if (result !== null && typeof result === "object") {
        // TypeScript narrowing to ensure result is an object
        setUser(result as UserProfile);
        return result as User;
      }
      
      // Use the locally updated profile if the remote update didn't return a value
      setUser(updatedProfile);
      return updatedProfile as User;
    } catch (error) {
      console.error("Update user error in context:", error);
      throw error;
    }
  }, [user, performUpdateUser, authTokenService]);

  const setUserProfile = useCallback((profile: UserProfile | null) => {
    setUser(profile);
    if (profile) {
      setIsAuthenticated(true);
      authTokenService.setUserProfile(profile);
    } else {
      setIsAuthenticated(false);
      authTokenService.clearAuthData();
    }
  }, [authTokenService]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading: loading || operationsLoading,
    login,
    signup,
    logout,
    updateUser,
    setUser,
    setUserProfile,
  }), [
    user, 
    isAuthenticated, 
    loading, 
    operationsLoading,
    login, 
    signup, 
    logout, 
    updateUser, 
    setUserProfile
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
