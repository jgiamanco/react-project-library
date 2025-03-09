
import { useReducer, useCallback } from 'react';
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
        return state; // Limit digits
      }
      
      return {
        ...state,
        currentValue: `${state.currentValue}${action.payload.digit}`,
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
          : `-${state.currentValue}`,
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
        currentValue: `${state.currentValue}.`,
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
};
