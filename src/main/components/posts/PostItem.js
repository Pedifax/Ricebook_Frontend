import React, { useState } from "react";

import Button from "../../../shared/components/UIs/Button";

const PostCard = (props) => {
  const [show_more_comment, setShowMoreComment] = useState(false);
  const toggleShowMoreComment = () => {
    setShowMoreComment((prev) => !prev);
  };

  const commentHandler = () => {
    // console.log("comment button clicked");
  };
  const editHandler = () => {
    // console.log("edit button clicked");
  };

  const randomImage = `post_image_${(Number(props.id) % 5) + 1}.png`;

  return (
    <div
      className=" rounded-lg border border-gray-200 bg-white text-left shadow-md"
      data-testid={`post_${props.testid}`}
      placeholder="post_item"
    >
      <div className="">
        <h5
          className="py-2 px-5 text-center text-xl font-bold text-gray-900"
          data-testid={`post_${props.testid}_author`}
          placeholder="post_author"
        >
          {/* {`UserId = ${props.userId} (This is a placeholder) `} */}
          {props.username}
        </h5>
        <hr className="pb-2" />
      </div>
      {!props.text_only && (
        <img
          className="rounded-t-lg"
          src={require("../../../shared/images/ImagesForDev/PostImages/" +
            randomImage)}
          alt=""
        />
      )}
      <div className="p-5 md:flex-col">
        <h5 className="pb-2 text-xl font-bold text-gray-900">
          {/* {`UserId = ${props.userId} (This is a placeholder) `} */}
          {props.title}
        </h5>
        <p className="font-normal text-gray-700">{props.body}</p>
        <div className="py-3">
          {/* 這裡換成 useFormState & <Input> */}
          {/* <textarea className="w-full "></textarea> */}
          <input
            type="text"
            className="text-md flex w-full rounded-lg border border-gray-300 bg-gray-50 py-2 text-gray-900 outline-none focus:border-cyan-400  focus:outline-none focus:ring-cyan-400"
            placeholder="Add comment"
            // onChange={inputAreaOnChangeHandler}
            // value={input_area_content}
          />
        </div>
        <div className="pb-3" id="comment section">
          <div>
            <span className="font-medium">user A</span>: That's awesome!
          </div>
          {show_more_comment && (
            <React.Fragment>
              <div>
                <span className="font-medium">user B</span>: I don't know what
                you're talking about 😪
              </div>
              <div>
                <span className="font-medium">user C</span>: 😊🙏
              </div>
              <div>
                <span className="font-medium">user D</span>: Text me back bruh
              </div>
            </React.Fragment>
          )}
          <div
            className="italic text-gray-500 underline underline-offset-2"
            onClick={toggleShowMoreComment}
            data-testid={`comment_toggle_${props.testid}`}
          >
            {show_more_comment ? "show less" : "show more"}
          </div>
        </div>
        <div className="flex flex-row justify-end space-x-2 md:w-full">
          <Button kind="comment" onClick={commentHandler}>
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
