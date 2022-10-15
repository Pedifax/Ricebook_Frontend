import React from "react";

import PostItem from "./PostItem";

const PostList = (props) => {
  if (props.posts.length === 0) {
    return (
      <div className="">
        <h2 className="bg-red-300 text-black">
          No places found. Maybe create one?
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* props.posts要改成filter過後的posts */}
      {props.posts.map((post) => (
        <PostItem
          key={post.id}
          id={post.id}
          userId={post.userId}
          username={props.username}
          title={post.title}
          body={post.body}
          timestamp={post.timestamp}
        />
      ))}
    </div>
  );
};

export default PostList;
