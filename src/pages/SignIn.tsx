
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-hooks";
import AuthForm from "@/components/auth/AuthForm";

const SignIn = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
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

        <div className="flex justify-center">
          <AuthForm mode="signin" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
