
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-hooks";
import { supabase } from "@/services/supabase-client";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("AuthGuard: Checking authentication", { 
          isAuthenticated, 
          isLoading,
          localStorageAuth: localStorage.getItem("authenticated")
        });
        
        // Get the current session from Supabase
        const { data } = await supabase.auth.getSession();
        
        // If no session and we're not in loading state, redirect
        if (!data.session && !isLoading && !isAuthenticated) {
          console.log("AuthGuard: No session found, redirecting to signin");
          localStorage.clear(); // Ensure local storage is cleared
          toast.error("Please sign in to access this page");
          navigate("/signin", { replace: true });
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.clear(); // Ensure local storage is cleared
        toast.error("Authentication error occurred");
        navigate("/signin", { replace: true });
      } finally {
        setIsChecking(false);
      }
    };
    
    // Only check auth if we're not currently loading
    if (!isLoading) {
      checkAuth();
    } else {
      // If still loading, wait a bit before checking
      const timer = setTimeout(() => {
        checkAuth();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  // Don't render anything until authentication check is complete
  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthGuard;
