import { useState } from "react";
import { useAuth } from "@/contexts/auth-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { supabase } from "@/services/supabase-client";

interface AuthFormProps {
  mode: "signin" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting || isLoading) return;
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 6 characters long",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "signin") {
        await login(email, password);
      } else {
        // Show a loading toast for signup to improve UX
        sonnerToast.loading("Creating your account...");
        await signup(email, password);
        sonnerToast.dismiss();
        // After signup, they need to verify email
        setNeedsVerification(true);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // Check if error is related to email confirmation
      if (error.message && error.message.includes("Email not confirmed")) {
        setNeedsVerification(true);
      } else {
        sonnerToast.error("Authentication failed", {
          description: error.message || "Please try again"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // If we're waiting for email verification
  if (needsVerification) {
    return (
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-glass-lg">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Check your email</h2>
          <p className="text-muted-foreground">
            We've sent a verification link to <strong>{email}</strong>
          </p>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-amber-800 text-sm">
            <p>Please check your inbox and click the verification link to complete your account setup.</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setNeedsVerification(false)}
          >
            Use a different email
          </Button>
          
          <Button
            variant="link"
            className="w-full"
            onClick={async () => {
              try {
                await supabase.auth.resend({
                  type: 'signup',
                  email,
                });
                sonnerToast.success("Verification email resent");
              } catch (error) {
                sonnerToast.error("Could not resend verification email");
              }
            }}
          >
            Resend verification email
          </Button>
        </div>
      </div>
    );
  }

  // Determine if the button should be in a loading state
  const buttonLoading = isSubmitting || isLoading;

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
              disabled={buttonLoading}
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
                    sonnerToast("Reset password functionality coming soon");
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
                disabled={buttonLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                disabled={buttonLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 font-medium"
          disabled={buttonLoading}
        >
          {buttonLoading ? (
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
            >
              Sign in
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
