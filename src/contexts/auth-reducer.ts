
import { AuthState, AuthAction } from './auth-types';

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
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
