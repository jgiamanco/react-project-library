
/**
 * Performance monitoring utilities
 */

// Track component rendering time
export const trackRenderTime = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 50) { // Only log slow renders
      console.debug(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    }
  };
};

// Measure function execution time
export function measureExecutionTime<T>(
  fn: () => T, 
  functionName: string
): T {
  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();
  
  const executionTime = endTime - startTime;
  if (executionTime > 20) { // Only log slow functions
    console.debug(`[Performance] ${functionName} executed in ${executionTime.toFixed(2)}ms`);
  }
  
  return result;
}

// Create a custom hook for lazy loading components with fallback
export const useLazyInitialization = <T>(initializationFn: () => T, fallbackValue: T): T => {
  if (typeof window === 'undefined') return fallbackValue;
  
  return initializationFn();
};
