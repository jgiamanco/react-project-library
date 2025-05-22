
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
    
    // Create wrapper functions that don't pass arguments to validateSession
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        authTokenService.validateSession();
      }
    };
    
    const handleFocus = () => {
      authTokenService.validateSession();
    };
    
    // Add event listeners with proper wrapper functions
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    // Initial session check
    authTokenService.validateSession();
    
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
