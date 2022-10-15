import React, { useState } from "react";

import Button from "../UIs/Button";

const FollowingCard = (props) => {
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
          <div className=" flex flex-col text-center justify-between p-4 leading-normal">
            <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 ">
              {props.name}
            </h5>
            <p className="font-normal text-gray-700 ">{props.status}</p>
          </div>
        </div>
        <div className="align-bottom flex-row">
          <Button
            kind="warning"
            prompt={"Remove"}
            onClick={() => {
              props.onUnFollow(props.id);
            }}
          >
            UnFollow
          </Button>
        </div>
      </div>
    </React.Fragment>
  );

  return content;
};

export default FollowingCard;
