
import CodeViewer from "@/components/CodeViewer";

const PomodoroTimerCode = () => {
  const files = {
    "PomodoroTimer.tsx": `import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { usePomodoroTimer } from './hooks/usePomodoroTimer';
import TimerDisplay from './components/TimerDisplay';
import SettingsPanel from './components/SettingsPanel';
import SessionCounter from './components/SessionCounter';

// Component implementation...`,
    "types.ts": `export interface PomodoroSettings {
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsUntilLongBreak: number;
}

export type TimerStatus = 'idle' | 'work' | 'break' | 'longBreak';

export interface TimerState {
  status: TimerStatus;
  timeRemaining: number; // in seconds
  isRunning: boolean;
  sessionsCompleted: number;
}`,
    "hooks/usePomodoroTimer.ts": `import { useState, useEffect, useCallback, useMemo } from 'react';
import { PomodoroSettings, TimerState, TimerStatus } from '../types';

const defaultSettings: PomodoroSettings = {
  workDuration: 25, // 25 minutes
  breakDuration: 5, // 5 minutes
  longBreakDuration: 15, // 15 minutes
  sessionsUntilLongBreak: 4,
};

// Hook implementation that manages timer logic...`,
    "components/TimerDisplay.tsx": `import React, { memo } from 'react';

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

export default memo(TimerDisplay);`,
    "components/SettingsPanel.tsx": `import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PomodoroSettings } from '../types';

// Settings panel implementation...`,
  };

  return <CodeViewer files={files} />;
};

export default PomodoroTimerCode;
