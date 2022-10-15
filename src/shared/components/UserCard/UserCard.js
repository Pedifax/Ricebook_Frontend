import React, { useState } from "react";

import Button from "../UIs/Button";

const UserCard = (props) => {
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

  let user_id = props.id;
  let url_tail = (Number(user_id) % 2) + 1;

  const content = (
    <React.Fragment>
      <div className="md:max-w-sm  flex-col items-center bg-white rounded-xl border shadow-md">
        <div className="md:flex-row md:max-w-sm flex flex-col items-center bg-white rounded-xl ">
          <img
            className="w-16 h-16 ml-2 rounded-full"
            src={require(`../../images/ImagesForDev/UserImages/user_image_${url_tail}.jpeg`)}
            alt=""
          />
          <div className=" flex flex-col text-center self-start justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
              {props.name || "Doge San"}
            </h5>
            <p className="font-normal text-gray-700 ">{status}</p>
          </div>
        </div>
        <div className="align-bottom flex-row">
          <textarea
            className="w-11/12 justify-center"
            placeholder={text_area_content}
            onChange={textAreaOnChangeHandler}
            value={text_area_content}
          />
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
