import { useCallback, useReducer } from "react";

const formStateReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let whole_validity = true;
      for (const inputId in state.inputs) {
        // if this property is undefined, we simply skip it to avoid getting value from an undefined thing
        // we do this because when we reset the form state, we set things to undefined.
        // So we skip undefined things
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          // if this inputId is the one the that gets updated (and triggered reducer function)
          whole_validity = whole_validity && action.isValid;
        } else {
          whole_validity = whole_validity && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: whole_validity,
      };

    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.whole_validity,
      };
    default:
      return state;
  }
};

export const useFormState = (initial_inputs, initial_whole_validity) => {
  const [formState, dispatch] = useReducer(formStateReducer, {
    // the initial state: inputs = the summary of all the states (title's, description's)
    // isValid: the overall validity of the all the inputs

    inputs: initial_inputs,
    isValid: initial_whole_validity,
  });

  const setForm = useCallback((input_data, new_validity) => {
    dispatch({
      type: "SET_DATA",
      inputs: input_data,
      formIsValid: new_validity,
    });
  }, []);

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value: value,
      isValid: isValid,
      inputId: id,
    });

    // This won't work. The values aren't updated at this stage.
    // if (id === "password" || id === "password_confirmation") {
    //   console.log("here");
    //   console.log(id);
    //   console.log(formState.inputs.password);
    //   console.log(formState.inputs.password_confirmation);
    //   if (formState.inputs.password_confirmation) {
    //   }
    // }
  }, []);

  return [formState, inputHandler, setForm];
};
