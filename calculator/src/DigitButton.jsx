import React from 'react';
import { ACTIONS } from './App'; // Importing ACTIONS from App.js assuming it's exported

export default function DigitButton({ dispatch, digit }) {
  // You can add more cases for other digits if needed
  let id;
  switch (digit) {
    case "1":
      id = "one";
      break;
    case "2":
      id = "two";
      break;
    case "3":
      id = "three";
      break;
    case "4":
      id = "four";
      break;
    case "5":
      id = "five";
      break;
    case "6":
      id = "six";
      break;
    case "7":
      id = "seven";
      break;
    case "8":
      id = "eight";
      break;
    case "9":
      id = "nine";
      break;
    case "0":
      id = "zero";
      break;
    case ".":
      id = "decimal";
    break;
    default:
      id = "";
  }

  return (
    <button id={id} onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>
      {digit}
    </button>
  );
}
