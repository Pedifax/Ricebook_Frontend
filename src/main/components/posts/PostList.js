import React from "react";

import PostItem from "./PostItem";

const PostList = (props) => {
  if (props.posts.length === 0) {
    return (
      <div className="">
        <h2 className="bg-red-300 text-black">
          No existing post from you and following users. Create one?
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* props.posts要改成filter過後的posts */}
      {props.posts.map((post) => (
        <PostItem
          text_only={false || post.text_only}
          key={post.id} // 1 ~ 40
          id={post.id} // 1 ~ 40
          userId={post.userId}
          username={post.username}
          title={post.title}
          body={post.body}
          timestamp={post.timestamp}
          testid={post.id} // 1 ~ 40
        />
      ))}
    </div>
  );
};

export default PostList;
