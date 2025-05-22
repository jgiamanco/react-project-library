
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-hooks";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { supabase } from "@/services/supabase-client";
import { AuthTokenService } from "@/services/auth-token-service";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, isLoading, user } = useAuth();
  const authTokenService = AuthTokenService.getInstance();

  useEffect(() => {
    const checkAuth = async () => {
      // If auth state is already determined, use it
      if (!isLoading) {
        if (isAuthenticated && user) {
          setIsChecking(false);
          return;
        }
        
        // Not authenticated through context, try session check
        try {
          // Check for current session in Supabase
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Session error:", error);
            redirectToSignIn();
            return;
          }
          
          if (data.session) {
            // We have a valid session, but context doesn't reflect it yet
            // This can happen during initial load or tab synchronization
            console.log("Valid session found, waiting for auth context to update");
            // The auth context will update from the onAuthStateChange listener
            setIsChecking(false);
            return;
          }
          
          // Last attempt: try stored tokens
          const storedSession = await authTokenService.getStoredSession();
          
          if (!storedSession) {
            // No valid authentication, redirect to signin
            redirectToSignIn();
            return;
          }
          
          // We have a valid stored session, auth context will update
          setIsChecking(false);
          
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
  }, [isAuthenticated, isLoading, navigate, location.pathname, user]);

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
