
export interface PomodoroSettings {
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
}
