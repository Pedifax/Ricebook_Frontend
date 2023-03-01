import React, { useState, useEffect, useRef } from "react";

import { validate } from "../../shared/tools/validators";
import Button from "../../shared/components/UIs/Button";
import { useHttpRequest } from "../../shared/hooks/http-request-hook";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const diabled_input_style =
  " border bg-white text-cyan-500 font-md border-gray-300 text-sm rounded-md focus:ring-cyan-400 focus:border-cyan-400 block w-full p-2";
const input_style =
  " border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-cyan-400 focus:border-cyan-400 block w-full p-2";
const label_style =
  "block mb-1 ml-2 text-md font-medium text-gray-900 dark:text-gray-300";
const error_text_style = "text-xs font-light md:text-sm text-red-500";
const update_error_text_style = "m-auto text-xs md:text-lg text-red-400";
const success_text_style = "m-auto text-xs md:text-lg text-green-400";

const Profile = () => {
  const [userProfile, setUserProfile] = useState({});
  const { isLoading, error, sendRequest, clearError } = useHttpRequest();
  const [form, setForm] = useState({
    username: "",
    password: "",
    password_confirmation: "",
    email: "",
    phone_number: "",
    zip: "",
  });
  const [all_error_msg, setAllErrorMsg] = useState({});
  const [bottom_info, setBottomInfo] = useState({
    is_valid: true,
    message_to_show: "",
  });
  /*             */
  /* File Upload */
  /*             */
  const filePickerRef = useRef();
  const [imageFile, setImageFile] = useState();
  const [previewURL, setPreviewURL] = useState();
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

  const clearForm = () => {
    setForm({
      username: "",
      password: "",
      password_confirmation: "",
      email: "",
      phone_number: "",
      zip: "",
    });
    setPreviewURL(null);
    setImageFile(null);
    obtainProfile();
  };

  const obtainProfile = async () => {
    try {
      const responseData = await sendRequest(`${BACKEND}/profile`);
      setUserProfile(responseData.profileObject);
      setForm((prev) => ({
        ...prev,
        email: responseData.profileObject.email, // to avoid auto-complete
        password: "",
      }));
    } catch (err) {
      // console.log(`Feed > Error when obtaining userProfileObj: ${err}`);
    }
  };

  useEffect(() => {
    obtainProfile();
  }, []);

  useEffect(() => {}, [userProfile]);

  const handleUsername = (e) => {
    e.preventDefault();
    let new_value = e.target.value;
    setForm((prevState) => ({ ...prevState, username: new_value }));
    if (validate(new_value, "username")) {
      setAllErrorMsg((prevState) => ({ ...prevState, username: "" }));
    } else {
      setAllErrorMsg((prevState) => ({
        ...prevState,
        username: "Please enter a valid username.",
      }));
    }
  };

  const handlePassword = (event) => {
    let new_value = event.target.value;
    setForm((prevState) => ({
      ...prevState,
      password: new_value,
    }));
    if (validate(new_value, "password")) {
      setAllErrorMsg((prevState) => ({ ...prevState, password: "" }));
    } else {
      setAllErrorMsg((prevState) => ({
        ...prevState,
        password: "Please enter a valid password.",
      }));
    }
  };

  const handlePasswordConfirmation = (e) => {
    let new_value = e.target.value;
    setForm((prevState) => ({
      ...prevState,
      password_confirmation: new_value,
    }));
    if (validate(new_value, "password_confirmation")) {
      setAllErrorMsg((prevState) => ({
        ...prevState,
        password_confirmation: "",
      }));
    } else {
      setAllErrorMsg((prevState) => ({
        ...prevState,
        password_confirmation: "Please enter a valid password.",
      }));
    }
  };

  const handleEmail = (e) => {
    e.preventDefault();
    let new_value = e.target.value;
    setForm((prevState) => ({ ...prevState, email: new_value }));
    if (validate(new_value, "email")) {
      setAllErrorMsg((prevState) => ({ ...prevState, email: "" }));
    } else {
      setAllErrorMsg((prevState) => ({
        ...prevState,
        email: "Please enter a valid email. (e.g., example@rice.com)",
      }));
    }
  };

  const handlePhone = (e) => {
    let new_value = e.target.value;
    setForm((prevState) => ({ ...prevState, phone_number: new_value }));
    if (validate(new_value, "phone_number")) {
      setAllErrorMsg((prevState) => ({ ...prevState, phone_number: "" }));
    } else {
      setAllErrorMsg((prevState) => ({
        ...prevState,
        phone_number: "Please enter a valid phone number. (e.g., 111-222-3333)",
      }));
    }
  };

  const handleZip = (e) => {
    let new_value = e.target.value;
    setForm((prevState) => ({
      ...prevState,
      zip: new_value,
    }));
    if (validate(new_value, "zip")) {
      setAllErrorMsg((prevState) => ({ ...prevState, zip: "" }));
    } else {
      setAllErrorMsg((prevState) => ({
        ...prevState,
        zip: "Please enter a valid zip. (e.g., 12345)",
      }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    let cur_form = {
      ...form,
    };
    let error_compilation = {
      ...all_error_msg,
    };
    let list_to_check = [
      error_compilation.username,
      error_compilation.password,
      error_compilation.password_confirmation,
      error_compilation.email,
      error_compilation.phone_number,
      error_compilation.zip,
    ];
    let is_valid = true;
    let output_message = "";
    let pass1 = cur_form.password;
    let pass2 = cur_form.password_confirmation;
    // VALIDATE:
    for (let i = 0; i < list_to_check.length; i++) {
      is_valid = is_valid && !list_to_check[i];
      if (list_to_check[i]) {
        // TODO omit output message, use all_error_msg instead
        output_message += list_to_check[i] + " ";
      }
    }

    if (pass1 !== "" && pass2 !== "") {
      if (pass1 !== pass2) {
        is_valid = false;
        output_message += "Passwords mismatch.";
      }
    }

    if (is_valid) {
      const payload = {
        email: cur_form.email,
        phone: cur_form.phone_number,
        zip: cur_form.zip,
      };

      try {
        const responseData = await sendRequest(
          `${BACKEND}/profile`,
          "PUT",
          JSON.stringify(payload),
          {
            "Content-Type": "application/json", // MUST ADD THIS HEADER!
          }
        );
        setUserProfile(responseData.userProfile);
      } catch (err) {
        // console.log(`Profile > updateProfile: ${err.message}`);
        setBottomInfo({
          is_valid: false,
          message_to_show: "Failed to update profile.",
        });
        return;
      }

      // if password, call updatePassword
      if (pass1.length > 0 && pass2.length > 0) {
        const payload = {
          password: pass1,
        };

        try {
          const responseData = await sendRequest(
            `${BACKEND}/password`,
            "PUT",
            JSON.stringify(payload),
            {
              "Content-Type": "application/json", // MUST ADD THIS HEADER!
            }
          );
        } catch (err) {
          // console.log(`Profile > updatePassword: ${err.message}`);
          setBottomInfo({
            is_valid: false,
            message_to_show: "Profile updated password.",
          });
          return;
        }
      }

      // update avatar
      if (imageFile) {
        try {
          const formData = new FormData();
          formData.append("image", imageFile);

          await sendRequest(
            `${BACKEND}/avatar`,
            "PUT",
            formData
            // DON'T add "Content-Type": "application/json" when uploading an image
          );
        } catch (err) {
          // console.log(`Profile > update avatar: ${err.message}`);
          setBottomInfo({
            is_valid: false,
            message_to_show: "Failed to update image.",
          });
          return;
        }
      }

      clearForm();

      setBottomInfo({
        is_valid,
        message_to_show: "Profile updated successfully.",
      });
    } else {
      setBottomInfo({
        is_valid,
        message_to_show: output_message,
      });
    }
  };

  return (
    <div className="flex flex-row justify-center py-5">
      <div className="w-5/6 rounded-xl border bg-white py-3 shadow-lg outline-none">
        <h1 className="pb-2 text-center text-2xl font-light text-black">
          Edit Profile
        </h1>
        <hr className="ml-10 mr-10 px-2 py-3" />
        <div className="mb-7 flex w-full flex-row justify-center">
          <div className="relative h-full w-1/6">
            <input
              type="file"
              ref={filePickerRef}
              style={{ display: "none" }}
              className="hidden"
              accept=".jpg,.png,.jpeg,.gif"
              onChange={imagePickedHandler}
            />
            {previewURL ? (
              <div>
                <img
                  className="h-full w-full rounded-full"
                  src={previewURL}
                  alt="previewImage"
                />
              </div>
            ) : (
              ""
            )}
            {!previewURL ? (
              <img
                className="h-full w-full rounded-full"
                src={userProfile.avatar}
                alt="user avatar"
              />
            ) : (
              ""
            )}

            <div
              className="absolute -right-3 bottom-0.5 h-5 w-5 cursor-pointer"
              onClick={browseImageHandler}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <form className="ml-10 mr-10 mb-28 flex flex-col">
          <div className="flex flex-row justify-center space-x-5">
            <div className="mb-6 w-5/12">
              <label htmlFor="username" className={label_style}>
                Username
                <span className={error_text_style}>
                  {all_error_msg.username}
                </span>
              </label>
              <input
                disabled={true}
                type="username"
                id="username"
                className={diabled_input_style}
                value={userProfile.username}
                onChange={handleUsername}
                data-testid="input_username"
                autoComplete="off"
                aria-autocomplete="none"
              />
            </div>

            <div className="mb-6 w-5/12">
              <label htmlFor="email" className={label_style}>
                Email
              </label>
              <input
                type="email"
                id="email"
                className={input_style}
                placeholder={userProfile.email}
                value={form.email}
                onChange={handleEmail}
                data-testid="input_email"
                autoComplete="off"
                aria-autocomplete="none"
              />
              <div className="block">
                <span className="invisible">
                  {all_error_msg.email ? "" : "placeholder"}
                </span>
                <span className={error_text_style}>{all_error_msg.email}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-center space-x-5">
            <div className="mb-6 w-5/12">
              <label htmlFor="phone_number" className={label_style}>
                Phone Number
              </label>
              <input
                type="text"
                id="phone_number"
                className={input_style}
                placeholder={userProfile.phone}
                value={form.phone_number}
                onChange={handlePhone}
                data-testid="input_phone_number"
                autoComplete="off"
                aria-autocomplete="none"
              />
              <div className="block">
                <span className="invisible">
                  {all_error_msg.phone_number ? "" : "placeholder"}
                </span>
                <span className={error_text_style}>
                  {all_error_msg.phone_number}
                </span>
              </div>
            </div>

            <div className="mb-6 w-5/12">
              <label htmlFor="zip" className={label_style}>
                Zip
              </label>
              <input
                type="text"
                id="zip"
                className={input_style}
                placeholder={userProfile.zip}
                value={form.zip}
                onChange={handleZip}
                data-testid="input_zip"
                autoComplete="off"
                aria-autocomplete="none"
              />
              <div className="block">
                <span className="invisible">
                  {all_error_msg.zip ? "" : "placeholder"}
                </span>
                <span className={error_text_style}>{all_error_msg.zip}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-center space-x-5">
            <div className="mb-6 w-5/12">
              <label htmlFor="password" className={label_style}>
                Password
                <span className={error_text_style}>
                  {all_error_msg.password}
                </span>
              </label>
              <input
                type="password"
                id="password"
                className={input_style}
                value={form.password}
                onChange={handlePassword}
                data-testid="input_password"
                autoComplete="off"
                aria-autocomplete="none"
              />
            </div>

            <div className="mb-6 w-5/12">
              <label htmlFor="password_confirmation" className={label_style}>
                Password Confirmation
                <span className={error_text_style}>
                  {all_error_msg.password_confirmation}
                </span>
              </label>
              <input
                type="password"
                id="password_confirmation"
                className={input_style}
                value={form.password_confirmation}
                onChange={handlePasswordConfirmation}
                data-testid="input_password_confirmation"
                autoComplete="off"
                aria-autocomplete="none"
              />
            </div>
          </div>

          <div className="ml-auto mr-auto flex flex-col md:max-w-xs">
            <p
              className={`block ${
                bottom_info.is_valid
                  ? success_text_style
                  : update_error_text_style
              }`}
              data-testid="bottom_info"
            >
              {bottom_info.message_to_show}
            </p>
            <Button onClick={submitHandler} testid="update_button">
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
