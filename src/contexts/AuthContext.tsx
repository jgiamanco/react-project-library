
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
      const result = await performLogin(email, password);
      console.log("Login completed with result:", result);
      // Return type void to match the AuthContextType
    } catch (error) {
      console.error("Login error in context:", error);
      // Re-throw to allow component to handle
      throw error;
    }
  }, [performLogin]);

  const signup = useCallback(async (email: string, password: string, profile: Partial<User>) => {
    try {
      // Fix: performSignup expects (email, password, profile)
      await performSignup(email, password, profile as UserProfile);
      console.log("Signup completed successfully");
    } catch (error) {
      console.error("Signup error in context:", error);
      // Re-throw to allow component to handle
      throw error;
    }
  }, [performSignup]);

  const logout = useCallback(async () => {
    try {
      await performLogout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error in context:", error);
      throw error;
    }
  }, [performLogout, setUser, setIsAuthenticated]);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = await performUpdateUser(user, updates);
      if (updatedUser) {
        setUser(updatedUser);
      }
      return updatedUser;
    } catch (error) {
      console.error("Update user error in context:", error);
      throw error;
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
