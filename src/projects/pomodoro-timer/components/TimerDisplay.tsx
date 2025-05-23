
import React, { memo } from 'react';

interface TimerDisplayProps {
  time: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ time }) => {
  return (
    <div className="font-mono text-6xl font-bold tracking-tight">
      {time}
    </div>
  );
};

export default memo(TimerDisplay);
