
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
    
    // Simplified event handlers that just validate session
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        authTokenService.validateSession();
      }
    };
    
    // Add event listeners
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', authTokenService.validateSession);
    
    // Initial session check
    authTokenService.validateSession();
    
    // Cleanup
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', authTokenService.validateSession);
    };
  }, []);
  
  // This is a utility component with no UI
  return null;
};

export default AuthSynchronizer;
