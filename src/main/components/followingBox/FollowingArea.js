import React, { useEffect, useState, useContext } from "react";

import FollowingCard from "../../../shared/components/UserCard/FollowingCard";
import AddFollowingBar from "./AddFollowingBar";
import { AppContext } from "../../../shared/context/app-context";
import { useHttpRequest } from "../../../shared/hooks/http-request-hook";
import { create } from "react-test-renderer";
const BACKEND = process.env.REACT_APP_BACKEND_URL;

const FollowingArea = (props) => {
  const appContext = useContext(AppContext);
  const { isLoading, error, sendRequest, clearError } = useHttpRequest();
  const username = appContext.loggedUsername;
  const [warning, setWarning] = useState({ show: false, message: "" });
  const [followingUsers, setFollowingUsers] = useState([]);

  useEffect(() => {
    const getFollowing = async () => {
      try {
        const responseData = await sendRequest(`${BACKEND}/following`, "GET");
        setFollowingUsers(responseData.following);
      } catch (err) {
        // console.log(
        //   `FollowingArea > Error when obtaining following users: ${err}`
        // );
      }
    };
    getFollowing();
  }, []);

  const createWarning = (signal) => {
    if (signal === "exist") {
      setWarning({ show: true, message: "User doesn't exist." });
    } else if (signal === "followed") {
      setWarning({ show: true, message: "User already followed." });
    } else if (signal === "self") {
      setWarning({ show: true, message: "Cannot follow yourself." });
    } else if (signal === "blank") {
      setWarning({ show: true, message: "User can't be blank." });
    }
  };
  const deleteWarning = () => {
    setWarning({ show: false, message: "" });
  };

  const unfollowHandler = async (username_to_delete) => {
    try {
      const responseData = await sendRequest(
        `${BACKEND}/following/${username_to_delete}`,
        "DELETE"
      );
      setFollowingUsers(responseData.following);
      props.onFollow();
    } catch (err) {
      // console.log(
      //   `FollowingCard > unFollowHandler(): Error when unfollowing ${username}: ${err}`
      // );
    }
  };

  const addFollowHandler = async (username_to_follow) => {
    if (username_to_follow.length === 0) {
      createWarning("blank");
      return false;
    } else if (username_to_follow === username) {
      createWarning("self");
      return false;
    }
    try {
      const responseData = await sendRequest(
        `${BACKEND}/following/${username_to_follow}`,
        "PUT"
      );
      setFollowingUsers(responseData.following);
      deleteWarning();
      props.onFollow();
      return true;
    } catch (err) {
      if (err.message.includes("Could not find the user to follow")) {
        createWarning("exist");
      } else if (err.message.includes("Target user already followed")) {
        createWarning("followed");
      } else {
        // console.log(
        //   `FollowingArea > addFollowHandler: Error when following users: ${err}`
        // );
      }
      return false;
    }
  };

  return (
    <React.Fragment>
      <div className="flex flex-col space-y-2">
        <AddFollowingBar onFollow={addFollowHandler} />
        {warning.show && (
          <div
            className="rounded-lg bg-red-100 p-4 text-sm text-red-700"
            role="alert"
          >
            {warning.message}
          </div>
        )}
        {followingUsers.map((username) => (
          <FollowingCard
            key={username} // vital!
            username={username}
            onUnFollow={unfollowHandler}
          />
        ))}
      </div>
    </React.Fragment>
  );
};

export default FollowingArea;
