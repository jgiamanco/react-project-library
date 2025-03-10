
import React, { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { storeUser, getUser } from "@/services/db-service";
import { AuthContextType, User } from "./auth-types";
import { authReducer, initialState } from "./auth-reducer";
import { supabase } from "@/services/db-service";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for stored user data on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        
        // Check if there's an active Supabase session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData.user) {
            // Get the user's profile from our custom table
            const userProfile = await getUser(userData.user.email || '');
            
            if (userProfile) {
              dispatch({ type: "SET_USER", payload: userProfile });
            } else {
              // If no profile exists yet, create one with basic info
              const newUser: User = {
                email: userData.user.email || '',
                displayName: userData.user.email?.split("@")[0] || 'User',
                photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.user.email}`,
              };
              
              await storeUser(newUser);
              dispatch({ type: "SET_USER", payload: newUser });
            }
          }
          dispatch({ type: "SET_LOADING", payload: false });
        } else {
          // No active session
          localStorage.removeItem("authenticated");
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("authenticated");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Get or create user profile
        let userProfile = await getUser(data.user.email || '');
        
        if (!userProfile) {
          // Create user profile if it doesn't exist
          const newUser: User = {
            email: data.user.email || '',
            displayName: data.user.email?.split("@")[0] || 'User',
            photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
          };
          
          userProfile = await storeUser(newUser);
        }
        
        // Store in localStorage for backwards compatibility
        localStorage.setItem("user", JSON.stringify(userProfile));
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("lastLoggedInEmail", data.user.email || '');

        // Update state
        dispatch({ type: "SET_USER", payload: userProfile });

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });

        navigate("/dashboard", { replace: true });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("authenticated");
      localStorage.removeItem("lastLoggedInEmail");
      dispatch({ type: "LOGOUT" });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in. Please try again.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // Create new user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/dashboard'
        }
      });

      if (error) throw error;

      if (data && data.user) {
        // Create user profile only if user was created successfully
        const newUser: User = {
          email: data.user.email || '',
          displayName: data.user.email?.split("@")[0] || 'User',
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
        };
        
        // Store the user in our custom table
        const userProfile = await storeUser(newUser);
        
        // Update local storage
        localStorage.setItem("user", JSON.stringify(userProfile));
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("lastLoggedInEmail", data.user.email || '');

        // Update state
        dispatch({ type: "SET_USER", payload: userProfile });

        // Check if email confirmation is required
        if (data.user.identities && data.user.identities.length === 0) {
          toast({
            title: "Verification email sent",
            description: "Please check your email to verify your account before signing in.",
          });
          
          // Stay on the same page for verification
          dispatch({ type: "SET_LOADING", payload: false });
          return;
        }

        toast({
          title: "Account created!",
          description: "Your account has been successfully created.",
        });

        navigate("/dashboard", { replace: true });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      dispatch({ type: "LOGOUT" });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clean up local storage
      localStorage.removeItem("user");
      localStorage.removeItem("authenticated");
      
      dispatch({ type: "LOGOUT" });
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!state.user) return;

    try {
      const updatedUser = { ...state.user, ...updates };
      
      // Update in our custom table
      await storeUser(updatedUser);
      
      // Update in localStorage for compatibility
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update state
      dispatch({ type: "SET_USER", payload: updatedUser });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Update user error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update your profile. Please try again.",
      });
    }
  };

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

