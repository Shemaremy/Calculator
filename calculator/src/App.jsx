import React from 'react';
import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './App.css';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
};




// Controls how the calculator's data changes when you press buttons.
function reducer(state, { type, payload }) {
  const endsWithOperator = /[+\-*/]$/;

  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
          formula: payload.digit === '.' ? `0${payload.digit}` : payload.digit,
        };
      }

      if (state.currentOperand === '0' && payload.digit !== '.') {
        return {
          ...state,
          currentOperand: payload.digit,
          formula: state.formula.slice(0, -state.currentOperand.length) + payload.digit,
        };
      }
      
      if (state.currentOperand === '0' && payload.digit === '.') {
        return {
          ...state,
          currentOperand: '0' + payload.digit,
          formula: state.formula + payload.digit,
        };
      }

      if (payload.digit === '0' && state.currentOperand === '0') {
        return state;
      }
      if (payload.digit === '.' && state.currentOperand.includes('.')) {
        return state;
      }
      

      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
        formula: state.formula === '0' && payload.digit === '.' ? `0${payload.digit}` : state.formula + payload.digit,
      };
    
    case ACTIONS.CHOOSE_OPERATION:

      if (state.overwrite) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload.operation,
          currentOperand: null,
          overwrite: false,
          formula: `${state.currentOperand}${payload.operation}`,
        };
      }



      if (state.currentOperand == null && state.previousOperand == null) {
        if (payload.operation === '-') {
          return {
            ...state,
            currentOperand: payload.operation,
            formula: state.formula + payload.operation,
          };
        }
        return state;
      }

      if (state.currentOperand == null) {
        if (payload.operation === '-') {
          return {
            ...state,
            currentOperand: payload.operation,
            formula: state.formula + payload.operation,
          };
        }
        
        return {
          ...state,
          operation: payload.operation,
          formula: state.formula.slice(0, -1) + payload.operation,
        };
      }

      if (state.previousOperand == null) {
        if (state.currentOperand === '-' && endsWithOperator.test(state.formula.slice(0, -1))) {
          return state;
        }

        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
          formula: state.formula + payload.operation,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
        formula: `${state.previousOperand}${state.operation}${state.currentOperand}${payload.operation}`,
      };

    case ACTIONS.CLEAR:
      return {
        currentOperand: '0',
        previousOperand: null,
        operation: null,
        overwrite: false,
        formula: '',
      };
    
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: 0,
          formula: 0,
        };
      }
      if (state.currentOperand == null) return state;


      if (state.currentOperand === 0) return state;

      if (state.currentOperand === '0' || state.currentOperand === null) {
        return state;
      }

      const updatedCurrentOperand = state.currentOperand.slice(0, -1);
      const updatedFormula = state.formula.slice(0, -1);

      return {
        ...state,
        currentOperand: updatedCurrentOperand || '0',
        formula: updatedFormula || '0',
      };

    case ACTIONS.EVALUATE:
      if ( state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state;
      }

      // Calculate the result with the correct order of operations
      const expression = state.formula;
      const result = (evaluateExpression(expression)).toFixed(4).replace(/\.?0+$/, '');

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: result,
        formula: state.formula + '=' + result,
      };


    default:
      return state;
  }

}

// Helps that multiplication and division comes before anything else
function evaluateExpression(expression) {
  expression = expression.replace(/÷/g, '/');
  try {
    return new Function('return ' + expression)();
  } catch (e) {
    return 'Error';
  }
}




// Does the math (like adding, subtracting) based on what you've entered
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return '';
  let computation = 0;
  switch (operation) {
    case '+':
      computation = prev + current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '*':
      computation = prev * current;
      break;
    case '÷':
      computation = prev / current;
      break;
    default:
      return '';
  }

  return computation.toFixed(4);
}



const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
});



// Makes numbers look nice on the screen (no decimals if it's a whole number).
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split('.');
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}




function App() {
  const [{ currentOperand, previousOperand, operation, formula }, dispatch] = useReducer(reducer, {
    currentOperand: '0', // Initialize currentOperand to '0' to display 0 as default
    previousOperand: null,
    operation: null,
    overwrite: true,
    formula: '', // Initialize formula as an empty string
  });

  return (
    <div className="App">
      <div className="calculator-grid">
        <div className="output" id="display">
          <div className="previous-operand">{formula}</div>
          <div className="current-operand">{operation} {currentOperand}</div>
        </div>
        <button id="clear" className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch} />

        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />

        <OperationButton operation="*" dispatch={dispatch} />

        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />

        <OperationButton operation="+" dispatch={dispatch} />

        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />

        <OperationButton operation="-" dispatch={dispatch} />

        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />

        <button id="equals" className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
          =
        </button>
      </div>
    </div>
  );
}

export default App;
