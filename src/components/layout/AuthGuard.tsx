
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
      console.log("AuthGuard: Checking authentication status");
      
      // Check if auth is already determined through context
      if (!isLoading) {
        if (isAuthenticated && user) {
          console.log("AuthGuard: User is authenticated via context:", user.email);
          setIsChecking(false);
          return;
        }
        
        // Not authenticated through context, try additional checks
        try {
          // Check for current session in Supabase
          const { data } = await supabase.auth.getSession();
          
          if (data.session) {
            console.log("AuthGuard: Valid session found, waiting for auth context to update");
            
            // Try to refresh the auth state
            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user) {
              console.log("AuthGuard: Valid user found, refreshing auth context");
              
              // Check if we have a stored profile
              const storedProfile = authTokenService.getUserProfile();
              if (!storedProfile || storedProfile.email !== userData.user.email) {
                console.log("AuthGuard: Sending broadcast to update auth state");
                // This will trigger auth state update across tabs
                authTokenService.broadcastAuthEvent('login');
              }
            }
            
            // Give the context a reasonable amount of time to update
            timeoutId = window.setTimeout(() => {
              console.log("AuthGuard: Proceeding with valid session");
              setIsChecking(false);
            }, 1000);
            return;
          }
          
          // Check for stored profile as last resort
          const storedProfile = authTokenService.getUserProfile();
          if (storedProfile?.email) {
            console.log("AuthGuard: Found stored profile, but no valid session");
            // Try to verify if the profile is still valid
            try {
              // Make one last attempt to refresh the session
              const { data: refreshData } = await supabase.auth.refreshSession();
              if (refreshData.session) {
                console.log("AuthGuard: Session refreshed successfully");
                // Session refreshed, wait for auth context to update
                timeoutId = window.setTimeout(() => {
                  setIsChecking(false);
                }, 1000);
                return;
              }
            } catch (refreshError) {
              console.error("AuthGuard: Session refresh failed:", refreshError);
            }
            
            // No valid session, redirect to sign in
            redirectToSignIn();
            return;
          }
          
          // No valid authentication, redirect to signin
          redirectToSignIn();
        } catch (error) {
          console.error("AuthGuard: Auth check error:", error);
          redirectToSignIn();
        }
      } else {
        // Still loading - we'll wait for MAX_CHECK_TIME before taking action
        timeoutId = window.setTimeout(() => {
          if (isChecking) {
            console.log(`AuthGuard: Auth check timed out after ${MAX_CHECK_TIME} ms`);
            // Check if we have a valid session as a last resort
            supabase.auth.getSession().then(({ data }) => {
              if (data.session) {
                console.log("AuthGuard: Valid session found after timeout");
                setIsChecking(false);
              } else {
                // No valid session after timeout
                const storedProfile = authTokenService.getUserProfile();
                if (storedProfile) {
                  console.log("AuthGuard: Using stored profile despite timeout");
                  setIsChecking(false);
                } else {
                  redirectToSignIn();
                }
              }
            }).catch(error => {
              console.error("AuthGuard: Final session check failed:", error);
              redirectToSignIn();
            });
          }
        }, MAX_CHECK_TIME);
      }
    };
    
    const redirectToSignIn = () => {
      console.log("AuthGuard: Redirecting to sign in page");
      toast.error("Please sign in to access this page");
      
      // Clear any stale auth data to prevent future issues
      authTokenService.clearAuthData();
      
      navigate("/signin", {
        replace: true,
        state: { from: location.pathname },
      });
    };
    
    checkAuth();
    
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
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
        <div className="flex flex-col space-y-4 mt-8">
          <button 
            onClick={() => {
              authTokenService.broadcastAuthEvent('login');
              window.location.reload();
            }} 
            className="text-sm text-primary hover:underline"
          >
            Refresh authentication
          </button>
          <button 
            onClick={() => {
              authTokenService.clearAuthData();
              navigate('/signin');
            }} 
            className="text-sm text-destructive hover:underline"
          >
            Clear auth data & sign in again
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthGuard;
