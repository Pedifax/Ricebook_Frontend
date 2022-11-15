import React, { useState } from "react";

import Button from "../UIs/Button";

const UserCard = (props) => {
  const init_status = props.status ? props.status : "Add a new status!";
  const [status, setStatus] = useState(init_status);
  const [text_area_content, setTextAreaContent] = useState("");
  const textAreaOnChangeHandler = (event) => {
    setTextAreaContent(event.target.value);
  };
  const statusUpdateHandler = () => {
    if (text_area_content.length >= 1) {
      props.onStatusChange(text_area_content);
      setStatus(text_area_content);
      setTextAreaContent("");
    }
  };

  let user_id = props.id;
  let url_tail = (Number(user_id) % 2) + 1;

  const content = (
    <React.Fragment>
      <div className="flex-col rounded-xl border bg-white shadow-md md:max-w-sm">
        <div className="flex flex-row">
          <div className="w-1/5 flex-col items-center rounded-xl bg-white py-2 md:flex-row">
            <img
              className="ml-2 h-16 w-16 rounded-full"
              src={require(`../../images/ImagesForDev/UserImages/user_image_${url_tail}.jpeg`)}
              alt=""
            />
          </div>
          <div className="w-4/5 flex-col p-4">
            <div className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
              {props.name}
            </div>
            <div className="font-normal text-gray-700 ">{status}</div>
          </div>
        </div>
        <div className="px-3">
          <input
            type="text"
            className="flex w-full rounded-lg border border-gray-300 bg-gray-50 py-2 text-sm text-gray-900 outline-none focus:border-cyan-400  focus:outline-none focus:ring-cyan-400"
            placeholder="Update status"
            onChange={textAreaOnChangeHandler}
            value={text_area_content}
          />
        </div>
        <div className="flex-row py-2 align-bottom">
          <Button prompt={"Update"} onClick={statusUpdateHandler}>
            Update
          </Button>
        </div>
      </div>
    </React.Fragment>
  );

  return content;
};

export default UserCard;
