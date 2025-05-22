import React, { useCallback, useState, useEffect } from "react";
import { useAuthInit } from "@/hooks/useAuthInit";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { User } from "./auth-types";
import { UserProfile } from "@/services/types";
import { AuthTokenService } from "@/services/auth-token-service";
import { AuthContext } from "./auth-context";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const authTokenService = AuthTokenService.getInstance();

  // Initialize auth state
  const { isLoading: initLoading } = useAuthInit();

  const {
    login: performLogin,
    signUp: performSignup,
    logout: performLogout,
    updateUser: performUpdateUser,
    loading: operationsLoading,
  } = useAuthOperations();

  // Update loading state based on initialization
  useEffect(() => {
    setLoading(initLoading);
  }, [initLoading]);

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
    async (updates: Partial<User>): Promise<User | null> => {
      if (!user) return null;

      try {
        // Ensure we have all existing profile data before update
        const currentProfile = authTokenService.getUserProfile() || user;

        // Merge current user data with updates to ensure all required fields
        const updatedProfile = { ...currentProfile, ...updates };

        // Perform the update operation
        const result = await performUpdateUser(updatedProfile);

        // Handle the result correctly based on its type
        if (
          result !== null &&
          result !== undefined &&
          typeof result === "object"
        ) {
          // Only set user if result is a valid object (not void)
          setUser(result as UserProfile);
          return result as User;
        }

        // If the update operation didn't return a valid profile, use the local updated profile
        setUser(updatedProfile);
        return updatedProfile;
      } catch (error) {
        console.error("Update user error in context:", error);
        throw error;
      }
    },
    [user, performUpdateUser, authTokenService]
  );

  const contextValue = {
    user,
    isAuthenticated: !!user,
    isLoading: loading || operationsLoading,
    login,
    signup,
    logout,
    updateUser,
    setUser,
    setUserProfile: (profile: UserProfile | null) => {
      setUser(profile);
      if (profile) {
        authTokenService.setUserProfile(profile);
      } else {
        authTokenService.clearAuthData();
      }
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
