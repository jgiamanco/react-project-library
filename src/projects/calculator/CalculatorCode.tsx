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

const Calculator: React.FC = () => {
  const { 
    state, 
    handleDigitClick, 
    handleOperationClick, 
    handleEqualClick,
    handleClearClick,
    handleDeleteClick,
    handleDecimalClick,
    handleToggleSign,
    handlePercentClick
  } = useCalculator();

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardContent className="p-4">
          <CalculatorDisplay value={state.currentValue} previousValue={state.previousValue} operation={state.operation} />
          <CalculatorKeypad 
            onDigitClick={handleDigitClick}
            onOperationClick={handleOperationClick}
            onEqualClick={handleEqualClick}
            onClearClick={handleClearClick}
            onDeleteClick={handleDeleteClick}
            onDecimalClick={handleDecimalClick}
            onToggleSignClick={handleToggleSign}
            onPercentClick={handlePercentClick}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;`,
    "components/CalculatorDisplay.tsx": `import React, { memo } from 'react';
import { CalculatorOperation } from '../types';

interface CalculatorDisplayProps {
  value: string;
  previousValue: string;
  operation: CalculatorOperation | null;
}

const getOperationSymbol = (operation: CalculatorOperation | null): string => {
  switch (operation) {
    case '+': return '+';
    case '-': return '−';
    case '*': return '×';
    case '/': return '÷';
    case '%': return '%';
    default: return '';
  }
};

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ value, previousValue, operation }) => {
  const formattedValue = value.length > 12 
    ? parseFloat(value).toExponential(6) 
    : value;
  
  return (
    <div className="bg-secondary/50 p-4 rounded-lg mb-4">
      <div className="flex justify-end items-center h-6 text-muted-foreground text-sm overflow-hidden">
        {previousValue && (
          <>
            <span>{previousValue}</span>
            <span className="mx-1">{getOperationSymbol(operation)}</span>
          </>
        )}
      </div>
      <div className="text-right text-3xl font-mono font-semibold tracking-tighter overflow-hidden text-ellipsis">
        {formattedValue}
      </div>
    </div>
  );
};

export default memo(CalculatorDisplay);`,
    "components/CalculatorKeypad.tsx": `import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Divide, Minus, Plus, X, Percent, Delete } from 'lucide-react';
import { CalculatorOperation } from '../types';

interface CalculatorKeypadProps {
  onDigitClick: (digit: string) => void;
  onOperationClick: (operation: CalculatorOperation) => void;
  onEqualClick: () => void;
  onClearClick: () => void;
  onDeleteClick: () => void;
  onDecimalClick: () => void;
  onToggleSignClick: () => void;
  onPercentClick: () => void;
}

const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  onDigitClick,
  onOperationClick,
  onEqualClick,
  onClearClick,
  onDeleteClick,
  onDecimalClick,
  onToggleSignClick,
  onPercentClick,
}) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      <Button
        variant="outline"
        onClick={onClearClick}
        className="col-span-1"
      >
        AC
      </Button>
      <Button
        variant="outline"
        onClick={onToggleSignClick}
        className="col-span-1"
      >
        +/-
      </Button>
      <Button
        variant="outline"
        onClick={onPercentClick}
        className="col-span-1"
      >
        <Percent className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        onClick={() => onOperationClick('/')}
        className="col-span-1"
      >
        <Divide className="h-4 w-4" />
      </Button>

      <DigitButton digit="7" onClick={onDigitClick} />
      <DigitButton digit="8" onClick={onDigitClick} />
      <DigitButton digit="9" onClick={onDigitClick} />
      <Button
        variant="secondary"
        onClick={() => onOperationClick('*')}
        className="col-span-1"
      >
        <X className="h-4 w-4" />
      </Button>

      <DigitButton digit="4" onClick={onDigitClick} />
      <DigitButton digit="5" onClick={onDigitClick} />
      <DigitButton digit="6" onClick={onDigitClick} />
      <Button
        variant="secondary"
        onClick={() => onOperationClick('-')}
        className="col-span-1"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <DigitButton digit="1" onClick={onDigitClick} />
      <DigitButton digit="2" onClick={onDigitClick} />
      <DigitButton digit="3" onClick={onDigitClick} />
      <Button
        variant="secondary"
        onClick={() => onOperationClick('+')}
        className="col-span-1"
      >
        <Plus className="h-4 w-4" />
      </Button>

      <DigitButton digit="0" onClick={onDigitClick} className="col-span-1" />
      <Button
        variant="outline"
        onClick={onDecimalClick}
        className="col-span-1"
      >
        .
      </Button>
      <Button
        variant="outline"
        onClick={onDeleteClick}
        className="col-span-1"
      >
        <Delete className="h-4 w-4" />
      </Button>
      <Button
        variant="default"
        onClick={onEqualClick}
        className="col-span-1 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        =
      </Button>
    </div>
  );
};

interface DigitButtonProps {
  digit: string;
  onClick: (digit: string) => void;
  className?: string;
}

const DigitButton: React.FC<DigitButtonProps> = ({ digit, onClick, className = "" }) => (
  <Button
    variant="outline"
    onClick={() => onClick(digit)}
    className={\`col-span-1 \${className}\`}
  >
    {digit}
  </Button>
);

export default memo(CalculatorKeypad);`,
    "hooks/useCalculator.ts": `import { useReducer, useCallback } from 'react';
import { 
  CalculatorState, 
  CalculatorAction, 
  CalculatorActions, 
  CalculatorOperation 
} from '../types';

const initialState: CalculatorState = {
  currentValue: '0',
  previousValue: '',
  operation: null,
  overwrite: false,
};

function calculatorReducer(state: CalculatorState, action: CalculatorActions): CalculatorState {
  switch (action.type) {
    case CalculatorAction.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentValue: action.payload.digit,
          overwrite: false,
        };
      }
      
      if (state.currentValue === '0' && action.payload.digit !== '0') {
        return {
          ...state,
          currentValue: action.payload.digit,
        };
      }
      
      if (state.currentValue === '0' && action.payload.digit === '0') {
        return state;
      }
      
      if (state.currentValue.length >= 12) {
        return state;
      }
      
      return {
        ...state,
        currentValue: \`\${state.currentValue}\${action.payload.digit}\`,
      };
      
    case CalculatorAction.CHOOSE_OPERATION:
      if (state.currentValue === '0' && state.previousValue === '') {
        return state;
      }
      
      if (state.previousValue === '') {
        return {
          ...state,
          operation: action.payload.operation,
          previousValue: state.currentValue,
          currentValue: '0',
        };
      }
      
      if (state.currentValue === '0') {
        return {
          ...state,
          operation: action.payload.operation,
        };
      }
      
      return {
        ...state,
        previousValue: calculate(state),
        operation: action.payload.operation,
        currentValue: '0',
      };
      
    case CalculatorAction.CLEAR:
      return initialState;
      
    case CalculatorAction.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentValue: '0',
          overwrite: false,
        };
      }
      
      if (state.currentValue.length === 1) {
        return {
          ...state,
          currentValue: '0',
        };
      }
      
      return {
        ...state,
        currentValue: state.currentValue.slice(0, -1),
      };
      
    case CalculatorAction.EVALUATE:
      if (state.operation == null || state.previousValue === '' || state.currentValue === '0') {
        return state;
      }
      
      return {
        ...state,
        overwrite: true,
        previousValue: '',
        operation: null,
        currentValue: calculate(state),
      };
      
    case CalculatorAction.TOGGLE_SIGN:
      if (state.currentValue === '0') return state;
      
      return {
        ...state,
        currentValue: state.currentValue.startsWith('-') 
          ? state.currentValue.slice(1) 
          : \`-\${state.currentValue}\`,
      };
      
    case CalculatorAction.ADD_DECIMAL:
      if (state.overwrite) {
        return {
          ...state,
          currentValue: '0.',
          overwrite: false,
        };
      }
      
      if (state.currentValue.includes('.')) {
        return state;
      }
      
      return {
        ...state,
        currentValue: \`\${state.currentValue}.\`,
      };
      
    case CalculatorAction.PERCENT:
      return {
        ...state,
        currentValue: (parseFloat(state.currentValue) / 100).toString(),
      };
      
    default:
      return state;
  }
}

function calculate({ currentValue, previousValue, operation }: CalculatorState): string {
  const prev = parseFloat(previousValue);
  const current = parseFloat(currentValue);
  
  if (isNaN(prev) || isNaN(current)) return '0';
  
  let result: number;
  switch (operation) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      if (current === 0) return 'Error';
      result = prev / current;
      break;
    case '%':
      result = prev % current;
      break;
    default:
      return '0';
  }
  
  return result.toString();
}

export const useCalculator = () => {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  
  const handleDigitClick = useCallback((digit: string) => {
    dispatch({ type: CalculatorAction.ADD_DIGIT, payload: { digit } });
  }, []);
  
  const handleOperationClick = useCallback((operation: CalculatorOperation) => {
    dispatch({ type: CalculatorAction.CHOOSE_OPERATION, payload: { operation } });
  }, []);
  
  const handleEqualClick = useCallback(() => {
    dispatch({ type: CalculatorAction.EVALUATE });
  }, []);
  
  const handleClearClick = useCallback(() => {
    dispatch({ type: CalculatorAction.CLEAR });
  }, []);
  
  const handleDeleteClick = useCallback(() => {
    dispatch({ type: CalculatorAction.DELETE_DIGIT });
  }, []);
  
  const handleDecimalClick = useCallback(() => {
    dispatch({ type: CalculatorAction.ADD_DECIMAL });
  }, []);
  
  const handleToggleSign = useCallback(() => {
    dispatch({ type: CalculatorAction.TOGGLE_SIGN });
  }, []);
  
  const handlePercentClick = useCallback(() => {
    dispatch({ type: CalculatorAction.PERCENT });
  }, []);
  
  return {
    state,
    handleDigitClick,
    handleOperationClick,
    handleEqualClick,
    handleClearClick,
    handleDeleteClick,
    handleDecimalClick,
    handleToggleSign,
    handlePercentClick,
  };
};`,
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

export type CalculatorActions = 
  | { type: CalculatorAction.ADD_DIGIT; payload: { digit: string } }
  | { type: CalculatorAction.CHOOSE_OPERATION; payload: { operation: CalculatorOperation } }
  | { type: CalculatorAction.CLEAR }
  | { type: CalculatorAction.DELETE_DIGIT }
  | { type: CalculatorAction.EVALUATE }
  | { type: CalculatorAction.TOGGLE_SIGN }
  | { type: CalculatorAction.ADD_DECIMAL }
  | { type: CalculatorAction.PERCENT };`
  };

  return <CodeViewer files={files} />;
};

export default CalculatorCode;