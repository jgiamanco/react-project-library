
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabase-client";
import { toast } from "sonner";
import { AuthTokenService } from "@/services/auth-token-service";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const authTokenService = AuthTokenService.getInstance();

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      const toastId = toast.loading("Signing out...");

      // Clear all auth data from storage
      await authTokenService.clearAllAuthData();

      // Sign out from Supabase
      await supabase.auth.signOut();

      toast.dismiss(toastId);
      toast.success("Signed out");

      // Navigate to home
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error signing out");
      
      // Still navigate away even if there's an error
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
