
import React from 'react';
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

export default SettingsPanel;
