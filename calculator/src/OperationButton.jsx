import { ACTIONS } from "./App"

export default function OperationButton({ dispatch, operation }) {


  let id;

  switch (operation) {
    case "+":
      id = "add";
      break;
    case "-":
      id = "subtract";
      break;
    case "*":
      id = "multiply";
      break;
    case "÷":
      id = "divide";
      break;

    case "÷":
      id = "divide";
    break;
    
    default:
      id = "";
  }



  return (
    <button id={id} onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })}>
      {operation}
    </button>
  )
}