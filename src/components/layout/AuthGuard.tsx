
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
    const MAX_CHECK_TIME = 3000; // Maximum time to wait for auth check (3 seconds)
    let timeoutId: number;
    
    const checkAuth = async () => {
      // If auth state is already determined, use it
      if (!isLoading) {
        if (isAuthenticated && user) {
          console.log("User is authenticated:", user.email);
          setIsChecking(false);
          return;
        }
        
        // Not authenticated through context, try additional checks
        try {
          // Check for current session in Supabase
          const { data } = await supabase.auth.getSession();
          
          if (data.session) {
            // We have a valid session, context will update
            console.log("Valid session found, waiting for auth context to update");
            // Give the context a brief moment to update
            setTimeout(() => {
              setIsChecking(false);
            }, 500);
            return;
          }
          
          // Check for stored profile as last resort
          const storedProfile = authTokenService.getUserProfile();
          if (storedProfile?.email) {
            console.log("Found stored profile, but no valid session");
            // We have profile data but no session - redirect to sign in
            redirectToSignIn();
            return;
          }
          
          // No valid authentication, redirect to signin
          redirectToSignIn();
        } catch (error) {
          console.error("Auth check error:", error);
          redirectToSignIn();
        }
      } else {
        // Still loading - we'll wait for MAX_CHECK_TIME before taking action
        timeoutId = window.setTimeout(() => {
          if (isChecking) {
            console.log("Auth check timed out after", MAX_CHECK_TIME, "ms");
            // Check one last time before redirecting
            const storedProfile = authTokenService.getUserProfile();
            if (storedProfile) {
              console.log("Using stored profile despite timeout");
              setIsChecking(false);
            } else {
              redirectToSignIn();
            }
          }
        }, MAX_CHECK_TIME);
      }
    };
    
    const redirectToSignIn = () => {
      toast.error("Please sign in to access this page");
      navigate("/signin", {
        replace: true,
        state: { from: location.pathname },
      });
    };
    
    checkAuth();
    
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isAuthenticated, isLoading, navigate, location.pathname, user]);

  // If auth is confirmed, render children
  if (!isChecking && isAuthenticated && user) {
    return <>{children}</>;
  }

  // Show loading state while checking
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" color="primary" />
        <p className="text-muted-foreground">Verifying authentication...</p>
        <button 
          onClick={() => navigate('/signin')} 
          className="text-sm text-primary hover:underline mt-4"
        >
          Click here if you're stuck on this screen
        </button>
      </div>
    </div>
  );
};

export default AuthGuard;
