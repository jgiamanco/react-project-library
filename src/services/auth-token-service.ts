
import { UserProfile } from "./types";
import { supabase } from "./supabase-client";

// Simplified service for auth token management
export class AuthTokenService {
  private static instance: AuthTokenService;
  private readonly PROFILE_KEY = "user_profile";
  private readonly SESSION_KEY = "auth_session";
  private authEventListeners: Set<() => void> = new Set();
  private lastValidationTime = 0;
  private validationThrottleMs = 5000; // Throttle validation to once every 5 seconds
  private validationPromise: Promise<boolean> | null = null;

  private constructor() {
    // Listen for auth events from other tabs
    window.addEventListener("storage", this.handleStorageEvent.bind(this));

    // Listen for Supabase auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        this.broadcastAuthEvent("auth_update");
      } else if (event === "SIGNED_OUT") {
        this.clearAuthData();
      }
    });
  }

  public static getInstance(): AuthTokenService {
    if (!AuthTokenService.instance) {
      AuthTokenService.instance = new AuthTokenService();
    }
    return AuthTokenService.instance;
  }

  private handleStorageEvent(event: StorageEvent) {
    if (event.key === this.PROFILE_KEY || event.key === this.SESSION_KEY) {
      this.notifyAuthEventListeners();
    }
  }

  public addAuthEventListener(listener: () => void): () => void {
    this.authEventListeners.add(listener);
    return () => this.authEventListeners.delete(listener);
  }

  private notifyAuthEventListeners() {
    this.authEventListeners.forEach((listener) => listener());
  }

  private broadcastAuthEvent(eventType: string) {
    // Store timestamp for recency check
    const timestamp = Date.now().toString();
    localStorage.setItem("auth_event_timestamp", timestamp);

    // Set and remove the event to trigger storage events in other tabs
    localStorage.setItem(this.SESSION_KEY, eventType);
    setTimeout(() => {
      localStorage.removeItem(this.SESSION_KEY);
    }, 100);
  }

  public setUserProfile(profile: UserProfile) {
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
    this.broadcastAuthEvent("profile_update");
  }

  public getUserProfile(): UserProfile | null {
    try {
      const profile = localStorage.getItem(this.PROFILE_KEY);
      return profile ? JSON.parse(profile) : null;
    } catch (e) {
      console.error("Error parsing user profile:", e);
      return null;
    }
  }

  public clearAuthData() {
    localStorage.removeItem(this.PROFILE_KEY);
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem("auth_event_timestamp");
    this.broadcastAuthEvent("auth_clear");
  }

  public async validateSession(): Promise<boolean> {
    // Throttle validation to prevent excessive calls
    const now = Date.now();
    if (now - this.lastValidationTime < this.validationThrottleMs) {
      // Return cached result if we've validated recently
      return !!this.getUserProfile();
    }
    
    // Use a promise to deduplicate concurrent calls
    if (this.validationPromise) {
      return this.validationPromise;
    }
    
    this.lastValidationTime = now;
    
    try {
      this.validationPromise = this.performValidation();
      const result = await this.validationPromise;
      return result;
    } finally {
      this.validationPromise = null;
    }
  }
  
  private async performValidation(): Promise<boolean> {
    try {
      const { data } = await supabase.auth.getSession();
      const hasSession = !!data.session;

      if (!hasSession) {
        // Clear auth data if no session
        this.clearAuthData();
      }

      return hasSession;
    } catch (error) {
      console.error("Session validation error:", error);
      return false;
    }
  }
}
