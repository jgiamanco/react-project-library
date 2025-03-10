
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Try using a separate approach to check authentication to avoid circular dependencies
  const storedAuth = localStorage.getItem("authenticated") === "true";
  const storedUser = localStorage.getItem("user");

  useEffect(() => {
    // Redirect if we have stored authentication data
    if (storedAuth && storedUser) {
      navigate("/dashboard");
    }
    
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
  }, [storedAuth, storedUser, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gray-50">
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
          <AuthForm mode="signup" />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
