
import { useState, useCallback } from "react";
import { useLogin } from "./useLogin";
import { useSignup } from "./useSignup";
import { useLogout } from "./useLogout";
import { useUpdateUser } from "./useUpdateUser";
import { User } from "@/contexts/auth-types";

export const useAuthOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Import individual hooks
  const { login: performLogin, isLoading: loginLoading } = useLogin();
  const { signup: performSignup, isLoading: signupLoading } = useSignup();
  const { logout: performLogout, isLoading: logoutLoading } = useLogout();
  const { updateUser: performUpdateUser, isLoading: updateLoading } = useUpdateUser();

  // Proxy the individual hook operations
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      return await performLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  }, [performLogin]);

  const signup = useCallback(async (email: string, password: string, profileData: Partial<User> = {}) => {
    setIsLoading(true);
    try {
      return await performSignup(email, password, profileData);
    } finally {
      setIsLoading(false);
    }
  }, [performSignup]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await performLogout();
    } finally {
      setIsLoading(false);
    }
  }, [performLogout]);

  const updateUser = useCallback(async (user: User, updates: Partial<User>) => {
    setIsLoading(true);
    try {
      return await performUpdateUser(user, updates);
    } finally {
      setIsLoading(false);
    }
  }, [performUpdateUser]);

  // Calculate overall loading state
  const combinedIsLoading = 
    isLoading || 
    loginLoading || 
    signupLoading || 
    logoutLoading || 
    updateLoading;

  return {
    login,
    signup,
    logout,
    updateUser,
    isLoading: combinedIsLoading
  };
};
