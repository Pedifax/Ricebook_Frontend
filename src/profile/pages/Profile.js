import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";

import { validate } from "../../shared/tools/validators";
// import Input from "../../shared/components/form/Input";
import Button from "../../shared/components/UIs/Button";
// import { useFormState } from "../../shared/hooks/form-state-hook";
// import { AppContext } from "../../shared/context/app-context";
// import UserCard from "../../shared/components/UserCard/UserCard";
import UserCardForUpdate from "../../shared/components/UserCard/UserCardForUpdate";

// const passwordStar = (target) => {
//   return "*".repeat(target.length);
// };

const input_style =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-400 focus:border-cyan-400 block w-full p-2";
const label_style =
  "block mb-1 ml-2 text-md font-medium text-gray-900 dark:text-gray-300";
const error_text_style = "ml-6 mt-2 text-xs md:text-sm text-red-400";
const update_error_text_style = "m-auto text-xs md:text-lg text-red-400";
const success_text_style = "m-auto text-xs md:text-lg text-green-400";

const Profile = () => {
  // THE LOGGED IN USER: cur_user
  const [cur_user, setCurUser] = useState({});
  const [all_error_msg, setAllErrorMsg] = useState({
    username: "",
    password: "",
    password_confirmation: "",
    email: "",
    phone_number: "",
    zip: "",
  });
  const [bottom_info, setBottomInfo] = useState({
    is_valid: true,
    message_to_show: "",
  });

  useEffect(() => {
    // setCurUser(JSON.parse(localStorage.getItem("cur_user")).loggedInUser);
    setCurUser(JSON.parse(localStorage.getItem("cur_user")));
  }, []);

  useEffect(() => {}, [cur_user]);

  const handleUsername = (e) => {
    e.preventDefault();
    let new_value = e.target.value;
    setCurUser((prevState) => ({ ...prevState, username: new_value }));
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
    setCurUser((prevState) => ({
      ...prevState,
      address: { ...prevState.address, street: new_value },
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
    setCurUser((prevState) => ({
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
    let new_value = e.target.value;
    setCurUser((prevState) => ({ ...prevState, email: new_value }));
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
    setCurUser((prevState) => ({ ...prevState, phone: new_value }));

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
    setCurUser((prevState) => ({
      ...prevState,
      address: { ...prevState.address, zipcode: new_value },
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

  /*
  const [all_error_msg, setAllErrorMsg] = useState({
    username: "",
    password: "",
    password_confirmation: "",
    email: "",
    phone_number: "",
    zip: "",
  }); 
  */

  const submitHandler = (e) => {
    e.preventDefault();

    // INIT:

    let cur_form = {
      ...cur_user,
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
    let pass1 = cur_form.address.street;
    let pass2 = cur_form.password_confirmation;

    // VALIDATE:
    for (let i = 0; i < list_to_check.length; i++) {
      is_valid = is_valid && !list_to_check[i];
      if (list_to_check[i]) {
        output_message += list_to_check[i] + " ";
      }
    }

    if (pass1 !== pass2) {
      is_valid = false;
      output_message += "Passwords mismatch.";
    }

    // OUTPUT
    if (is_valid) {
      // console.log("success");
      output_message = "Profile updated successfully.";
    } else {
      // console.log("fail");
    }

    setBottomInfo({
      is_valid,
      message_to_show: output_message,
    });
  };

  return (
    <React.Fragment>
      <h1 className="mt-3 text-center text-lg text-black">Profile</h1>
      <hr className="ml-10 mr-10 mb-5" />
      <div className="flex place-content-center">
        <UserCardForUpdate
          name={cur_user.username === undefined ? "" : cur_user.username}
          id={cur_user.id === undefined ? "" : cur_user.id}
          birthday="1970/10/27"
        />
      </div>
      <form className="ml-10 mr-10 mt-2">
        <div className="mb-6">
          <label htmlFor="username" className={label_style}>
            Username
            <span className={error_text_style}>{all_error_msg.username}</span>
          </label>
          <input
            disabled={true}
            type="username"
            id="username"
            className={input_style}
            value={cur_user.username === undefined ? "" : cur_user.username}
            onChange={handleUsername}
            data-testid="input_username"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className={label_style}>
            Password
            <span className={error_text_style}>{all_error_msg.password}</span>
          </label>
          <input
            type="password"
            id="password"
            className={input_style}
            value={
              cur_user.address === undefined ? "" : cur_user.address.street
            }
            onChange={handlePassword}
            data-testid="input_password"
          />
        </div>

        <div className="mb-6">
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
            value={
              cur_user.password_confirmation === undefined
                ? ""
                : cur_user.password_confirmation
            }
            onChange={handlePasswordConfirmation}
            data-testid="input_password_confirmation"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className={label_style}>
            Email
            <span className={error_text_style}>{all_error_msg.email}</span>
          </label>
          <input
            type="email"
            id="email"
            className={input_style}
            value={cur_user.email === undefined ? "" : cur_user.email}
            onChange={handleEmail}
            data-testid="input_email"
          />
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div className="mb-6">
            <label htmlFor="phone_number" className={label_style}>
              Phone Number
              <span className={error_text_style}>
                {all_error_msg.phone_number}
              </span>
            </label>
            <input
              type="text"
              id="phone_number"
              className={input_style}
              value={cur_user.phone === undefined ? "" : cur_user.phone}
              onChange={handlePhone}
              data-testid="input_phone_number"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="zip" className={label_style}>
              Zip
              <span className={error_text_style}>{all_error_msg.zip}</span>
            </label>
            <input
              type="text"
              id="zip"
              className={input_style}
              value={
                cur_user.address === undefined ? "" : cur_user.address.zipcode
              }
              onChange={handleZip}
              data-testid="input_zip"
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
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </React.Fragment>
  );
};

export default Profile;
