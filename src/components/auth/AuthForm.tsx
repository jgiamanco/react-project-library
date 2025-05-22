import { useState } from "react";
import { useAuth } from "@/contexts/auth-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { supabase } from "@/services/supabase-client";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { User } from "@/contexts/auth-types";
import { updateUserProfile } from "@/services/user-service";

type AuthError = {
  message: string;
  status?: number;
};

interface AuthFormProps {
  mode: "signin" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const { toast } = useToast();

  const validateStep1 = () => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 6 characters long",
      });
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!fullName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your full name",
      });
      return false;
    }

    return true;
  };

  const handleSignupStepChange = (step: number) => {
    if (step > signupStep) {
      // Going forward
      if (signupStep === 1 && !validateStep1()) return;
      if (signupStep === 2 && !validateStep2()) return;
    }

    setSignupStep(step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting || isLoading) return;

    if (mode === "signin") {
      if (!email || !password) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all fields",
        });
        return;
      }

      setIsSubmitting(true);
      try {
        await login(email, password);
      } catch (error: unknown) {
        console.error("Auth error:", error);

        // Type check and handle error
        if (
          error &&
          typeof error === "object" &&
          "message" in error &&
          typeof error.message === "string"
        ) {
          if (error.message.includes("Email not confirmed")) {
            setNeedsVerification(true);
          } else {
            sonnerToast.error("Authentication failed", {
              description: error.message || "Please try again",
            });
          }
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // For signup, validate the current step
      if (signupStep === 1 && !validateStep1()) return;
      if (signupStep === 2 && !validateStep2()) return;

      // Only proceed with signup on the final step
      if (signupStep === 3) {
        setIsSubmitting(true);

        try {
          // Create user profile object with required fields
          const userProfile = {
            displayName: fullName,
            location: location || undefined,
            photoURL: avatarUrl,
            bio: "Tell us about yourself...",
            website: "",
            github: "",
            twitter: "",
            role: "Developer",
            theme: "system",
            emailNotifications: true,
            pushNotifications: false,
          };

          console.log("Signing up with profile:", userProfile);

          await signup(email, password, userProfile);

          // Now updateUserProfile accepts Partial<UserProfile>
          await updateUserProfile(email, userProfile);

          // Set needs verification flag to show the verification screen
          setNeedsVerification(true);
        } catch (error: unknown) {
          console.error("Auth error:", error);
          // The error toast is already handled in the signup hook
        } finally {
          setIsSubmitting(false);
        }
      } else {
        // Move to the next step
        handleSignupStepChange(signupStep + 1);
      }
    }
  };

  const handleAvatarChange = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl);
  };

  // If we're waiting for email verification
  if (needsVerification) {
    return (
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-glass-lg">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">
            Check your email
          </h2>
          <p className="text-muted-foreground">
            We've sent a verification link to <strong>{email}</strong>
          </p>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-amber-800 text-sm">
            <p>
              Please check your inbox and click the verification link to
              complete your account setup.
            </p>
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
                sonnerToast.loading("Resending verification email...");
                await supabase.auth.resend({
                  type: "signup",
                  email,
                });
                sonnerToast.dismiss();
                sonnerToast.success("Verification email resent");
              } catch (error) {
                sonnerToast.dismiss();
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

  const renderSignupStep = () => {
    switch (signupStep) {
      case 1:
        return (
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
                className="h-12 w-full"
                disabled={buttonLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-10 w-full"
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
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-12 w-full"
                disabled={buttonLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                type="text"
                placeholder="San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 w-full"
                disabled={buttonLoading}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Label className="block mb-2">Profile Picture</Label>
              <div className="flex justify-center">
                <AvatarUpload
                  currentAvatar={avatarUrl}
                  onAvatarChange={handleAvatarChange}
                  name={fullName || "User"}
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Click on the avatar to change it
              </p>
            </div>
          </div>
        );
      default:
        return null;
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
            : signupStep === 1
            ? "Step 1: Enter your account details"
            : signupStep === 2
            ? "Step 2: Tell us about yourself"
            : "Step 3: Pick a profile picture"}
        </p>
      </div>

      {mode === "signup" && (
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 w-8 rounded-full ${
                  signupStep >= step ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            Step {signupStep} of 3
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === "signin" ? (
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
                className="h-12 w-full"
                disabled={buttonLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
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
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-10 w-full"
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
        ) : (
          renderSignupStep()
        )}

        <div className="flex justify-between">
          {mode === "signup" && signupStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSignupStepChange(signupStep - 1)}
              disabled={buttonLoading}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}

          <Button
            type="submit"
            className={`h-12 font-medium ${
              mode === "signup" && signupStep > 1 ? "" : "w-full"
            }`}
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {mode === "signin" ? "Signing in..." : "Creating account..."}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                {mode === "signin"
                  ? "Sign in"
                  : signupStep < 3
                  ? "Continue"
                  : "Create account"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            )}
          </Button>
        </div>
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
