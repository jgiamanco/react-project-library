
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/services/supabase-client";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        throw error;
      }
      
      // Clean up local storage
      localStorage.removeItem("user");
      localStorage.removeItem("authenticated");
      localStorage.removeItem("lastLoggedInEmail");
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      // Ensure we navigate to home page
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading
  };
};
