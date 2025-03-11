
import React, { createContext, useCallback } from "react";
import { useAuthInit } from "@/hooks/useAuthInit";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { AuthContextType } from "./auth-types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated
  } = useAuthInit();
  
  const {
    login: performLogin,
    signup: performSignup,
    logout: performLogout,
    updateUser: performUpdateUser,
    isLoading: operationsLoading
  } = useAuthOperations();

  // Wrap the auth operations to update our state
  const login = useCallback(async (email: string, password: string) => {
    try {
      const userProfile = await performLogin(email, password);
      if (userProfile) {
        setUser(userProfile);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [performLogin, setUser, setIsAuthenticated]);

  const signup = useCallback(async (email: string, password: string) => {
    try {
      const userProfile = await performSignup(email, password);
      if (userProfile) {
        setUser(userProfile);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Error already handled in performSignup
    }
  }, [performSignup, setUser, setIsAuthenticated]);

  const logout = useCallback(async () => {
    await performLogout();
    setUser(null);
    setIsAuthenticated(false);
  }, [performLogout, setUser, setIsAuthenticated]);

  const updateUser = useCallback(async (updates: Partial<typeof user>) => {
    if (!user) return;
    
    const updatedUser = await performUpdateUser(user, updates);
    if (updatedUser) {
      setUser(updatedUser);
    }
    
    return updatedUser;
  }, [user, performUpdateUser, setUser]);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading: isLoading || operationsLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
