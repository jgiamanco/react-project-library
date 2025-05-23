import { useState, useCallback } from "react";
import { useLogin } from "./useLogin";
import { useSignUp } from "./useSignup";
import { useLogout } from "./useLogout";
import { useUpdateUser } from "./useUpdateUser";
import { UserProfile } from "@/services/types";
import { toast } from "sonner";
import { AuthError } from "@supabase/supabase-js";

interface AuthErrorResponse {
  message: string;
  status?: number;
}

export const useAuthOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, isLoading: loginLoading } = useLogin();
  const { signUp, loading: signUpLoading } = useSignUp();
  const { logout } = useLogout();
  const { updateUser, isLoading: updateLoading } = useUpdateUser();

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

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        await login(email, password);
      } catch (err) {
        const { message } = handleAuthError(err);
        toast.error("Login failed", {
          description: message || "Please check your credentials and try again",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  const handleSignUp = useCallback(
    async (email: string, password: string, profile: UserProfile) => {
      try {
        setLoading(true);
        setError(null);
        await signUp(email, password, profile);
      } catch (err) {
        const { message } = handleAuthError(err);
        toast.error("Signup failed", {
          description: message || "Please try again or contact support",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [signUp]
  );

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await logout();
    } catch (err) {
      const { message } = handleAuthError(err);
      toast.error("Logout failed", {
        description: message || "Your session may have already expired",
      });
      // Still clear local storage even if server logout fails
      localStorage.removeItem("authenticated");
      localStorage.removeItem("user");
      localStorage.removeItem("lastLoggedInEmail");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const handleUpdateUser = useCallback(
    async (profile: UserProfile) => {
      try {
        setLoading(true);
        setError(null);
        await updateUser(profile, profile);
      } catch (err) {
        const { message } = handleAuthError(err);
        toast.error("Profile update failed", {
          description: message || "Please try again",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateUser]
  );

  return {
    loading: loading || loginLoading || signUpLoading || updateLoading,
    error,
    login: handleLogin,
    signUp: handleSignUp,
    logout: handleLogout,
    updateUser: handleUpdateUser,
  };
};
