
import React, { memo } from 'react';
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

export default memo(CalculatorDisplay);
