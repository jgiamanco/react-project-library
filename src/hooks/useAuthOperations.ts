import { useState, useCallback } from "react";
import { useLogin } from "./useLogin";
import { useSignup } from "./useSignup";
import { useLogout } from "./useLogout";
import { useUpdateUser } from "./useUpdateUser";
import { User } from "@/contexts/auth-types";
import { toast } from "sonner";
import { AuthError } from "@supabase/supabase-js";

interface AuthErrorResponse {
  message: string;
  status?: number;
}

export const useAuthOperations = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Import individual hooks
  const { login: performLogin, isLoading: loginLoading } = useLogin();
  const { signup: performSignup, isLoading: signupLoading } = useSignup();
  const { logout: performLogout, isLoading: logoutLoading } = useLogout();
  const { updateUser: performUpdateUser, isLoading: updateLoading } =
    useUpdateUser();

  // Helper function to handle auth errors
  const handleAuthError = (error: unknown): AuthErrorResponse => {
    if (error instanceof Error) {
      return {
        message: error.message,
        status: (error as AuthError)?.status,
      };
    }
    return {
      message: "An unexpected error occurred",
      status: 500,
    };
  };

  // Proxy the individual hook operations
  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        return await performLogin(email, password);
      } catch (error) {
        const { message } = handleAuthError(error);
        toast.error("Login failed", {
          description: message || "Please check your credentials and try again",
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [performLogin]
  );

  const signup = useCallback(
    async (
      email: string,
      password: string,
      profileData: Partial<User> = {}
    ) => {
      setIsLoading(true);
      try {
        return await performSignup(email, password, profileData);
      } catch (error) {
        const { message } = handleAuthError(error);
        toast.error("Signup failed", {
          description: message || "Please try again or contact support",
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [performSignup]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await performLogout();
    } catch (error) {
      const { message } = handleAuthError(error);
      toast.error("Logout failed", {
        description: message || "Your session may have already expired",
      });
      // Still clear local storage even if server logout fails
      localStorage.removeItem("authenticated");
      localStorage.removeItem("user");
      localStorage.removeItem("lastLoggedInEmail");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [performLogout]);

  const updateUser = useCallback(
    async (user: User, updates: Partial<User>) => {
      setIsLoading(true);
      try {
        return await performUpdateUser(user, updates);
      } catch (error) {
        const { message } = handleAuthError(error);
        toast.error("Profile update failed", {
          description: message || "Please try again",
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [performUpdateUser]
  );

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
    isLoading: combinedIsLoading,
  };
};
