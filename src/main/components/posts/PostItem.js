import React from "react";

import Button from "../../../shared/components/UIs/Button";

const PostCard = (props) => {
  const commentHandler = () => {
    console.log("comment button clicked");
  };
  const editHandler = () => {
    console.log("edit button clicked");
  };

  const randomImage = `post_image_${(Number(props.id) % 5) + 1}.png`;

  return (
    <div className=" bg-white rounded-lg border border-gray-200 shadow-md text-left">
      <img
        className="rounded-t-lg"
        src={require("../../../shared/images/ImagesForDev/PostImages/" +
          randomImage)}
        alt=""
      />
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            {/* {`UserId = ${props.userId} (This is a placeholder) `} */}
            {props.username}
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {props.body}
        </p>
        <div>
          {/* 這裡換成 useFormState & <Input> */}
          <textarea className="w-full "></textarea>
        </div>
        <div className="flex flex-row justify-end w-full ">
          <Button
            className="flex justify-between"
            kind="comment"
            onClick={commentHandler}
          >
            Comment
          </Button>
          <Button className="" kind="update" onClick={editHandler}>
            Edit
          </Button>
          <Button className="flex justify-end" kind="warning">
            {props.timestamp}
          </Button>
        </div>
      </div>
    </div>
  );
};

const PostItem = (props) => {
  return (
    <React.Fragment>
      <PostCard {...props} />
    </React.Fragment>
  );
};

export default PostItem;
