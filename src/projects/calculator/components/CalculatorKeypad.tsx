
import React, { memo } from 'react';
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
      {/* Row 1 */}
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

      {/* Row 2 */}
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

      {/* Row 3 */}
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

      {/* Row 4 */}
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

      {/* Row 5 */}
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
    className={`col-span-1 ${className}`}
  >
    {digit}
  </Button>
);

export default memo(CalculatorKeypad);
