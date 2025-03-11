
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
    // Define a single, reusable function for redirecting on auth failure
    const redirectToSignIn = (message: string) => {
      localStorage.clear(); // Ensure local storage is cleared to prevent auth loops
      toast.error(message);
      navigate("/signin", { replace: true });
      setIsChecking(false);
    };

    const checkAuth = async () => {
      try {
        // Only proceed with check if not already loading auth state
        if (isLoading) return;
        
        // Get the current session from Supabase
        const { data } = await supabase.auth.getSession();
        
        // If no session and we're not in loading state, redirect
        if (!data.session && !isAuthenticated) {
          redirectToSignIn("Please sign in to access this page");
          return;
        }
        
        // Auth check passed
        setIsChecking(false);
      } catch (error) {
        console.error("Auth check error:", error);
        redirectToSignIn("Authentication error occurred");
      }
    };
    
    // Set a timeout to prevent infinite auth checks
    const timeoutId = setTimeout(() => {
      if (isChecking) {
        setIsChecking(false);
      }
    }, 3000);
    
    // Run the auth check
    checkAuth();
    
    // Clean up
    return () => clearTimeout(timeoutId);
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
