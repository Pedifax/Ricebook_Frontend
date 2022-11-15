import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/form/Input";
import Button from "../../shared/components/UIs/Button";
import { useFormState } from "../../shared/hooks/form-state-hook";
import { useHttpRequest } from "../../shared/hooks/http-request-hook";
import { AppContext } from "../../shared/context/app-context";

const error_text_style = "text-sm text-red-400 text-center mb-3";

const Auth = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpRequest();
  const [password_mismatch, setPasswordMismatch] = useState(false);
  const [login_warning, setLoginWarning] = useState(false);
  const [username_warning, setUsernameWarning] = useState(false);
  const [bottom_warning, setBottomWarning] = useState();
  const [is_login_mode, setIsLoginMode] = useState(true);
  const app_context = useContext(AppContext);
  const history = useHistory();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `https://jsonplaceholder.typicode.com/users`
        );
        localStorage.setItem("users", JSON.stringify(responseData));
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          `https://jsonplaceholder.typicode.com/posts`
        );

        localStorage.setItem("posts", JSON.stringify(responseData));
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest]);

  const [formState, inputHandler, setForm] = useFormState(
    {
      username: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      password_confirmation: undefined,
      email: undefined,
      phone_number: undefined,
      zip: undefined,
    },
    false
  );

  // This won't work. Don't know why
  // const passwordOnInputHandler = useCallback((id, value, isValid) => {
  //   console.log("here1");
  //   inputHandler(id, value, isValid);
  //   console.log("here2");
  //   const cur_formState = {
  //     ...formState,
  //   };
  // console.log(cur_formState);
  // if (!is_login_mode && formState.inputs.password_confirmation) {
  //   if (
  //     formState.inputs.password_confirmation.value !==
  //     formState.inputs.password.value
  //   ) {
  //     console.log("here3");
  //     // console.log(
  //     //   `formState.inputs.password_confirmation.value = ${formState.inputs.password_confirmation.value}`
  //     // );
  //     // console.log(
  //     //   `formState.inputs.password.value = ${formState.inputs.password.value}`
  //     // );
  //     setForm(
  //       {
  //         ...formState.inputs,
  //       },
  //       false
  //     );

  //     // setPasswordMismatch(true);
  //   } else {
  //     // setPasswordMismatch(false);
  //   }
  // }
  // }, []);

  const switchModeHandler = () => {
    if (!is_login_mode) {
      // switching from register mode to login mode. Need to drop some fields.
      let latest_formState_inputs = { ...formState.inputs };
      setForm(
        {
          ...formState.inputs,
          password_confirmation: undefined,
          email: undefined,
          phone_number: undefined,
          zip: undefined,
        },
        // formState.inputs.username.isValid && formState.inputs.password.isValid
        latest_formState_inputs.username.isValid &&
          latest_formState_inputs.password.isValid
      );
      setPasswordMismatch(false);
      setUsernameWarning(false);
      // console.log("formState =");
      // console.log({ ...formState });
    } else {
      setForm(
        {
          ...formState.inputs,
        },
        false
      );
      setPasswordMismatch(false);
    }
    setLoginWarning(false);
    // setBottomWarning("Wrong credential.");
    setIsLoginMode((last_mode) => !last_mode);
  };
  //
  //
  //
  //
  //

  const isNewUsernameValid = (new_username, users) => {
    let matches = users.filter((user) => user.username === new_username);
    if (matches.length > 0) {
      return false;
    }
    return true;
  };

  const authSubmitHandler = (event) => {
    event.preventDefault();

    const cur_formState_inputs = {
      ...formState.inputs,
    };
    if (!cur_formState_inputs.username.value) return;

    // And I don't know why this would work, while the above passwordOnInputHandler method won't. Maybe it's because it's at a different function
    if (
      !is_login_mode &&
      cur_formState_inputs.password &&
      cur_formState_inputs.password_confirmation &&
      cur_formState_inputs.password.value !==
        cur_formState_inputs.password_confirmation.value
    ) {
      setForm(
        {
          ...formState.inputs,
        },
        false
      );
      setBottomWarning("Password Mismatch. Please confirm again.");
      setPasswordMismatch(true);
      return;
    } else {
      setBottomWarning("");
      setPasswordMismatch(false);
    }

    // -----------------------------------------------------------------------
    let users = JSON.parse(localStorage.getItem("users"));

    // Login or register:
    if (is_login_mode) {
      let cur_formState_inputs = {
        ...formState.inputs,
      };

      // let users = JSON.parse(localStorage.getItem("users")).responseData;
      // let users = JSON.parse(localStorage.getItem("users"));
      let matches = users.filter(
        (user) =>
          user.username === cur_formState_inputs.username.value &&
          user.address.street === cur_formState_inputs.password.value
      );
      // matches is an array! Be careful!
      if (matches.length === 1) {
        let loggedInUser = matches[0];
        // console.log("In Login, loggedInUser = ");
        // console.log(loggedInUser);

        localStorage.setItem("cur_user", JSON.stringify(loggedInUser));
        // console.log("The thing in local storage = ");
        // console.log(JSON.parse(localStorage.getItem("cur_user")).loggedInUser);
        // console.log(JSON.parse(localStorage.getItem("cur_user")));

        app_context.login(loggedInUser.id);
        // history.push("/feed");
        // console.log("logged in.");
      } else {
        setLoginWarning(true);
        setBottomWarning("Wrong credential.");
        // console.log("login FAILED. No matched user.");
      }
      return;
    }

    // register mode
    if (!is_login_mode) {
      let cur_formState_inputs = {
        ...formState.inputs,
      };

      // check if user already exists:
      let new_username = cur_formState_inputs.username.value;
      if (!isNewUsernameValid(new_username, users)) {
        setUsernameWarning(true);
        setBottomWarning("The username is already taken.");
        return;
      }

      const loggedInUser = {
        id: 11,
        username: cur_formState_inputs.username.value,
        address: {
          street: cur_formState_inputs.password.value,
          zipcode: cur_formState_inputs.zip.value,
        },
        email: cur_formState_inputs.email.value,
        phone: cur_formState_inputs.phone_number.value,
        company: {
          catchPhrase: "No status yet. Create one?",
        },
      };
      // console.log("In registration, loggedInUser = ");
      // console.log("loggedInUser:");
      // console.log(loggedInUser);

      app_context.login(11);
      // localStorage.setItem("cur_user", JSON.stringify({ loggedInUser }));
      localStorage.setItem("cur_user", JSON.stringify(loggedInUser));
      // let cur_user = JSON.parse(localStorage.getItem("cur_user")).loggedInUser;
      // let cur_user = JSON.parse(localStorage.getItem("cur_user"));

      // console.log("registered and logged in with a new account.");
      // console.log("the account is:");
      // console.log(cur_user);
    }
  };

  return (
    <React.Fragment>
      <h1
        className="mt-3 text-center text-lg text-black"
        data-testid="auth_title"
      >
        {is_login_mode ? "Login" : "Register"}
      </h1>
      <hr className="ml-10 mr-10 mb-5" data-testid="hr" />
      {/* <form className="ml-10 mr-10 " onSubmit={authSubmitHandler}> */}
      <div className="ml-10 mr-10 ">
        <div className="">
          {/* USERNAME */}
          <Input
            type="text"
            size="one-liner"
            id="username"
            label="Username"
            error_message="Please input a valid username."
            placeholder="example: Pewdepie"
            onInput={inputHandler}
            testid="input_username"
          />
          {/* PASSWORD */}
          <Input
            type="password"
            size="one-liner"
            id="password"
            label="Password"
            error_message="Please input a password. Make sure it matches the below confirmation."
            onInput={inputHandler}
            // onInput={passwordOnInputHandler}
            testid="input_password"
          />

          {/* IF IN REGISTER MODE: */}
          {!is_login_mode && (
            // PASSWORD CONFIRMATION
            <Input
              type="password"
              size="one-liner"
              id="password_confirmation"
              label="Confirm Password"
              error_message="Please confirm the password and make sure they match."
              onInput={inputHandler}
              // onInput={passwordOnInputHandler}
              testid="input_password_confirmation"
            />
          )}
          {!is_login_mode && (
            // EMAIL
            <Input
              type="email"
              size="one-liner"
              id="email"
              label="Email"
              error_message="Please enter a valid email address."
              placeholder="example@rice.com"
              onInput={inputHandler}
              testid="input_email"
            />
          )}
          {!is_login_mode && (
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              {/* PHONE NUMBER */}
              <div>
                <Input
                  type="text"
                  size="one-liner"
                  id="phone_number"
                  label="Phone Number"
                  error_message="Enter a valid phone number."
                  onInput={inputHandler}
                  placeholder="ex: 111-222-3333"
                  testid="input_phone_number"
                />
              </div>
              {/* ZIP CODE */}
              <div>
                <Input
                  type="text"
                  size="one-liner"
                  id="zip"
                  label="Zip"
                  error_message="Please input a valid zip."
                  onInput={inputHandler}
                  placeholder="example: 11111"
                  testid="zip"
                />
              </div>
            </div>
          )}
        </div>
        <div className="ml-auto mr-auto flex flex-col space-y-2 md:max-w-xs">
          <p
            className={`${
              password_mismatch || login_warning || username_warning
                ? "block"
                : "invisible"
            } ${error_text_style}`}
            data-testid='bottom_warning_EL'
          >
            {bottom_warning}
          </p>
          <Button
            type="submit"
            disabled={!formState.isValid}
            onClick={authSubmitHandler}
            testid="submit_button"
          >
            {is_login_mode ? "Login" : "Register"}
          </Button>
          <Button onClick={switchModeHandler} testid="switch_mode_button">
            Switch to {`${is_login_mode ? "Registration" : "Login"}`}
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Auth;
