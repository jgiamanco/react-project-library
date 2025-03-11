
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
      
      // First clear all localStorage items to prevent auth loops
      localStorage.clear();
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out from Supabase:", error);
        throw error;
      }
      
      sonnerToast.dismiss();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      // Ensure we navigate to home page
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
    isLoading
  };
};
