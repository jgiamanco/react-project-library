import { UserProfile } from "@/services/types";

// User is now just an alias to UserProfile
export type User = UserProfile;

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    profile: Partial<User>
  ) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<User | void>;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
}

export type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOGOUT" };
