
import React, { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface User {
  email: string;
  displayName: string;
  photoURL?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOGOUT" };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case "LOGOUT":
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
};

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
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          dispatch({ type: "SET_USER", payload: user });
          // Also set the authenticated flag for compatibility
          localStorage.setItem("authenticated", "true");
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("authenticated");
          dispatch({ type: "LOGOUT" });
        }
      } else {
        localStorage.removeItem("authenticated");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user: User = {
        email,
        displayName: email.split("@")[0],
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };

      // Store user data first
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authenticated", "true");

      // Update state
      dispatch({ type: "SET_USER", payload: user });

      // Wait for state to update
      await new Promise((resolve) => requestAnimationFrame(resolve));

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      // Navigate after state update
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("authenticated");
      dispatch({ type: "LOGOUT" });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign in. Please try again.",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authenticated");
    dispatch({ type: "LOGOUT" });
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/");
  };

  const updateUser = (updates: Partial<User>) => {
    if (!state.user) return;

    const updatedUser = { ...state.user, ...updates };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    dispatch({ type: "SET_USER", payload: updatedUser });
  };

  const value = {
    ...state,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
