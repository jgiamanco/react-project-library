
import React from 'react';
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

export default Calculator;
