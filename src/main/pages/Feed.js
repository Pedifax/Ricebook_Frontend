import React, { useContext, useEffect, useState } from "react";

import Input from "../../shared/components/form/Input";
import UserCard from "../../shared/components/UserCard/UserCard";
import PostList from "../components/posts/PostList";
import { AppContext } from "../../shared/context/app-context";
import FollowingArea from "../components/followingBox/FollowingArea";
import SearchBar from "../components/searchBar/SearchBar";
import NewArticle from "../components/posts/NewArticle";

const randomDate = (start) => {
  let end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const compareForSorting = (a, b) => {
  if (a.random_seed < b.random_seed) {
    return 1;
  }
  if (a.random_seed > b.random_seed) {
    return -1;
  }
  return 0;
};

const Feed = () => {
  const [final_posts, setFinalPosts] = useState([]);

  // THE LOGGED IN USER: cur_user
  // const cur_user = JSON.parse(localStorage.getItem("cur_user")).loggedInUser[0]; // user obj
  const cur_user = JSON.parse(localStorage.getItem("cur_user")).loggedInUser; // user obj
  console.log("In feed:");
  console.log(cur_user);

  // DUMMY USERS: users
  const users = JSON.parse(localStorage.getItem("users")).responseData; // array

  // DUMMY POSTS: posts
  const posts = JSON.parse(localStorage.getItem("posts")).responseData; // array

  // THE FILTERED POSTS (posts by the current user):
  let cur_user_post = [];

  for (let i = 0; i < posts.length; i++) {
    if (parseInt(posts[i].userId) === parseInt(cur_user.id)) {
      let random_seed = Math.floor(Math.random() * 1623832932732);
      let date = new Date(random_seed).toLocaleDateString();
      posts[i].random_seed = random_seed;
      posts[i].timestamp = date;
      cur_user_post.push(posts[i]);
    }
  }

  // sort:
  cur_user_post.sort(compareForSorting);

  // set:
  useEffect(() => {
    setFinalPosts(cur_user_post);
  }, [setFinalPosts]);

  // search:
  const searchHandler = (keyword) => {
    let acquired_posts = [...final_posts];
    if (keyword) {
      let filtered_posts = [];
      for (let i = 0; i < acquired_posts.length; i++) {
        if (
          cur_user.username.includes(keyword) ||
          acquired_posts[i].body.includes(keyword)
        ) {
          filtered_posts.push(acquired_posts[i]);
        }
      }
      setFinalPosts(filtered_posts);
    } else {
      setFinalPosts(cur_user_post);
    }
  };

  const createPostHandler = (new_post_obj) => {
    cur_user_post.unshift(new_post_obj);
    setFinalPosts(cur_user_post);
  };

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-x-3 md:space-y-0 mt-2 mx-5">
      <div className="flex flex-col w-11/12 h-full md:w-1/4 justify-center self-center order-1 md:order-none md:self-start md:text-center text-center">
        <div className="flex flex-col space-y-2">
          <UserCard
            name={cur_user.username}
            status={cur_user.company.catchPhrase}
            id={cur_user.id}
          />
          {/* <h3>test</h3> */}
          <SearchBar onSearch={searchHandler} />
        </div>
      </div>

      <div className="flex flex-col w-11/12 h-full md:w-1/2 justify-center md:self-top self-center order-3 md:order-none md:self-start md:text-center text-center mt-2 md:mt-2">
        <div>
          {/* Create Post Component */}
          {/* <textarea /> */}
          <NewArticle onSubmit={createPostHandler} cur_user_obj={cur_user} />
          <PostList
            username={cur_user.username}
            // posts={cur_user_post}
            posts={final_posts}
            // posts={posts_after_every_filter}
            onDeletePost={"placeHolder!!"}
          ></PostList>
        </div>
      </div>

      <div className="flex w-11/12 h-full md:w-1/4 justify-center md:self-top self-center order-2 md:order-none md:self-start md:text-center text-center md:mt-2">
        <div>
          <FollowingArea />
        </div>
      </div>
    </div>
    // <div>
    //   <h1 className="text-green-700 text-center">Feed</h1>
    // </div>
  );
};

export default Feed;
