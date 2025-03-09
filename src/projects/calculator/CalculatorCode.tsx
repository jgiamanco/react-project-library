
import CodeViewer from "@/components/CodeViewer";

const CalculatorCode = () => {
  const files = {
    "Calculator.tsx": `import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Divide, Minus, Plus, X, Percent, Delete } from 'lucide-react';
import { useCalculator } from './hooks/useCalculator';
import CalculatorDisplay from './components/CalculatorDisplay';
import CalculatorKeypad from './components/CalculatorKeypad';

// Component implementation...`,
    "types.ts": `export type CalculatorOperation = '+' | '-' | '*' | '/' | '%';

export interface CalculatorState {
  currentValue: string;
  previousValue: string;
  operation: CalculatorOperation | null;
  overwrite: boolean;
}

export enum CalculatorAction {
  ADD_DIGIT = 'add-digit',
  CHOOSE_OPERATION = 'choose-operation',
  CLEAR = 'clear',
  DELETE_DIGIT = 'delete-digit',
  EVALUATE = 'evaluate',
  TOGGLE_SIGN = 'toggle-sign',
  ADD_DECIMAL = 'add-decimal',
  PERCENT = 'percent',
}

// Action types...`,
    "hooks/useCalculator.ts": `import { useReducer, useCallback } from 'react';
import { 
  CalculatorState, 
  CalculatorAction, 
  CalculatorActions, 
  CalculatorOperation 
} from '../types';

// Hook implementation with reducer pattern...`,
    "components/CalculatorDisplay.tsx": `import React, { memo } from 'react';
import { CalculatorOperation } from '../types';

interface CalculatorDisplayProps {
  value: string;
  previousValue: string;
  operation: CalculatorOperation | null;
}

// Component for displaying calculator state...`,
    "components/CalculatorKeypad.tsx": `import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Divide, Minus, Plus, X, Percent, Delete } from 'lucide-react';
import { CalculatorOperation } from '../types';

// Keypad layout and button components...`,
  };

  return <CodeViewer files={files} />;
};

export default CalculatorCode;
