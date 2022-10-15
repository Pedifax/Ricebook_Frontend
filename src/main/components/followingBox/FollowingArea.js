import React, { useState } from "react";

import FollowingCard from "../../../shared/components/UserCard/FollowingCard";
import AddFollowingBar from "./AddFollowingBar";

const randomID = () => {
  return Math.floor(Math.random() * 10000 + 20);
};

const FollowingArea = () => {
  const cur_user = JSON.parse(localStorage.getItem("cur_user")).loggedInUser; // user obj
  console.log(cur_user);

  const users = JSON.parse(localStorage.getItem("users")).responseData; // array

  let build_following_list = [];
  if (cur_user.id !== 11) {
    build_following_list = [];
    build_following_list.push(users[(cur_user.id + 0) % 10]);
    build_following_list.push(users[(cur_user.id + 1) % 10]);
    build_following_list.push(users[(cur_user.id + 2) % 10]);
  }

  const [following_users, setFollowingUsers] = useState(build_following_list);

  const unfollowHandler = (id_to_delete) => {
    console.log(`id_to_delete = ${id_to_delete}`);
    setFollowingUsers((prev_following_users) =>
      prev_following_users.filter((friend) => friend.id !== id_to_delete)
    );
  };

  const addFollowHandler = (username_to_follow) => {
    // console.log(`id_to_add = ${id_to_add}`);

    // setFollowingUsers((prev) => ({
    //   ...prev,
    //   new_obj,
    // }));

    let new_person_obj = {
      id: randomID(),
      name: username_to_follow,
      company: {
        catchPhrase: "I really love COMP 531 course.",
      },
    };

    let new_following_users = [...following_users];
    new_following_users.unshift(new_person_obj);
    setFollowingUsers(new_following_users);
  };

  return (
    <React.Fragment>
      <div className="flex flex-col space-y-2">
        <AddFollowingBar onFollow={addFollowHandler} />

        {following_users.map((friend, index) => (
          <FollowingCard
            key={index}
            id={friend.id}
            name={friend.name}
            status={friend.company.catchPhrase}
            onUnFollow={unfollowHandler}
          />
        ))}
      </div>
    </React.Fragment>
  );
};

export default FollowingArea;
