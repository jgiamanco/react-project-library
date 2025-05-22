
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase-client";

// Simplified token storage with clear naming
const AUTH_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const AUTH_STATUS_KEY = "authenticated";
const SESSION_EXPIRY_KEY = "session_expiry";
const USER_PROFILE_KEY = "user_profile";

export class AuthTokenService {
  private static instance: AuthTokenService;

  private constructor() {}

  static getInstance(): AuthTokenService {
    if (!AuthTokenService.instance) {
      AuthTokenService.instance = new AuthTokenService();
    }
    return AuthTokenService.instance;
  }

  // Store the session in localStorage with simpler approach
  async storeSession(session: Session): Promise<void> {
    if (!session?.access_token) {
      console.log("No valid session to store");
      return;
    }

    // Store essential session data
    localStorage.setItem(AUTH_TOKEN_KEY, session.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refresh_token || "");
    localStorage.setItem(AUTH_STATUS_KEY, "true");
    
    // Store expiry as ISO string for easier parsing
    const expiry = new Date(session.expires_at! * 1000).toISOString();
    localStorage.setItem(SESSION_EXPIRY_KEY, expiry);
    
    console.log("Session stored successfully");
  }

  // Clear only auth-related data
  async clearSession(): Promise<void> {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    localStorage.removeItem(AUTH_STATUS_KEY);
    console.log("Session cleared successfully");
  }

  // Clear all auth data including user profile
  async clearAllAuthData(): Promise<void> {
    await this.clearSession();
    localStorage.removeItem(USER_PROFILE_KEY);
    console.log("All auth data cleared");
  }

  // Check if session needs refresh and refresh if needed
  async getStoredSession(): Promise<Session | null> {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);

    if (!token || !refreshToken || !expiry) {
      console.log("No complete stored session found");
      return null;
    }

    // Check if token is expired
    const expiryDate = new Date(expiry);
    const now = new Date();
    
    // If token is expired or will expire in the next 5 minutes, refresh it
    if (expiryDate <= new Date(now.getTime() + 5 * 60 * 1000)) {
      console.log("Session expired or expiring soon, refreshing token");
      try {
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });
        
        if (error || !data.session) {
          console.error("Failed to refresh session:", error);
          await this.clearSession();
          return null;
        }
        
        await this.storeSession(data.session);
        return data.session;
      } catch (error) {
        console.error("Error refreshing token:", error);
        await this.clearSession();
        return null;
      }
    }

    // Token is still valid, try to set it in Supabase client
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: refreshToken,
      });

      if (error || !data.session) {
        console.error("Error restoring session:", error);
        await this.clearSession();
        return null;
      }

      return data.session;
    } catch (error) {
      console.error("Error setting session:", error);
      await this.clearSession();
      return null;
    }
  }

  // Simple check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
    
    if (!token || !expiry) return false;
    
    // Check if token has expired
    const expiryDate = new Date(expiry);
    return expiryDate > new Date();
  }

  // Store user profile data separately
  storeUserProfile(profile: any): void {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  }

  // Get stored user profile
  getUserProfile(): any | null {
    const profileData = localStorage.getItem(USER_PROFILE_KEY);
    return profileData ? JSON.parse(profileData) : null;
  }
}
