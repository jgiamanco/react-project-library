
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

interface AuthFormProps {
  mode: "signin" | "signup";
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (mode === "signin") {
        // In a real app, you would validate the credentials here
        if (email === "demo@example.com" && password === "password") {
          localStorage.setItem("authenticated", "true");
          toast.success("Welcome back!");
          navigate("/dashboard");
        } else {
          toast.error("Invalid credentials. Try with demo@example.com / password");
        }
      } else {
        // Simulate signup
        localStorage.setItem("authenticated", "true");
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-glass-lg">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {mode === "signin" ? "Welcome back" : "Create an account"}
        </h2>
        <p className="text-muted-foreground">
          {mode === "signin" 
            ? "Enter your credentials to access your account" 
            : "Enter your details to create your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === "signin" && (
                <a 
                  href="#" 
                  className="text-sm text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Demo mode: Use password 'password'");
                  }}
                >
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 font-medium"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {mode === "signin" ? "Signing in..." : "Creating account..."}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {mode === "signin" ? "Sign in" : "Create account"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        {mode === "signin" ? (
          <p>
            Don't have an account?{" "}
            <a 
              href="/signup" 
              className="text-primary font-medium hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
            >
              Sign up
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <a 
              href="/signin" 
              className="text-primary font-medium hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/signin");
              }}
            >
              Sign in
            </a>
          </p>
        )}
      </div>

      {mode === "signin" && (
        <div className="text-center text-xs text-muted-foreground">
          <p>Demo credentials: demo@example.com / password</p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
