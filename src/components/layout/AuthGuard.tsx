
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
      // If auth state is already determined by context, use it
      if (!isLoading) {
        if (isAuthenticated && user) {
          setIsChecking(false);
          return;
        }
        
        // One last check with Supabase directly
        try {
          const { data } = await supabase.auth.getSession();
          
          if (data.session) {
            // Session found, wait a moment for auth context to update
            setTimeout(() => {
              setIsChecking(false);
            }, 500);
            return;
          }
          
          // No valid authentication, redirect to signin
          redirectToSignIn();
        } catch (error) {
          console.error("AuthGuard: Auth check error:", error);
          redirectToSignIn();
        }
      } else {
        // Still loading - wait a bit before taking action
        setTimeout(() => {
          if (isChecking) {
            // Check if we have a valid session
            supabase.auth.getSession().then(({ data }) => {
              if (data.session) {
                setIsChecking(false);
              } else {
                redirectToSignIn();
              }
            }).catch(() => {
              redirectToSignIn();
            });
          }
        }, 2000); // Give it 2 seconds to resolve
      }
    };
    
    const redirectToSignIn = () => {
      toast.error("Please sign in to access this page");
      authTokenService.clearAuthData();
      
      navigate("/signin", {
        replace: true,
        state: { from: location.pathname },
      });
    };
    
    checkAuth();
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
        <div className="flex flex-col space-y-4 mt-8">
          <button 
            onClick={() => window.location.reload()} 
            className="text-sm text-primary hover:underline"
          >
            Refresh
          </button>
          <button 
            onClick={() => {
              authTokenService.clearAuthData();
              navigate('/signin');
            }} 
            className="text-sm text-destructive hover:underline"
          >
            Sign in again
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthGuard;
