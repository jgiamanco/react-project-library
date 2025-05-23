
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-hooks";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AuthTokenService } from "@/services/auth-token-service";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const authTokenService = AuthTokenService.getInstance();

  useEffect(() => {
    let mounted = true;
    
    const verifyAuth = async () => {
      try {
        // Additional validation to ensure we have a valid session
        const isValid = await authTokenService.validateSession();
        
        if (mounted) {
          setIsVerifying(false);
          
          if (!isValid && !isAuthenticated && !isLoading) {
            toast.error("Please sign in to access this page");
            navigate("/signin", {
              replace: true,
              state: { from: location.pathname },
            });
          }
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        if (mounted) {
          setIsVerifying(false);
        }
      }
    };
    
    // Only verify if we're not already authenticated and not already loading
    if (!isAuthenticated && !isLoading) {
      verifyAuth();
    } else {
      setIsVerifying(false);
    }
    
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, isLoading, navigate, location, authTokenService]);

  if (isLoading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthGuard;
