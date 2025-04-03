import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabase-client";
import { toast } from "sonner";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      const toastId = toast.loading("Signing out...");

      // First sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error signing out from Supabase:", error);
        throw error;
      }

      // Clear all auth-related localStorage items
      localStorage.removeItem("authenticated");
      localStorage.removeItem("user");
      localStorage.removeItem("user_profile");
      localStorage.removeItem("lastLoggedInEmail");

      // Clear any other app-specific storage
      sessionStorage.clear();

      toast.dismiss(toastId);
      toast.success("Signed out", {
        description: "You have been successfully signed out.",
      });

      // Use replace to prevent back navigation to protected routes
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error signing out", {
        description: "There was a problem signing you out. Please try again.",
      });

      // Force navigation to home page even on error
      navigate("/", { replace: true });
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return {
    logout,
    isLoading,
  };
};
