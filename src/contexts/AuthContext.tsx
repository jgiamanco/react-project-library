
import React, { createContext, useCallback, useState, useEffect } from "react";
import { useAuthInit } from "@/hooks/useAuthInit";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { AuthContextType, User } from "./auth-types";
import { UserProfile } from "@/services/types";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    user: initUser,
    isAuthenticated: initIsAuthenticated,
    isLoading: initLoading,
    error: initError,
  } = useAuthInit();

  const {
    login: performLogin,
    signUp: performSignup,
    logout: performLogout,
    updateUser: performUpdateUser,
    loading: operationsLoading,
  } = useAuthOperations();

  // Sync with useAuthInit state
  useEffect(() => {
    setUser(initUser);
    setIsAuthenticated(initIsAuthenticated);
    setLoading(initLoading);
  }, [initUser, initIsAuthenticated, initLoading]);

  // Wrap the auth operations to update our state
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await performLogin(email, password);
        console.log("Login completed successfully");
      } catch (error) {
        console.error("Login error in context:", error);
        throw error;
      }
    },
    [performLogin]
  );

  const signup = useCallback(
    async (email: string, password: string, profile: Partial<User>) => {
      try {
        await performSignup(email, password, profile as UserProfile);
        console.log("Signup completed successfully");
      } catch (error) {
        console.error("Signup error in context:", error);
        throw error;
      }
    },
    [performSignup]
  );

  const logout = useCallback(async () => {
    try {
      await performLogout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error in context:", error);
      throw error;
    }
  }, [performLogout]);

  const updateUser = useCallback(
    async (updates: Partial<User>) => {
      if (!user) return;

      try {
        // Merge current user data with updates to ensure all required fields
        const updatedProfile = { ...user, ...updates };
        await performUpdateUser(updatedProfile);
        setUser((prev) => (prev ? { ...prev, ...updates } : null));
      } catch (error) {
        console.error("Update user error in context:", error);
        throw error;
      }
    },
    [user, performUpdateUser]
  );

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
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
