import React, { useReducer, useEffect } from "react";

import { validate } from "../../../shared/tools/validators";

/*
props = {
  size = "one-liner" or "text" (or specify a number)
  id = show us which validators to use for it
  placeholder = "String"
  onInput
  onBlur
  value = (for 2-awy binding)
  validators -> 在validators.js裡面用action.input_type去判斷即可
  error_message 

}
*/
// ------------------------------------------------------------------------------------

const label_style =
  "block mb-1 ml-2 text-md font-medium text-gray-900 dark:text-gray-300";
const input_style =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-400 focus:border-cyan-400 block w-full p-2";
const error_text_style = "mt-2 ml-6 text-xs md:text-sm text-red-400";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        // copy the old state
        ...state,
        value: action.val,
        isValid: validate(action.val, action.id),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state; // return the same thing
  }
};
// ---------------------------------------------------------------------------

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    // Original:
    // value: props.initialValue || "",
    // isTouched: false,
    // isValid: props.initialValid || false,

    // Try:
    value: "",
    isTouched: false,
    isValid: false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  // update the form validity when this <Input> was inputted
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      id: props.id,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const form_content =
    props.size === "one-liner" ? (
      <input
        className={input_style}
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler} // so the user won't get warning input field right from the start
        value={inputState.value} // 2-way binding
        data-testid={props.testid}
        autoComplete={props.autoComplete}
      />
    ) : (
      <textarea
        className={input_style}
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value} // 2-way binding
        data-testid={props.testid}
      />
    );

  return (
    <div className="mb-6">
      <label htmlFor={props.id} className={label_style}>
        {props.label}
        <span
          className={`
        ${
          inputState.isValid || !inputState.isTouched ? "invisible" : ""
        } ${error_text_style}`}
        >
          {props.error_message}
        </span>
      </label>
      {form_content}
    </div>
  );
};

export default Input;
