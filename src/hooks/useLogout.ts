
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/services/supabase-client";
import { toast as sonnerToast } from "sonner";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const logout = async () => {
    try {
      setIsLoading(true);
      sonnerToast.loading("Signing out...");
      
      console.log("Starting logout process");
      
      // First clear all localStorage items
      console.log("Clearing localStorage");
      localStorage.clear(); // Use clear() to remove ALL items, not just specific ones
      
      // Then sign out from Supabase
      console.log("Signing out from Supabase");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out from Supabase:", error);
        throw error;
      }
      
      console.log("Successfully signed out");
      
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
      
      // Even if there's an error with Supabase signout, clear localStorage anyway
      localStorage.clear();
      
      // Force navigation to home page
      navigate("/", { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading
  };
};
