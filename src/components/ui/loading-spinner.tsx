
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
  delay?: number;
}

export const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  className,
  delay = 200,
}: LoadingSpinnerProps) => {
  const [show, setShow] = useState(delay === 0);
  
  useEffect(() => {
    if (delay === 0) return;
    
    const timer = setTimeout(() => {
      setShow(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  if (!show) return null;

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  const colorClasses = {
    primary: 'text-primary',
    white: 'text-white',
    gray: 'text-gray-300'
  };

  return (
    <Loader2
      className={cn(
        "animate-spin", 
        sizeClasses[size], 
        colorClasses[color],
        className
      )}
      aria-label="Loading"
    />
  );
};

interface LoadingContainerProps {
  children: React.ReactNode;
  isLoading: boolean;
  className?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
  spinnerColor?: 'primary' | 'white' | 'gray';
  loadingText?: string;
}

export const LoadingContainer = ({
  children,
  isLoading,
  className,
  spinnerSize = 'md',
  spinnerColor = 'primary',
  loadingText
}: LoadingContainerProps) => {
  if (!isLoading) return <>{children}</>;
  
  return (
    <div className={cn("flex items-center justify-center min-h-[200px]", className)}>
      <div className="text-center space-y-4">
        <LoadingSpinner size={spinnerSize} color={spinnerColor} />
        {loadingText && <p className="text-muted-foreground">{loadingText}</p>}
      </div>
    </div>
  );
};
