
import { useEffect } from "react";
import { AuthTokenService } from "@/services/auth-token-service"; 
import { supabase } from "@/services/supabase-client";

/**
 * Component that handles cross-tab authentication synchronization.
 * This should be included at the root level of the app.
 */
export const AuthSynchronizer = () => {
  useEffect(() => {
    const authTokenService = AuthTokenService.getInstance();
    
    // Listener for focused tab to check auth status
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Tab is now visible, checking auth status");
        authTokenService.validateSession();
      }
    };
    
    // Listener for when the tab becomes focused
    const handleFocus = () => {
      console.log("Tab gained focus, checking auth status");
      authTokenService.validateSession();
    };
    
    // Add event listeners
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    // Initialize auth on mount
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          console.log("AuthSynchronizer: Valid session found on initialization");
        }
      } catch (error) {
        console.error("AuthSynchronizer initialization error:", error);
      }
    };
    
    initAuth();
    
    // Cleanup
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  
  // This is a utility component with no UI
  return null;
};

export default AuthSynchronizer;
