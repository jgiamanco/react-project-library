
import { useEffect, useState } from 'react';

export const ProfileLoading = () => {
  const [showContent, setShowContent] = useState(false);
  
  // Only show loading spinner after a short delay to prevent flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  if (!showContent) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    </div>
  );
};
