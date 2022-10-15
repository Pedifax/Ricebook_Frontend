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
      <div className="flex flex-col text-center w-1/4 bg-white space-y-1 py-3 rounded-xl border shadow-md place-content-center">
        {/* <div className="md:flex-row md:max-w-sm flex flex-col items-center bg-white rounded-xl "> */}
        <img
          className="w-1/3 m-auto rounded-full"
          src={require(`../../images/ImagesForDev/UserImages/user_image_${url_tail}.jpeg`)}
          alt=""
        />
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 p-4">
          {props.name}
        </h5>
        <div className="align-bottom flex-row flex">
          <button
            type="button"
            className="m-auto flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 "
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
