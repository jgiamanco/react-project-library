
import React, { createContext, useCallback, useState, useEffect } from "react";
import { useAuthInit } from "@/hooks/useAuthInit";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { AuthContextType, User } from "./auth-types";
import { UserProfile } from "@/services/types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    user,
    setUser,
    loading,
    isAuthenticated,
    setIsAuthenticated
  } = useAuthInit();
  
  const {
    login: performLogin,
    signUp: performSignup,
    logout: performLogout,
    updateUser: performUpdateUser,
    loading: operationsLoading
  } = useAuthOperations();

  // Wrap the auth operations to update our state
  const login = useCallback(async (email: string, password: string) => {
    try {
      await performLogin(email, password);
      return true;
    } catch (error) {
      console.error("Login error in context:", error);
      return false;
    }
  }, [performLogin]);

  const signup = useCallback(async (email: string, password: string, profile: UserProfile) => {
    try {
      await performSignup(email, password, profile);
      return true;
    } catch (error) {
      console.error("Signup error in context:", error);
      return false;
    }
  }, [performSignup]);

  const logout = useCallback(async () => {
    try {
      await performLogout();
      setUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error("Logout error in context:", error);
      return false;
    }
  }, [performLogout, setUser, setIsAuthenticated]);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return null;
    
    try {
      const updatedUser = await performUpdateUser(user, updates);
      if (updatedUser) {
        setUser(updatedUser);
      }
      return updatedUser;
    } catch (error) {
      console.error("Update user error in context:", error);
      return null;
    }
  }, [user, performUpdateUser, setUser]);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading: loading || operationsLoading,
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
