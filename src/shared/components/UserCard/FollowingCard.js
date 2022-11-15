import React, { useState } from "react";

import Button from "../UIs/Button";

const FollowingCard = (props) => {
  let user_id = props.id;
  let url_tail = (Number(user_id) % 2) + 1;

  const content = (
    <React.Fragment>
      <div className="flex-col items-center rounded-xl border bg-white shadow-md md:max-w-sm">
        <div className="flex flex-col items-center justify-around rounded-xl bg-white md:max-w-sm md:flex-row ">
          <img
            className="ml-2 mt-2 h-16 w-16 rounded-full"
            src={require(`../../images/ImagesForDev/UserImages/user_image_${url_tail}.jpeg`)}
            alt=""
          />
          <div className=" flex flex-col p-4 text-center leading-normal">
            <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 ">
              {props.name}
            </h5>
            <p className="font-normal text-gray-700 ">{props.status}</p>
          </div>
        </div>
        <div className="flex-row py-2 align-bottom">
          <Button
            kind="warning"
            prompt={"Remove"}
            onClick={() => {
              props.onUnFollow(props.id);
            }}
            testid={`${props.name}_unfollow_button`}
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
