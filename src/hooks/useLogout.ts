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

      // Clear storage first
      localStorage.clear();
      sessionStorage.clear();

      // Sign out from Supabase
      await supabase.auth.signOut();

      toast.dismiss(toastId);
      toast.success("Signed out");

      // Navigate to home
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error signing out");
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
