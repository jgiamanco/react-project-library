
import { Session } from "@supabase/supabase-js";

// Simple singleton service for auth token management
export class AuthTokenService {
  private static instance: AuthTokenService;

  private constructor() {}

  static getInstance(): AuthTokenService {
    if (!AuthTokenService.instance) {
      AuthTokenService.instance = new AuthTokenService();
    }
    return AuthTokenService.instance;
  }
  
  // Store user profile in local storage
  storeUserProfile(profile: any): void {
    if (!profile) return;
    localStorage.setItem('user_profile', JSON.stringify(profile));
  }

  // Get stored user profile
  getUserProfile(): any | null {
    try {
      const profileData = localStorage.getItem('user_profile');
      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      console.error("Error retrieving user profile:", error);
      return null;
    }
  }

  // Clear all auth-related data
  clearAuthData(): void {
    localStorage.removeItem('user_profile');
    localStorage.removeItem('sb-yqbuvfezarqgsevfoqc-auth-token');
    console.log("Auth data cleared");
  }

  // Simple check if user has profile data
  hasUserProfile(): boolean {
    return localStorage.getItem('user_profile') !== null;
  }
}
