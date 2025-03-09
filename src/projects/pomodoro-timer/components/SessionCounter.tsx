
import React, { memo } from 'react';
import { Circle } from 'lucide-react';

interface SessionCounterProps {
  sessionsCompleted: number;
  sessionsUntilLongBreak: number;
}

const SessionCounter: React.FC<SessionCounterProps> = ({ 
  sessionsCompleted, 
  sessionsUntilLongBreak 
}) => {
  const currentPosition = sessionsCompleted % sessionsUntilLongBreak;
  
  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: sessionsUntilLongBreak }).map((_, index) => (
        <Circle
          key={index}
          className={`h-3 w-3 ${
            index < currentPosition ? 'fill-primary stroke-primary' : 'fill-transparent stroke-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
};

export default memo(SessionCounter);
