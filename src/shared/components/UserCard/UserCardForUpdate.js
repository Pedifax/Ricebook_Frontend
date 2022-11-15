import React, { useState, useRef } from "react";

import Button from "../UIs/Button";

const UserCardForUpdate = (props) => {
  const init_status = props.status ? props.status : "I'm feeling sleepy today.";
  const [status, setStatus] = useState(init_status);
  const [text_area_content, setTextAreaContent] = useState("");
  const textAreaOnChangeHandler = (event) => {
    setTextAreaContent(event.target.value);
  };
  const statusUpdateHandler = () => {
    setStatus(text_area_content);
    setTextAreaContent("");
  };

  const filePickerRef = useRef();
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  let user_id = props.id;
  let url_tail = (Number(user_id) % 2) + 1;

  const content = (
    <React.Fragment>
      <div className="flex w-1/4 flex-col place-content-center space-y-1 rounded-xl border bg-white py-3 text-center shadow-md" placeholder="user_card">
        {/* <div className="md:flex-row md:max-w-sm flex flex-col items-center bg-white rounded-xl "> */}
        <img
          className="m-auto w-1/3 rounded-full"
          src={require(`../../images/ImagesForDev/UserImages/user_image_${url_tail}.jpeg`)}
          alt=""
        />
        <h5 className="mb-2 p-4 text-2xl font-bold tracking-tight text-gray-900" placeholder="username">
          {props.name}
        </h5>
        <h5 className="mb-2 text-lg text-gray-900 ">
          Birthday: {props.birthday}
        </h5>
        <div className="flex flex-row align-bottom">
          <button
            type="button"
            className="m-auto flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 "
            onClick={pickImageHandler}
          >
            <svg
              aria-hidden="true"
              className="w-2/12"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Upload image</span>
          </button>
          <input
            type="file"
            ref={filePickerRef}
            className="hidden"
            accept=".jpg,.png,.jpeg"
          />
        </div>
      </div>
    </React.Fragment>
  );

  return content;
};

export default UserCardForUpdate;
