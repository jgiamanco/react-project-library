
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-hooks";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Short delay to ensure proper check and context is fully loaded
    const timer = setTimeout(() => {
      if (!isLoading && !isAuthenticated) {
        toast.error("Please sign in to access this page");
        navigate("/signin", { replace: true });
      }
      setIsChecking(false);
    }, 200);
    
    return () => clearTimeout(timer);
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
