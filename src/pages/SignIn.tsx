
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { toast } from "sonner";
import { supabase } from "@/services/supabase-client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AuthTokenService } from "@/services/auth-token-service";

const SignIn = () => {
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const authTokenService = AuthTokenService.getInstance();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if there's a valid stored token first
        if (authTokenService.isAuthenticated()) {
          console.log("Found authentication token, attempting to restore session...");
          const session = await authTokenService.getStoredSession();
          
          if (session) {
            console.log("Successfully restored session, redirecting to dashboard");
            navigate("/dashboard");
            return;
          }
        }
        
        // If no valid stored token, check for an active session with Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth session:", error);
          setIsCheckingAuth(false);
          return;
        }
        
        if (data.session) {
          console.log("User is already authenticated, redirecting...");
          navigate("/dashboard");
          return;
        }
        
        setIsCheckingAuth(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
    
    // Check URL for error parameters (often used for OAuth redirects)
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const errorDescription = params.get("error_description");
    
    if (error) {
      setAuthError(errorDescription || error);
      toast.error("Authentication Error", {
        description: errorDescription || error
      });
    }

    // Check if we have a from location in state
    const from = location.state?.from || "/dashboard";
    if (from) {
      console.log("User will be redirected to:", from);
    }
  }, [navigate, location]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full animate-fade-in">
        <div className="flex justify-center mb-6">
          <a
            href="/"
            className="flex items-center space-x-2 text-xl font-bold"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-medium text-sm">RT</span>
            </div>
            <span>React Project Library</span>
          </a>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {authError}
          </div>
        )}

        <div className="flex justify-center">
          <AuthForm mode="signin" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
