
import CodeViewer from "@/components/CodeViewer";

const CalculatorCode = () => {
  const files = {
    "Calculator.tsx": `import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalculatorDisplay from "./components/CalculatorDisplay";
import CalculatorKeypad from "./components/CalculatorKeypad";
import useCalculator from "./hooks/useCalculator";

const Calculator = () => {
  const {
    displayValue,
    handleDigitClick,
    handleOperationClick,
    handleEqualClick,
    handleClearClick,
    handleDeleteClick,
    handleDecimalClick,
    handleToggleSignClick,
    handlePercentClick,
  } = useCalculator();

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <CalculatorDisplay value={displayValue} />
          <CalculatorKeypad
            onDigitClick={handleDigitClick}
            onOperationClick={handleOperationClick}
            onEqualClick={handleEqualClick}
            onClearClick={handleClearClick}
            onDeleteClick={handleDeleteClick}
            onDecimalClick={handleDecimalClick}
            onToggleSignClick={handleToggleSignClick}
            onPercentClick={handlePercentClick}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;`,
    "components/CalculatorDisplay.tsx": `import React, { memo } from 'react';

interface CalculatorDisplayProps {
  value: string;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ value }) => {
  return (
    <div className="p-4 mb-4 bg-gray-100 rounded-md text-right font-mono overflow-x-auto">
      <div className="text-3xl whitespace-nowrap">{value}</div>
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

const CalculatorKeypad = ({ 
  onDigitClick, 
  onOperationClick, 
  onEqualClick, 
  onClearClick, 
  onDeleteClick, 
  onDecimalClick, 
  onToggleSignClick, 
  onPercentClick 
}) => {
  // Component implementation...
};

export default memo(CalculatorKeypad);`,
    "hooks/useCalculator.ts": `import { useState } from 'react';
import { CalculatorOperation } from '../types';

const useCalculator = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<CalculatorOperation | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  // Implementation...

  return {
    displayValue,
    handleDigitClick,
    handleOperationClick,
    handleEqualClick,
    handleClearClick,
    handleDeleteClick,
    handleDecimalClick,
    handleToggleSignClick,
    handlePercentClick,
  };
};

export default useCalculator;`,
    "types.ts": `export type CalculatorOperation = '+' | '-' | '*' | '/';

export interface CalculatorState {
  displayValue: string;
  firstOperand: number | null;
  operation: CalculatorOperation | null;
  waitingForSecondOperand: boolean;
}`,
  };

  return <CodeViewer files={files} />;
};

export default CalculatorCode;
