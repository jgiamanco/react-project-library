
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { toast } from "sonner";
import { supabase } from "@/services/supabase-client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AuthTokenService } from "@/services/auth-token-service";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-hooks";

const SignIn = () => {
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const authTokenService = AuthTokenService.getInstance();
  const { isAuthenticated } = useAuth();

  // Handle auth data clearing
  const handleClearAuthData = () => {
    try {
      toast.loading("Clearing auth data...");
      authTokenService.clearAuthData();
      supabase.auth.signOut().catch(console.error);
      toast.dismiss();
      toast.success("Auth data cleared successfully");
      // Reload the page to reset all React states
      window.location.reload();
    } catch (error) {
      console.error("Error clearing auth data:", error);
      toast.error("Failed to clear auth data");
    }
  };

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }

    // Check if there's a valid session
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("Active session found, redirecting to dashboard");
          navigate("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkSession();

    // Check URL for error parameters
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      setAuthError(errorDescription || error);
      toast.error("Authentication Error", {
        description: errorDescription || error,
      });
    }
  }, [navigate, isAuthenticated]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">
            Checking authentication status...
          </p>
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

        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md max-w-md mx-auto">
          <h3 className="font-medium text-amber-800">
            Having trouble signing in?
          </h3>
          <p className="text-sm text-amber-700 mt-1 mb-3">
            If you're experiencing issues signing in, try clearing your
            authentication data. This fixes most issues with multiple tabs or
            sessions.
          </p>
          <Button
            variant="outline"
            className="w-full bg-amber-100 hover:bg-amber-200 text-amber-900"
            onClick={handleClearAuthData}
          >
            Clear Authentication Data
          </Button>
        </div>

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
