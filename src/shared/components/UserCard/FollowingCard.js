import React, { useEffect, useState } from "react";

import Button from "../UIs/Button";
import { useHttpRequest } from "../../hooks/http-request-hook";
const BACKEND = process.env.REACT_APP_BACKEND_URL;

const FollowingCard = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpRequest();
  const [headline, setHeadline] = useState("");
  const [avatar, setAvatar] = useState("");
  const username = props.username;

  useEffect(() => {
    const getInfo = async () => {
      try {
        let avatar_response = await sendRequest(
          `${BACKEND}/avatar/${username}`
        );
        let headline_response = await sendRequest(
          `${BACKEND}/headline/${username}`
        );
        setAvatar(avatar_response.avatar);
        setHeadline(headline_response.headline);
      } catch (err) {
        // console.log(
        //   `FollowingCard > getInfo(): Error when obtaining ${username}'s headline or avatar: ${err}`
        // );
      }
    };
    getInfo();
  }, []);

  const content = (
    <React.Fragment>
      <div className="flex-col items-center rounded-xl border bg-white shadow-md md:max-w-sm">
        <div className="flex flex-col items-center justify-around rounded-xl bg-white md:max-w-sm md:flex-row ">
          <img
            className="ml-2 mt-2 h-16 w-16 rounded-full"
            src={avatar}
            alt=""
          />
          <div className=" flex flex-col p-4 text-center leading-normal">
            <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 ">
              {username}
            </h5>
            <p className="font-normal text-gray-700 ">{headline}</p>
          </div>
        </div>
        <div className="flex-row py-2 align-bottom">
          <Button
            kind="warning"
            prompt={"Remove"}
            onClick={() => {
              props.onUnFollow(username);
            }}
            testid={`${username}_unfollow_button`}
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
