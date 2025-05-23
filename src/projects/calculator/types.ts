
export type CalculatorOperation = '+' | '-' | '*' | '/' | '%';

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
  | { type: CalculatorAction.PERCENT };
