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

const PomodoroTimer: React.FC = () => {
  const {
    timerState,
    settings,
    soundEnabled,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleSound,
    updateSettings,
    formattedTime,
  } = usePomodoroTimer();

  const { status, isRunning, sessionsCompleted } = timerState;

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg border-foreground/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Pomodoro Timer</CardTitle>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={toggleSound} title={soundEnabled ? 'Mute' : 'Unmute'}>
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="timer">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="timer" className="flex-1">Timer</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timer" className="space-y-6">
              <div className="text-center">
                <SessionCounter 
                  sessionsCompleted={sessionsCompleted} 
                  sessionsUntilLongBreak={settings.sessionsUntilLongBreak} 
                />
                <TimerDisplay time={formattedTime} />
                <div className="flex justify-center gap-4 mt-6">
                  {!isRunning ? (
                    <Button onClick={startTimer}>
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </Button>
                  ) : (
                    <Button onClick={pauseTimer}>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  )}
                  <Button variant="outline" onClick={resetTimer}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <SettingsPanel settings={settings} updateSettings={updateSettings} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PomodoroTimer;`,
    "hooks/usePomodoroTimer.ts": `import { useState, useEffect, useCallback, useMemo } from 'react';
import { PomodoroSettings, TimerState, TimerStatus } from '../types';

const defaultSettings: PomodoroSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
};

const initialTimerState: TimerState = {
  status: 'idle',
  timeRemaining: defaultSettings.workDuration * 60,
  isRunning: false,
  sessionsCompleted: 0,
};

export const usePomodoroTimer = () => {
  const [settings, setSettings] = useState<PomodoroSettings>(defaultSettings);
  const [timerState, setTimerState] = useState<TimerState>(initialTimerState);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timerState.timeRemaining / 60);
    const seconds = timerState.timeRemaining % 60;
    return \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
  }, [timerState.timeRemaining]);
  
  useEffect(() => {
    let timer: number | null = null;
    
    if (timerState.isRunning) {
      timer = window.setInterval(() => {
        setTimerState(prev => {
          if (prev.timeRemaining <= 1) {
            if (soundEnabled) {
              const audio = new Audio('/notification.mp3');
              audio.play().catch(e => console.error('Error playing sound:', e));
            }
            
            const nextStatus = getNextStatus(prev.status, prev.sessionsCompleted, settings);
            const nextSessionsCompleted = prev.status === 'work' 
              ? prev.sessionsCompleted + 1 
              : prev.sessionsCompleted;
            
            return {
              ...prev,
              status: nextStatus,
              timeRemaining: getDurationForStatus(nextStatus, settings),
              sessionsCompleted: nextSessionsCompleted,
            };
          }
          
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1,
          };
        });
      }, 1000);
    }
    
    return () => {
      if (timer !== null) {
        clearInterval(timer);
      }
    };
  }, [timerState.isRunning, settings, soundEnabled]);
  
  const startTimer = useCallback(() => {
    setTimerState(prev => {
      if (prev.status === 'idle') {
        return {
          ...prev,
          status: 'work',
          timeRemaining: settings.workDuration * 60,
          isRunning: true,
        };
      }
      return {
        ...prev,
        isRunning: true,
      };
    });
  }, [settings]);
  
  const pauseTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
    }));
  }, []);
  
  const resetTimer = useCallback(() => {
    setTimerState({
      status: 'idle',
      timeRemaining: settings.workDuration * 60,
      isRunning: false,
      sessionsCompleted: 0,
    });
  }, [settings]);
  
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);
  
  const updateSettings = useCallback((newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    setTimerState(prev => {
      if (!prev.isRunning) {
        return {
          ...prev,
          timeRemaining: getDurationForStatus(prev.status, newSettings),
        };
      }
      return prev;
    });
  }, []);
  
  return {
    timerState,
    settings,
    soundEnabled,
    formattedTime,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleSound,
    updateSettings,
  };
};

function getNextStatus(
  currentStatus: TimerStatus, 
  sessionsCompleted: number, 
  settings: PomodoroSettings
): TimerStatus {
  if (currentStatus === 'work') {
    const isLongBreakDue = (sessionsCompleted + 1) % settings.sessionsUntilLongBreak === 0;
    return isLongBreakDue ? 'longBreak' : 'break';
  } else {
    return 'work';
  }
}

function getDurationForStatus(status: TimerStatus, settings: PomodoroSettings): number {
  switch (status) {
    case 'work':
      return settings.workDuration * 60;
    case 'break':
      return settings.breakDuration * 60;
    case 'longBreak':
      return settings.longBreakDuration * 60;
    case 'idle':
    default:
      return settings.workDuration * 60;
  }
}`,
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

interface SettingsPanelProps {
  settings: PomodoroSettings;
  updateSettings: (settings: PomodoroSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, updateSettings }) => {
  const [localSettings, setLocalSettings] = React.useState<PomodoroSettings>(settings);
  
  const handleChange = (key: keyof PomodoroSettings, value: number) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = () => {
    updateSettings(localSettings);
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="workDuration">Work Duration: {localSettings.workDuration} min</Label>
        <Slider
          id="workDuration"
          min={1}
          max={60}
          step={1}
          value={[localSettings.workDuration]}
          onValueChange={(values) => handleChange('workDuration', values[0])}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="breakDuration">Break Duration: {localSettings.breakDuration} min</Label>
        <Slider
          id="breakDuration"
          min={1}
          max={30}
          step={1}
          value={[localSettings.breakDuration]}
          onValueChange={(values) => handleChange('breakDuration', values[0])}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="longBreakDuration">Long Break Duration: {localSettings.longBreakDuration} min</Label>
        <Slider
          id="longBreakDuration"
          min={5}
          max={60}
          step={1}
          value={[localSettings.longBreakDuration]}
          onValueChange={(values) => handleChange('longBreakDuration', values[0])}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="sessionsUntilLongBreak">Pomodoros Until Long Break</Label>
        <Input
          id="sessionsUntilLongBreak"
          type="number"
          min={1}
          max={10}
          value={localSettings.sessionsUntilLongBreak}
          onChange={(e) => handleChange('sessionsUntilLongBreak', parseInt(e.target.value) || 4)}
        />
      </div>
      
      <Button onClick={handleSave} className="w-full mt-4">Save Settings</Button>
    </div>
  );
};

export default SettingsPanel;`,
    "types.ts": `export interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

export type TimerStatus = 'idle' | 'work' | 'break' | 'longBreak';

export interface TimerState {
  status: TimerStatus;
  timeRemaining: number;
  isRunning: boolean;
  sessionsCompleted: number;
}`
  };

  return <CodeViewer files={files} />;
};

export default PomodoroTimerCode;