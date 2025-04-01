import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/services/supabase-client";
import { toast as sonnerToast } from "sonner";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      sonnerToast.loading("Signing out...");

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

      sonnerToast.dismiss();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });

      // Use replace to prevent back navigation to protected routes
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      sonnerToast.dismiss();
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
      });

      // Force navigation to home page even on error
      navigate("/", { replace: true });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  return {
    logout,
    isLoading,
  };
};
