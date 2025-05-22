
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { toast } from "sonner";
import { supabase } from "@/services/supabase-client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AuthTokenService } from "@/services/auth-token-service";
import { Button } from "@/components/ui/button";

const SignIn = () => {
  const [authError, setAuthError] = useState<string | null>(null);
  const [tokenConflict, setTokenConflict] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const authTokenService = AuthTokenService.getInstance();
  
  // Handle token conflict recovery
  const handleClearTokens = async () => {
    try {
      toast.loading("Clearing auth data...");
      await authTokenService.clearAllAuthData();
      await supabase.auth.signOut();
      toast.dismiss();
      toast.success("Auth data cleared successfully");
      setTokenConflict(false);
      window.location.reload();
    } catch (error) {
      console.error("Error clearing tokens:", error);
      toast.error("Failed to clear auth data");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if there's a valid session
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          navigate("/dashboard");
          return;
        }
        
        // Check if there's a stored token that might be causing conflicts
        if (authTokenService.isAuthenticated()) {
          const storedSession = await authTokenService.getStoredSession();
          
          if (storedSession) {
            navigate("/dashboard");
            return;
          } else {
            // Token exists but is invalid - likely a conflict
            setTokenConflict(true);
          }
        }
        
        setIsCheckingAuth(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
    
    // Check URL for error parameters
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const errorDescription = params.get("error_description");
    
    if (error) {
      setAuthError(errorDescription || error);
      toast.error("Authentication Error", {
        description: errorDescription || error
      });
    }
  }, [navigate]);

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

        {tokenConflict && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md max-w-md mx-auto">
            <h3 className="font-medium text-amber-800">Authentication Issue Detected</h3>
            <p className="text-sm text-amber-700 mt-1 mb-3">
              There appears to be a token conflict that's preventing you from logging in. 
              Please clear your authentication data to continue.
            </p>
            <Button 
              variant="outline" 
              className="w-full bg-amber-100 hover:bg-amber-200 text-amber-900"
              onClick={handleClearTokens}
            >
              Clear Authentication Data
            </Button>
          </div>
        )}

        {authError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm max-w-md mx-auto">
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
