import React, { useState } from "react";

import FollowingCard from "../../../shared/components/UserCard/FollowingCard";
import AddFollowingBar from "./AddFollowingBar";

// const randomID = () => {
//   return Math.floor(Math.random() * 10000 + 20);
// };

const FollowingArea = (props) => {
  const [warning, setWarning] = useState({ show: false, message: "" });
  const createWarning = (signal) => {
    if (signal === "exist") {
      setWarning({ show: true, message: "User doesn't exist." });
    } else if (signal === "followed") {
      setWarning({ show: true, message: "User already followed." });
    }
  };
  const deleteWarning = () => {
    setWarning({ show: false, message: "" });
  };

  // const cur_user = JSON.parse(localStorage.getItem("cur_user")).loggedInUser; // user obj
  const cur_user = JSON.parse(localStorage.getItem("cur_user")); // user obj
  // console.log(cur_user);

  // const users = JSON.parse(localStorage.getItem("users")).responseData; // array
  const users = JSON.parse(localStorage.getItem("users")); // array

  let build_following_list = [];
  if (cur_user.id !== 11) {
    build_following_list = [];
    build_following_list.push(users[(cur_user.id + 0) % 10]);
    build_following_list.push(users[(cur_user.id + 1) % 10]);
    build_following_list.push(users[(cur_user.id + 2) % 10]);
  }
  const [following_users, setFollowingUsers] = useState(build_following_list);

  const unfollowHandler = (id_to_delete) => {
    setFollowingUsers((prev_following_users) =>
      prev_following_users.filter((friend) => friend.id !== id_to_delete)
    );
    let cur_user = JSON.parse(localStorage.getItem("cur_user"));
    let new_following_list = cur_user.following_users.filter(
      (user_id) => user_id !== id_to_delete
    );
    localStorage.setItem(
      "cur_user",
      JSON.stringify({ ...cur_user, following_users: new_following_list })
    );
    props.unFollowHandler();
  };

  const addFollowHandler = (username_to_follow) => {
    let matches = users.filter((user) => user.username === username_to_follow);
    // console.log("matches = ", matches);

    if (matches.length === 1) {
      let new_following_users = [...following_users];
      let cur_user = JSON.parse(localStorage.getItem("cur_user"));
      let cur_user_following_users = cur_user.following_users;

      // handle following user that is already followed
      if (cur_user_following_users.includes(matches[0].id)) {
        createWarning("followed");
        return false;
      }

      new_following_users.unshift(matches[0]);
      setFollowingUsers(new_following_users);

      cur_user_following_users.unshift(matches[0].id);
      localStorage.setItem(
        "cur_user",
        JSON.stringify({
          ...cur_user,
          following_users: cur_user_following_users,
        })
      );
      props.followHandler();
      deleteWarning();
      return true;
    } else {
      // handle no match
      createWarning("exist");
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
        {following_users.map((friend, index) => (
          <FollowingCard
            key={index}
            id={friend.id}
            name={friend.username}
            status={friend.company.catchPhrase}
            onUnFollow={unfollowHandler}
          />
        ))}
      </div>
    </React.Fragment>
  );
};

export default FollowingArea;
