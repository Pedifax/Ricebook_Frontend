import React, { useEffect, useState, useContext } from "react";

import UserCard from "../../shared/components/UserCard/UserCard";
import PostList from "../components/posts/PostList";
import FollowingArea from "../components/followingBox/FollowingArea";
import SearchBar from "../components/searchBar/SearchBar";
import NewArticle from "../components/posts/NewArticle";
import { AppContext } from "../../shared/context/app-context";
import { useHttpRequest } from "../../shared/hooks/http-request-hook";
const BACKEND = process.env.REACT_APP_BACKEND_URL;

const Feed = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpRequest();
  const appContext = useContext(AppContext);
  const username = appContext.loggedUsername;
  const [userProfile, setUserProfile] = useState({});
  const [searchFilter, setSearchFilter] = useState("");
  const [updateToggle, setUpdateToggle] = useState(true);

  useEffect(() => {
    const obtainProfile = async () => {
      try {
        const responseData = await sendRequest(`${BACKEND}/profile`);
        setUserProfile(responseData.profileObject);
      } catch (err) {
        // console.log(`Feed > Error when obtaining userProfileObj: ${err}`);
      }
    };
    obtainProfile();
  }, []);

  const toggleFeedUpdate = () => {
    setUpdateToggle((prev) => !prev);
  };

  const searchHandler = (keyword) => {
    setSearchFilter(keyword);
  };

  const followHandler = () => {
    toggleFeedUpdate();
  };

  const statusChangeHandler = async (new_status) => {
    const payload = { headline: new_status };
    try {
      const responseData = await sendRequest(
        `${BACKEND}/headline`,
        "PUT",
        JSON.stringify(payload),
        {
          "Content-Type": "application/json", // MUST ADD THIS HEADER!
        }
      );
      setUserProfile((prev) => ({
        ...prev,
        headline: responseData.headline,
      }));
    } catch (err) {
      // console.log(
      //   `Feed > updateHeadline: Error when obtaining userProfileObj: ${err}`
      // );
    }
  };

  return (
    <div className="flex flex-col space-y-4 m-5 md:flex-row md:space-x-3 md:space-y-0">
      <div className="order-1 flex h-full w-11/12 flex-col justify-center self-center text-center md:order-none md:w-1/4 md:flex-row md:self-start md:text-center">
        <div className="flex w-full flex-col space-y-2">
          <UserCard
            username={username}
            status={userProfile.headline}
            avatar={userProfile.avatar}
            onStatusChange={statusChangeHandler}
          />
          <SearchBar onSearch={searchHandler} />
        </div>
      </div>

      <div className="order-3 flex h-full w-11/12 flex-col justify-center self-center text-center md:order-none md:w-1/2 md:self-start md:text-center">
        <div className="w-full">
          <PostList updateToggle={updateToggle} searchFilter={searchFilter} />
        </div>
      </div>

      <div className="order-2 flex h-full w-11/12 flex-col justify-center self-center text-center md:order-none md:w-1/4 md:flex-row md:self-start md:text-center">
        <div className="w-full">
          <FollowingArea onFollow={followHandler} />
        </div>
      </div>
    </div>
  );
};

export default Feed;
