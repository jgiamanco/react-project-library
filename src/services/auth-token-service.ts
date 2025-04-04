import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase-client";

// Encrypt/decrypt functions for token storage
const encryptToken = (token: string): string => {
  // In a production environment, use a proper encryption method
  // This is a simple example - replace with proper encryption
  return btoa(token);
};

const decryptToken = (encryptedToken: string): string => {
  // In a production environment, use proper decryption
  return atob(encryptedToken);
};

// Token storage keys
const TOKEN_KEY = "auth_token";
const EMAIL_KEY = "user_email";
const EXPIRY_KEY = "token_expiry";

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
    if (!session?.access_token) return;

    // Store encrypted token
    const encryptedToken = encryptToken(session.access_token);
    localStorage.setItem(TOKEN_KEY, encryptedToken);
    localStorage.setItem(EMAIL_KEY, session.user.email || "");

    // Store token expiry
    const expiry = new Date(session.expires_at! * 1000).toISOString();
    localStorage.setItem(EXPIRY_KEY, expiry);

    // Set up token refresh
    this.scheduleTokenRefresh(session);
  }

  async clearSession(): Promise<void> {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(EXPIRY_KEY);

    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
      this.tokenRefreshTimeout = null;
    }
  }

  async getStoredSession(): Promise<Session | null> {
    const encryptedToken = localStorage.getItem(TOKEN_KEY);
    const email = localStorage.getItem(EMAIL_KEY);
    const expiry = localStorage.getItem(EXPIRY_KEY);

    if (!encryptedToken || !email || !expiry) return null;

    // Check if token is expired
    const expiryDate = new Date(expiry);
    if (expiryDate < new Date()) {
      await this.clearSession();
      return null;
    }

    try {
      const token = decryptToken(encryptedToken);
      const {
        data: { session },
        error,
      } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: "",
      });

      if (error) {
        console.error("Error restoring session:", error);
        await this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error("Error decrypting token:", error);
      await this.clearSession();
      return null;
    }
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
      this.tokenRefreshTimeout = setTimeout(async () => {
        try {
          const {
            data: { session: newSession },
            error,
          } = await supabase.auth.refreshSession();
          if (error) throw error;
          if (newSession) {
            await this.storeSession(newSession);
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          await this.clearSession();
        }
      }, refreshTime - now);
    }
  }
}
