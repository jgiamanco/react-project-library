
import { toast } from "sonner";

interface ErrorOptions {
  title?: string;
  silent?: boolean;
  retry?: () => Promise<any>;
}

/**
 * Centralized error handler for consistent error management across the app
 */
export const errorHandler = {
  /**
   * Handle an error with proper logging and user notification
   */
  handle: (error: unknown, options: ErrorOptions = {}) => {
    const { title = "Error", silent = false, retry } = options;
    
    // Extract error message
    const errorMessage = extractErrorMessage(error);
    
    // Log to console
    console.error(`${title}:`, error);
    
    // Show toast notification if not silent
    if (!silent) {
      toast.error(title, {
        description: errorMessage,
        action: retry ? {
          label: "Retry",
          onClick: () => retry(),
        } : undefined,
      });
    }
    
    // Return the error message for further use
    return errorMessage;
  },
  
  /**
   * Create an async error handler that wraps a promise
   */
  async: async <T>(
    promise: Promise<T>,
    options: ErrorOptions = {}
  ): Promise<T | null> => {
    try {
      return await promise;
    } catch (error) {
      errorHandler.handle(error, options);
      return null;
    }
  }
};

/**
 * Extract a readable message from various error types
 */
function extractErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  
  return 'An unknown error occurred';
}
