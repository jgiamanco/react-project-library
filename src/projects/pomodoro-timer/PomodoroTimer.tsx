
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react';
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
                <Badge variant={status === 'work' ? 'default' : status === 'break' ? 'secondary' : 'outline'} className="mb-4">
                  {status === 'work' ? 'Work' : status === 'break' ? 'Break' : status === 'longBreak' ? 'Long Break' : 'Ready'}
                </Badge>
                
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
                
                <SessionCounter 
                  sessionsCompleted={sessionsCompleted} 
                  sessionsUntilLongBreak={settings.sessionsUntilLongBreak} 
                />
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

export default PomodoroTimer;
