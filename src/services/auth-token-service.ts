
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase-client";

// Token storage keys
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const EXPIRY_KEY = "token_expiry";
const AUTH_STATUS_KEY = "authenticated";

export class AuthTokenService {
  private static instance: AuthTokenService;
  private tokenRefreshTimeout: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): AuthTokenService {
    if (!AuthTokenService.instance) {
      AuthTokenService.instance = new AuthTokenService();
    }
    return AuthTokenService.instance;
  }

  async storeSession(session: Session): Promise<void> {
    if (!session?.access_token) {
      console.log("No valid session to store");
      return;
    }

    // Store tokens
    localStorage.setItem(TOKEN_KEY, session.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refresh_token || "");
    
    // Store token expiry
    const expiry = new Date(session.expires_at! * 1000).toISOString();
    localStorage.setItem(EXPIRY_KEY, expiry);

    // Set up token refresh
    this.scheduleTokenRefresh(session);
    
    // Store authentication status
    localStorage.setItem(AUTH_STATUS_KEY, "true");
    
    console.log("Session stored successfully, token refresh scheduled");
  }

  async clearSession(): Promise<void> {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    localStorage.removeItem(AUTH_STATUS_KEY);
    localStorage.removeItem("user_email");
    localStorage.removeItem("user");
    localStorage.removeItem("lastLoggedInEmail");

    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
      this.tokenRefreshTimeout = null;
    }
    
    console.log("Session cleared successfully");
  }

  async getStoredSession(): Promise<Session | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const expiry = localStorage.getItem(EXPIRY_KEY);

    if (!token || !expiry) {
      console.log("No stored session found");
      return null;
    }

    // Check if token is expired
    const expiryDate = new Date(expiry);
    if (expiryDate <= new Date()) {
      console.log("Stored token is expired, attempting refresh");
      
      if (refreshToken) {
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
      } else {
        console.log("No refresh token available");
        await this.clearSession();
        return null;
      }
    }

    try {
      // Try to restore the session
      const { data, error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: refreshToken || "",
      });

      if (error || !data.session) {
        console.error("Error restoring session:", error);
        await this.clearSession();
        return null;
      }

      // Re-store the session to update expiry
      await this.storeSession(data.session);
      return data.session;
    } catch (error) {
      console.error("Error setting session:", error);
      await this.clearSession();
      return null;
    }
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(AUTH_STATUS_KEY) === "true" && 
           localStorage.getItem(TOKEN_KEY) !== null;
  }

  private scheduleTokenRefresh(session: Session): void {
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
    }

    // Refresh token 5 minutes before expiry
    const expiryTime = session.expires_at! * 1000;
    const refreshTime = expiryTime - 5 * 60 * 1000;
    const now = Date.now();

    if (refreshTime > now) {
      const timeUntilRefresh = refreshTime - now;
      console.log(`Scheduling token refresh in ${Math.round(timeUntilRefresh / 1000)} seconds`);
      
      this.tokenRefreshTimeout = setTimeout(async () => {
        try {
          console.log("Refreshing auth token...");
          const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
          
          if (!refreshToken) {
            console.error("No refresh token available for refresh");
            return;
          }
          
          const { data, error } = await supabase.auth.refreshSession({
            refresh_token: refreshToken,
          });
          
          if (error || !data.session) {
            console.error("Failed to refresh session:", error);
            return;
          }
          
          await this.storeSession(data.session);
          console.log("Token refreshed successfully");
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }, timeUntilRefresh);
    } else {
      console.log("Token is already expired or close to expiry");
    }
  }
}
