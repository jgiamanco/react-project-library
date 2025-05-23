
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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
        <LoadingSpinner size="lg" color="primary" />
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    </div>
  );
};
