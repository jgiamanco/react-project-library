
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-hooks";
import { supabase } from "@/services/supabase-client";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, isLoading, user } = useAuth();
  const redirectTimeout = useRef<NodeJS.Timeout>();
  const authCheckTimeout = useRef<NodeJS.Timeout>();
  const checksCompleted = useRef(false);
  const isMounted = useRef(true);

  // Define a single, reusable function for redirecting on auth failure
  const redirectToSignIn = useCallback(
    (message: string) => {
      // Clear any existing timeouts
      if (redirectTimeout.current) {
        clearTimeout(redirectTimeout.current);
      }
      if (authCheckTimeout.current) {
        clearTimeout(authCheckTimeout.current);
      }

      // Clear local storage to prevent auth loops
      localStorage.removeItem("authenticated");
      localStorage.removeItem("user");
      localStorage.removeItem("lastLoggedInEmail");

      // Show error message
      toast.error(message);

      // Use a timeout to ensure state updates are processed
      redirectTimeout.current = setTimeout(() => {
        if (isMounted.current) {
          navigate("/signin", {
            replace: true,
            state: { from: location.pathname },
          });
          setIsChecking(false);
        }
      }, 100);
    },
    [navigate, location.pathname]
  );

  useEffect(() => {
    isMounted.current = true;

    const checkAuth = async () => {
      // If we already verified authentication and user is authenticated, no need to check again
      if (checksCompleted.current && isAuthenticated && user) {
        setIsChecking(false);
        return;
      }

      try {
        // Wait for auth state to be determined
        if (isLoading) {
          return;
        }

        // Get the current session from Supabase
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        // If no session and we're not in loading state, redirect
        if (!data.session && !isAuthenticated) {
          redirectToSignIn("Please sign in to access this page");
          return;
        }

        // Auth check passed
        checksCompleted.current = true;
        if (isMounted.current) {
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        redirectToSignIn("Authentication error occurred");
      }
    };

    // Run the auth check
    checkAuth();

    // Set a timeout to prevent infinite auth checks
    authCheckTimeout.current = setTimeout(() => {
      if (isChecking && isMounted.current) {
        setIsChecking(false);
        if (!isAuthenticated) {
          redirectToSignIn("Authentication check timed out");
        }
      }
    }, 5000); // Timeout to 5 seconds

    // Clean up
    return () => {
      isMounted.current = false;
      if (redirectTimeout.current) {
        clearTimeout(redirectTimeout.current);
      }
      if (authCheckTimeout.current) {
        clearTimeout(authCheckTimeout.current);
      }
    };
  }, [isAuthenticated, isLoading, redirectToSignIn, user, isChecking]);

  // If auth state is determined and user is authenticated, render children
  if (!isChecking && isAuthenticated) {
    return <>{children}</>;
  }

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // This should not be reached, but as a fallback
  return null;
};

export default AuthGuard;
