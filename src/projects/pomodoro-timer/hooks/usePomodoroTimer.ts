import { useState, useEffect, useCallback, useMemo } from 'react';
import { PomodoroSettings, TimerState, TimerStatus } from '../types';

const defaultSettings: PomodoroSettings = {
  workDuration: 25, // 25 minutes
  breakDuration: 5, // 5 minutes
  longBreakDuration: 15, // 15 minutes
  sessionsUntilLongBreak: 4,
};

const initialTimerState: TimerState = {
  status: 'idle',
  timeRemaining: defaultSettings.workDuration * 60, // in seconds
  isRunning: false,
  sessionsCompleted: 0,
};

export const usePomodoroTimer = () => {
  const [settings, setSettings] = useState<PomodoroSettings>(defaultSettings);
  const [timerState, setTimerState] = useState<TimerState>(initialTimerState);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Format time as MM:SS
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timerState.timeRemaining / 60);
    const seconds = timerState.timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timerState.timeRemaining]);
  
  // Timer tick logic
  useEffect(() => {
    let timer: number | null = null;
    
    if (timerState.isRunning) {
      timer = window.setInterval(() => {
        setTimerState(prev => {
          if (prev.timeRemaining <= 1) {
            // Play sound if enabled
            if (soundEnabled) {
              const audio = new Audio('/notification.mp3');
              audio.play().catch(e => console.error('Error playing sound:', e));
            }
            
            // Time is up, transition to next phase
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
          
          // Normal tick, just decrement time
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
  
  // Handle start timer
  const startTimer = useCallback(() => {
    setTimerState(prev => {
      // If idle, start with work
      if (prev.status === 'idle') {
        return {
          ...prev,
          status: 'work',
          timeRemaining: settings.workDuration * 60,
          isRunning: true,
        };
      }
      
      // Otherwise just resume
      return {
        ...prev,
        isRunning: true,
      };
    });
  }, [settings]);
  
  // Handle pause timer
  const pauseTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
    }));
  }, []);
  
  // Handle reset timer
  const resetTimer = useCallback(() => {
    setTimerState({
      status: 'idle',
      timeRemaining: settings.workDuration * 60,
      isRunning: false,
      sessionsCompleted: 0,
    });
  }, [settings]);
  
  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);
  
  // Update settings
  const updateSettings = useCallback((newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    // If timer is not running, update the time remaining based on current status
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

// Helper function to determine the next timer status
function getNextStatus(
  currentStatus: TimerStatus, 
  sessionsCompleted: number, 
  settings: PomodoroSettings
): TimerStatus {
  if (currentStatus === 'work') {
    // After work, either take a break or a long break
    const isLongBreakDue = (sessionsCompleted + 1) % settings.sessionsUntilLongBreak === 0;
    return isLongBreakDue ? 'longBreak' : 'break';
  } else {
    // After any break, go back to work
    return 'work';
  }
}

// Helper function to get the duration for a timer status
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
}
