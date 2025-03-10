
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/services/db-service";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const logout = async () => {
    try {
      setIsLoading(true);
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clean up local storage
      localStorage.removeItem("user");
      localStorage.removeItem("authenticated");
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading
  };
};
