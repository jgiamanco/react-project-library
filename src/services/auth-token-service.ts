
import { Session } from "@supabase/supabase-js";
import { UserProfile } from "./types";
import { supabase } from "./supabase-client";

// Enhanced service for auth token management with improved cross-tab support
export class AuthTokenService {
  private static instance: AuthTokenService;
  private readonly PROFILE_KEY = 'user_profile';
  private readonly AUTH_EVENT_KEY = 'auth_event';
  private readonly AUTH_EVENT_TIMESTAMP_KEY = 'auth_event_timestamp';
  private readonly SESSION_CHECK_INTERVAL = 30000; // Check session every 30 seconds
  private sessionCheckTimer: number | null = null;
  private authEventListeners: Set<() => void> = new Set();

  private constructor() {
    // Listen for auth events from other tabs
    window.addEventListener('storage', this.handleStorageEvent.bind(this));
    
    // Start periodic session validation
    this.startSessionValidation();
    
    // Immediately validate session on creation
    setTimeout(() => this.validateSession(), 1000);
  }

  static getInstance(): AuthTokenService {
    if (!AuthTokenService.instance) {
      AuthTokenService.instance = new AuthTokenService();
    }
    return AuthTokenService.instance;
  }
  
  // Register a listener for auth events
  addAuthEventListener(listener: () => void): () => void {
    this.authEventListeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.authEventListeners.delete(listener);
    };
  }
  
  // Notify all registered listeners
  private notifyListeners(): void {
    this.authEventListeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in auth event listener:', error);
      }
    });
  }
  
  private handleStorageEvent(event: StorageEvent) {
    // Handle auth-related events from other tabs
    if (event.key === this.AUTH_EVENT_KEY) {
      console.log('Auth event detected from another tab:', event.newValue);
      
      // Check if this is a recent event (within 5 seconds)
      const timestamp = Number(localStorage.getItem(this.AUTH_EVENT_TIMESTAMP_KEY) || '0');
      const now = Date.now();
      const isRecent = (now - timestamp) < 5000;
      
      if (!isRecent) {
        console.log('Ignoring old auth event');
        return;
      }
      
      // Notify listeners about the event
      this.notifyListeners();
      
      // Handle specific events
      if (event.newValue === 'logout') {
        console.log('Logout detected from another tab');
        // Clear local cache
        localStorage.removeItem(this.PROFILE_KEY);
        
        // Reload only if we're on a protected page
        const isProtectedRoute = !['/signin', '/signup', '/', '/privacy', '/terms', '/contact'].includes(window.location.pathname);
        if (isProtectedRoute) {
          console.log('Reloading page due to logout event on protected route');
          window.location.href = '/signin';
        } else {
          // Just refresh the session data
          this.validateSession();
        }
      } else if (event.newValue === 'login' || event.newValue === 'profile_update') {
        console.log('Login or profile update detected from another tab');
        // Force a session validation
        this.validateSession(true);
      }
    }
  }

  // Start periodic session validation
  private startSessionValidation() {
    if (this.sessionCheckTimer === null) {
      this.sessionCheckTimer = window.setInterval(() => {
        this.validateSession();
      }, this.SESSION_CHECK_INTERVAL);
    }
  }
  
  // Stop periodic session validation
  private stopSessionValidation() {
    if (this.sessionCheckTimer !== null) {
      window.clearInterval(this.sessionCheckTimer);
      this.sessionCheckTimer = null;
    }
  }
  
  // Validate the current session
  async validateSession(forceRefresh: boolean = false): Promise<boolean> {
    try {
      console.log('Validating session' + (forceRefresh ? ' (forced)' : ''));
      
      // Get current session
      const { data } = forceRefresh 
        ? await supabase.auth.refreshSession()
        : await supabase.auth.getSession();
      
      // Check if session exists
      const hasSession = !!data.session;
      const hasProfile = this.hasUserProfile();
      
      console.log(`Session validation: hasSession=${hasSession}, hasProfile=${hasProfile}`);
      
      if (hasSession) {
        // If we have a session but no profile, try to load it
        if (!hasProfile && data.session?.user?.email) {
          console.log('Valid session but no profile, triggering profile load');
          // This is unusual - we should have a profile if we have a session
          // Broadcast an event to trigger profile loading
          this.broadcastAuthEvent('login');
        }
        return true;
      } else if (hasProfile) {
        // We have a profile but no session, try a forced refresh
        if (!forceRefresh) {
          console.log('No session but profile exists, trying forced refresh');
          return this.validateSession(true);
        } else {
          console.log('No valid session after forced refresh, clearing local data');
          this.clearAuthData();
          return false;
        }
      }
      
      return hasSession;
    } catch (error) {
      console.error('Error validating session:', error);
      return false;
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
    
    // Ensure critical fields
    if (!mergedProfile.id) {
      mergedProfile.id = mergedProfile.email;
    }
    
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(mergedProfile));
    
    // Notify other tabs about the profile update
    this.broadcastAuthEvent('profile_update');
    
    // Notify local listeners
    this.notifyListeners();
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
    
    // Notify local listeners
    this.notifyListeners();
    
    console.log("Auth data cleared");
  }

  // Simple check if user has profile data
  hasUserProfile(): boolean {
    return localStorage.getItem(this.PROFILE_KEY) !== null;
  }
  
  // Broadcast auth events to other tabs with timestamp for recency check
  broadcastAuthEvent(eventType: string): void {
    // Store timestamp for recency check
    localStorage.setItem(this.AUTH_EVENT_TIMESTAMP_KEY, Date.now().toString());
    
    // Set and remove the event to trigger storage events in other tabs
    localStorage.setItem(this.AUTH_EVENT_KEY, eventType);
    
    // Remove after a short delay to allow event to propagate 
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
