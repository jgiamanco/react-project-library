import { UserProfile } from "./types";
import { supabase } from "./supabase-client";

// Simplified service for auth token management
export class AuthTokenService {
  private static instance: AuthTokenService;
  private readonly PROFILE_KEY = "user_profile";
  private authEventListeners: Set<() => void> = new Set();

  private constructor() {
    // Listen for auth events from other tabs
    window.addEventListener("storage", this.handleStorageEvent.bind(this));
  }

  public static getInstance(): AuthTokenService {
    if (!AuthTokenService.instance) {
      AuthTokenService.instance = new AuthTokenService();
    }
    return AuthTokenService.instance;
  }

  private handleStorageEvent(event: StorageEvent) {
    if (event.key === this.PROFILE_KEY) {
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

  public setUserProfile(profile: UserProfile) {
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
    this.notifyAuthEventListeners();
  }

  public getUserProfile(): UserProfile | null {
    const profile = localStorage.getItem(this.PROFILE_KEY);
    return profile ? JSON.parse(profile) : null;
  }

  public clearAuthData() {
    localStorage.removeItem(this.PROFILE_KEY);
    this.notifyAuthEventListeners();
  }

  public async validateSession(): Promise<boolean> {
    try {
      const { data } = await supabase.auth.getSession();
      return !!data.session;
    } catch (error) {
      console.error("Session validation error:", error);
      return false;
    }
  }
}
