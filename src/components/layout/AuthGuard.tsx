
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-hooks";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { supabase } from "@/services/supabase-client";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      // If auth state is already determined, use it
      if (!isLoading) {
        if (isAuthenticated) {
          setIsChecking(false);
          return;
        }
        
        // Not authenticated through context, try session check
        try {
          // Check for current session in Supabase
          const { data } = await supabase.auth.getSession();
          
          if (data.session) {
            // We have a valid session, context will update
            console.log("Valid session found, waiting for auth context to update");
            setIsChecking(false);
            return;
          }
          
          // No valid authentication, redirect to signin
          redirectToSignIn();
        } catch (error) {
          console.error("Auth check error:", error);
          redirectToSignIn();
        }
      }
    };
    
    const redirectToSignIn = () => {
      toast.error("Please sign in to access this page");
      navigate("/signin", {
        replace: true,
        state: { from: location.pathname },
      });
    };
    
    // Set a timeout to prevent infinite checking
    const timeout = setTimeout(() => {
      if (isChecking) {
        setIsChecking(false);
        if (!isAuthenticated) {
          toast.error("Authentication check timed out");
          navigate("/signin", {
            replace: true,
            state: { from: location.pathname },
          });
        }
      }
    }, 3000);
    
    checkAuth();
    
    return () => clearTimeout(timeout);
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  // If auth is confirmed, render children
  if (!isChecking && isAuthenticated) {
    return <>{children}</>;
  }

  // Show loading state while checking
  if (isChecking || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" color="primary" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // This should not be reached, but as a fallback
  return null;
};

export default AuthGuard;
