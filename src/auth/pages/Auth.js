import React, { useState, useEffect, useContext, useRef } from "react";
import { Redirect, useHistory } from "react-router-dom";

import Input from "../../shared/components/form/Input";
import Button from "../../shared/components/UIs/Button";
import { useFormState } from "../../shared/hooks/form-state-hook";
import { useHttpRequest } from "../../shared/hooks/http-request-hook";
import { AppContext } from "../../shared/context/app-context";
const error_text_style = "text-sm text-red-400 text-center mb-3";
const BACKEND = process.env.REACT_APP_BACKEND_URL;

const Auth = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpRequest();
  const [password_mismatch, setPasswordMismatch] = useState(false);
  const [login_warning, setLoginWarning] = useState(false);
  const [username_warning, setUsernameWarning] = useState(false);
  const [imageMissing, setImageMissing] = useState(false);
  const [bottom_warning, setBottomWarning] = useState();
  const [is_login_mode, setIsLoginMode] = useState(true);
  const appContext = useContext(AppContext);
  const history = useHistory();

  /*             */
  /* File Upload */
  /*             */
  const [imageFile, setImageFile] = useState();
  const [previewURL, setPreviewURL] = useState();
  const filePickerRef = useRef();
  const browseImageHandler = () => {
    filePickerRef.current.click();
  };
  const imagePickedHandler = (event) => {
    setImageFile(event.target.files[0]);
  };

  useEffect(() => {
    // image preview
    if (!imageFile) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewURL(fileReader.result);
    };
    fileReader.readAsDataURL(imageFile);
  }, [imageFile]);
  /*             */
  /* File Upload */
  /*             */

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
    true
  );

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
        // latest_formState_inputs.username.isValid &&
        //   latest_formState_inputs.password.isValid
        true
      );
      setPasswordMismatch(false);
      setUsernameWarning(false);
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

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    const cur_formState_inputs = {
      ...formState.inputs,
    };

    if (!cur_formState_inputs.username.value) return;

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
      setBottomWarning("Password Mismatch.");
      setPasswordMismatch(true);
      return;
    }

    // -----------------------------------------------------------------------
    // Login or register:
    if (is_login_mode) {
      let cur_formState_inputs = {
        ...formState.inputs,
      };
      const payload = {
        username: cur_formState_inputs.username.value,
        password: cur_formState_inputs.password.value,
      };

      try {
        const responseData = await sendRequest(
          `${BACKEND}/login`,
          "POST",
          JSON.stringify(payload),
          {
            "Content-Type": "application/json", // MUST ADD THIS HEADER!
          }
        );
        appContext.login(responseData.username);
      } catch (err) {
        // 解釋：
        // If wrong credential, hook will throw an error, which is caught by
        // this block. So if staying in try{} block, it means the login is HTTP 200,
        // thus don't need to check responseData.
        // console.log("err in Auth > Login: " + err);
        setLoginWarning(true);
        setBottomWarning("Wrong credential.");
      }
    }

    // register mode
    if (!is_login_mode) {
      if (!imageFile) {
        setImageMissing(true);
        setBottomWarning("Please select an image.");
        return;
      }

      let cur_formState_inputs = {
        ...formState.inputs,
      };

      try {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("username", cur_formState_inputs.username.value);
        formData.append("password", cur_formState_inputs.password.value);
        formData.append("email", cur_formState_inputs.email.value);
        formData.append("phone", cur_formState_inputs.phone_number.value);
        formData.append("zip", cur_formState_inputs.zip.value);

        const responseData = await sendRequest(
          `${BACKEND}/register`,
          "POST",
          formData
          // DON'T add "Content-Type": "application/json" when uploading an image
        );
        appContext.login(responseData.username);
      } catch (err) {
        // console.log("err in Auth > register: " + err);
        setBottomWarning("Something went wrong, can't register.");
      }
    }
  };

  const googleAuth = () => {
    window.open(`${process.env.REACT_APP_BACKEND_URL}/oauth/google`, "_self");
  };

  return (
    <React.Fragment>
      <h1
        className="mt-3 pb-2 text-center text-2xl font-light text-black"
        data-testid="auth_title"
      >
        {is_login_mode ? "Login" : "Register"}
      </h1>
      <hr className="ml-10 mr-10 mb-5" data-testid="hr" />
      <div className="ml-10 mr-10 ">
        <div className="">
          <input
            type="file"
            ref={filePickerRef}
            style={{ display: "none" }}
            className="hidden"
            accept=".jpg,.png,.jpeg,.gif"
            onChange={imagePickedHandler}
          />
          {!is_login_mode ? (
            <div className="flex flex-col justify-center">
              <div className="flex flex-col self-center">
                <div className="self-center">
                  {previewURL ? (
                    <div>
                      <img
                        className="h-24 w-24 rounded-full"
                        src={previewURL}
                        alt="previewImage"
                      />
                    </div>
                  ) : (
                    <div>
                      <svg
                        className="h-24 w-24"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        role="default avatar"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {previewURL ? (
                  ""
                ) : (
                  <span className="self-center">Pick an image of you!</span>
                )}
              </div>
              <div
                className="mt-2 cursor-pointer self-center rounded-lg p-2 hover:bg-gray-200"
                onClick={browseImageHandler}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  role="browse image button"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
            </div>
          ) : (
            ""
          )}

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
            autoComplete="off"
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
              // password_mismatch ||
              // login_warning ||
              // username_warning ||
              // imageMissing
              bottom_warning ? "block" : "invisible"
            } ${error_text_style}`}
            data-testid="bottom_warning_EL"
          >
            {bottom_warning}
          </p>

          <Button
            type="submit"
            disabled={!formState.isValid} // BUG behavior weird!
            // (reproduce: valid inputs, switch to register and back to login, then we can't click)
            onClick={authSubmitHandler}
            testid="submit_button"
          >
            {is_login_mode ? "Login" : "Register"}
          </Button>

          <Button onClick={switchModeHandler} testid="switch_mode_button">
            Switch to {`${is_login_mode ? "Registration" : "Login"}`}
          </Button>

          <Button className="" onClick={googleAuth}>
            <div className="flex justify-center">
              <div className="">
                <img
                  src={require("../../shared/images/google.png")}
                  className="h-8 w-8"
                />
              </div>
            </div>
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Auth;
