import React, { useEffect, useState } from "react";

import UserCard from "../../shared/components/UserCard/UserCard";
import PostList from "../components/posts/PostList";
import FollowingArea from "../components/followingBox/FollowingArea";
import SearchBar from "../components/searchBar/SearchBar";
import NewArticle from "../components/posts/NewArticle";

const compareForSorting = (a, b) => {
  if (a.random_seed < b.random_seed) {
    return 1;
  }
  if (a.random_seed > b.random_seed) {
    return -1;
  }
  return 0;
};

const getUsernameById = (user_id) => {
  const users = JSON.parse(localStorage.getItem("users")); // array
  let found_user = users.find((user) => user.id === user_id);

  return found_user.username;
};

const Feed = () => {
  const [final_posts, setFinalPosts] = useState([]);
  const [static_posts, setStaticPosts] = useState([]);

  // THE LOGGED IN USER:
  const cur_user = JSON.parse(localStorage.getItem("cur_user")); // user obj

  // get the updated headline from localStorage
  const stored_headline = JSON.parse(localStorage.getItem("stored_headline"));
  if (!!stored_headline) {
    if (stored_headline.username === cur_user.username) {
      cur_user.company.catchPhrase = stored_headline.headline;
    }
  }

  // DUMMY POSTS: posts
  const posts = JSON.parse(localStorage.getItem("posts")); // array

  useEffect(() => {
    // We only want this to run at the first entry, not at the following re-renders.
    // -> for id = 1 ~ 10, following list = 3 users originally. For id = 11, it's empty
    let following_users = [];
    if (cur_user.id <= 10) {
      following_users.push((cur_user.id + 1) % 10);
      following_users.push((cur_user.id + 2) % 10);
      following_users.push((cur_user.id + 3) % 10);
    }
    localStorage.setItem(
      "cur_user",
      JSON.stringify({ ...cur_user, following_users })
    );
    // eslint-disable-next-line
  }, []);

  const filterAndSortPosts = () => {
    let posts_to_show = [];
    // THE FILTERED POSTS (posts by the current user):
    const cur_user = JSON.parse(localStorage.getItem("cur_user")); // user obj

    // console.log("Inside filterAndSortPosts, cur_user =");
    // console.log(cur_user);

    posts_to_show = []; // empty the array

    for (let i = 0; i < posts.length; i++) {
      if (
        parseInt(posts[i].userId) === parseInt(cur_user.id) ||
        cur_user.following_users.includes(parseInt(posts[i].userId))
      ) {
        let random_seed = Math.floor(Math.random() * 1623832932732);
        let date = new Date(random_seed).toLocaleDateString();
        posts[i].random_seed = random_seed;
        posts[i].timestamp = date;
        if (parseInt(posts[i].userId) === parseInt(cur_user.id)) {
          posts[i].username = cur_user.username;
        } else {
          posts[i].username = getUsernameById(posts[i].userId);
        }
        posts_to_show.push(posts[i]);
      }
    }

    // sort:
    posts_to_show.sort(compareForSorting);
    // console.log("In filterAndSortPosts(), after sorting: posts_to_show =");
    // console.log(posts_to_show);

    setFinalPosts(posts_to_show);
    setStaticPosts(posts_to_show);
    return posts_to_show;
  };

  // set:
  useEffect(() => {
    filterAndSortPosts(filterAndSortPosts());
    // eslint-disable-next-line
  }, []);

  const followHandler = () => {
    // filterAndSortPosts(posts_to_show);
    filterAndSortPosts();
  };

  const unFollowHandler = () => {
    // filterAndSortPosts(posts_to_show);
    filterAndSortPosts();
  };

  // search:
  const searchHandler = (keyword) => {
    let acquired_posts = [...static_posts];

    // console.log("Inside searchHandler, acquired_posts=");
    // console.log(acquired_posts);

    if (keyword) {
      let filtered_posts = [];
      for (let i = 0; i < acquired_posts.length; i++) {
        if (
          acquired_posts[i].username.includes(keyword) ||
          acquired_posts[i].body.includes(keyword)
        ) {
          filtered_posts.push(acquired_posts[i]);
        }
      }
      setFinalPosts(filtered_posts);
    } else {
      // setFinalPosts(posts_to_show);
      // console.log("Inside searchHandler, posts_to_show=");
      // console.log(acquired_posts);
      setFinalPosts(static_posts);
    }
  };

  const createPostHandler = (new_post_obj) => {
    // posts_to_show.unshift(new_post_obj);
    // setFinalPosts(posts_to_show);
    let new_posts = [...final_posts];
    new_posts.unshift(new_post_obj);
    setFinalPosts(new_posts);
    // console.log("in createPostHandler, new_post_obj = ");
    // console.log(new_post_obj);
    // console.log(new_posts);
  };

  const statusChangeHandler = (new_status) => {
    let updated_cur_user = {
      ...cur_user,
      company: {
        ...cur_user.company,
        catchPhrase: new_status,
      },
    };

    let new_stored_headline = {
      username: cur_user.username,
      headline: new_status,
    };

    localStorage.setItem("cur_user", JSON.stringify(updated_cur_user));

    // update this for persistent headline through logins and logouts
    localStorage.setItem(
      "stored_headline",
      JSON.stringify(new_stored_headline)
    );
  };

  return (
    <div className="m-2 flex flex-col space-y-4 md:m-5 md:flex-row md:space-x-3 md:space-y-0">
      <div className="order-1 flex h-full w-11/12 flex-col justify-center self-center text-center md:order-none md:w-1/4 md:flex-row md:self-start md:text-center">
        <div className="flex flex-col space-y-2">
          <UserCard
            name={cur_user.username}
            status={cur_user.company.catchPhrase}
            id={cur_user.id}
            onStatusChange={statusChangeHandler}
          />
          <SearchBar onSearch={searchHandler} />
        </div>
      </div>

      <div className="order-3 flex h-full w-11/12 flex-col justify-center self-center text-center md:order-none md:w-1/2 md:self-start md:text-center">
        <div className="mb-4">
          <NewArticle onSubmit={createPostHandler} cur_user_obj={cur_user} />
        </div>
        <div>
          <PostList
            posts={final_posts}
            onDeletePost={"placeHolder!!"}
          ></PostList>
        </div>
      </div>

      <div className="order-2 flex h-full w-11/12 flex-col justify-center self-center text-center md:order-none md:w-1/4 md:flex-row md:self-start md:text-center">
        <div>
          <FollowingArea
            unFollowHandler={unFollowHandler}
            followHandler={followHandler}
            cur_user={cur_user}
          />
        </div>
      </div>
    </div>
  );
};

export default Feed;
