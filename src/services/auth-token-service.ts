import { Session } from "@supabase/supabase-js";
import { UserProfile } from "./types";

// Simple service for auth token management with cross-tab support
export class AuthTokenService {
  private static instance: AuthTokenService;
  private readonly PROFILE_KEY = 'user_profile';
  private readonly AUTH_EVENT_KEY = 'auth_event';

  private constructor() {
    // Listen for auth events from other tabs
    window.addEventListener('storage', this.handleStorageEvent.bind(this));
  }

  static getInstance(): AuthTokenService {
    if (!AuthTokenService.instance) {
      AuthTokenService.instance = new AuthTokenService();
    }
    return AuthTokenService.instance;
  }
  
  private handleStorageEvent(event: StorageEvent) {
    // Handle auth-related events from other tabs
    if (event.key === this.AUTH_EVENT_KEY) {
      console.log('Auth event detected from another tab:', event.newValue);
      // Refresh the page to sync auth state if needed
      if (event.newValue === 'logout' || event.newValue === 'login') {
        console.log('Refreshing page to sync auth state');
        window.location.reload();
      }
    }
  }

  // Store user profile in local storage
  storeUserProfile(profile: UserProfile): void {
    if (!profile) return;
    
    // Keep existing data that might not be in the new profile
    const existingProfile = this.getUserProfile();
    const mergedProfile = existingProfile 
      ? { ...existingProfile, ...profile } 
      : profile;
    
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(mergedProfile));
    
    // Notify other tabs about the profile update
    this.broadcastAuthEvent('profile_update');
  }

  // Get stored user profile
  getUserProfile(): UserProfile | null {
    try {
      const profileData = localStorage.getItem(this.PROFILE_KEY);
      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      console.error("Error retrieving user profile:", error);
      return null;
    }
  }

  // Clear all auth-related data
  clearAuthData(): void {
    localStorage.removeItem(this.PROFILE_KEY);
    localStorage.removeItem('sb-yqbuvfezarqgsevfoqc-auth-token');
    this.broadcastAuthEvent('logout');
    console.log("Auth data cleared");
  }

  // Simple check if user has profile data
  hasUserProfile(): boolean {
    return localStorage.getItem(this.PROFILE_KEY) !== null;
  }
  
  // Broadcast auth events to other tabs
  broadcastAuthEvent(eventType: string): void {
    localStorage.setItem(this.AUTH_EVENT_KEY, eventType);
    // Remove and set again to trigger storage event in other tabs
    setTimeout(() => {
      localStorage.removeItem(this.AUTH_EVENT_KEY);
    }, 100);
  }
  
  // Mark successful login
  markSuccessfulLogin(): void {
    this.broadcastAuthEvent('login');
  }
  
  // Update existing profile (partial update)
  updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
    const currentProfile = this.getUserProfile();
    if (!currentProfile) return null;
    
    const updatedProfile = { ...currentProfile, ...updates };
    this.storeUserProfile(updatedProfile);
    return updatedProfile;
  }
}
