import React, { useCallback, useState, useEffect, useContext } from "react";
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
        localStorage.setItem("users", JSON.stringify({ responseData }));
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

        localStorage.setItem("posts", JSON.stringify({ responseData }));
        // console.log("fixed posts:");
        // console.log(JSON.parse(localStorage.getItem("posts")));
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
    console.log("switch mode!");

    if (!is_login_mode) {
      // switching from register mode to login mode. Need to drop some fields.
      setForm(
        {
          ...formState.inputs,
          password_confirmation: undefined,
          email: undefined,
          phone_number: undefined,
          zip: undefined,
        },
        formState.inputs.username.isValid && formState.inputs.password.isValid
      );
    } else {
      setForm(
        {
          ...formState.inputs,
        },
        false
      );
      setPasswordMismatch(false);
    }
    setIsLoginMode((last_mode) => !last_mode);
  };
  //
  //
  //
  //
  //

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

    // Login or register:
    if (is_login_mode) {
      let cur_formState_inputs = {
        ...formState.inputs,
      };

      let users = JSON.parse(localStorage.getItem("users")).responseData;
      let matches = users.filter(
        (user) =>
          user.username === cur_formState_inputs.username.value &&
          user.address.street === cur_formState_inputs.password.value
      );
      // matches is an array! Be careful!
      if (matches.length == 1) {
        let loggedInUser = matches[0];
        console.log("In Login, loggedInUser = ");
        console.log(loggedInUser);

        localStorage.setItem("cur_user", JSON.stringify({ loggedInUser }));
        console.log("The thing in local storage = ");
        console.log(JSON.parse(localStorage.getItem("cur_user")).loggedInUser);

        app_context.login(loggedInUser.id);
        // history.push("/feed");
        console.log("logged in.");
      } else {
        console.log("login FAILED. No matched user.");
      }
      return;
    }

    // register mode
    if (!is_login_mode) {
      let cur_formState_inputs = {
        ...formState.inputs,
      };
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
          catchPhrase: "I'm feeling sleepy today!",
        },
      };
      console.log("In registration, loggedInUser = ");
      console.log("loggedInUser");
      console.log(loggedInUser);

      app_context.login(11);
      localStorage.setItem("cur_user", JSON.stringify({ loggedInUser }));
      let cur_user = JSON.parse(localStorage.getItem("cur_user")).loggedInUser;

      console.log("logged in with a new account.");
      console.log("the account is:");
      console.log(cur_user);
    }
  };

  return (
    <React.Fragment>
      <h1 className="text-lg text-black text-center mt-3">
        {is_login_mode ? "Login" : "Register"}
      </h1>
      <hr className="ml-10 mr-10 mb-5" />
      {/* <form className="ml-10 mr-10 " onSubmit={authSubmitHandler}> */}
      <div className="ml-10 mr-10 ">
        <div>
          {/* USERNAME */}
          <Input
            type="text"
            size="one-liner"
            id="username"
            label="Username"
            error_message="Please input a valid username."
            placeholder="example: Pewdepie"
            onInput={inputHandler}
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
            />
          )}
          {!is_login_mode && (
            <div className="grid gap-6 mb-6 md:grid-cols-2">
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
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col md:max-w-xs ml-auto mr-auto">
          <p
            className={`${
              password_mismatch ? "block" : "invisible"
            } ${error_text_style}`}
          >
            {bottom_warning}
          </p>
          <Button
            type="submit"
            disabled={!formState.isValid}
            onClick={authSubmitHandler}
          >
            {is_login_mode ? "Login" : "Register"}
          </Button>
          <Button onClick={switchModeHandler}>
            Switch to {`${is_login_mode ? "Registration" : "Login"}`}
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Auth;
