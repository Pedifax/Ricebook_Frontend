import React, { useState, useRef } from "react";
import Button from "../../../shared/components/UIs/Button";

const randomPostID = () => {
  return Math.floor(Math.random() * 1000 + 120);
};

const NewArticle = (props) => {
  const [text_area_content, setTextAreaContent] = useState("");
  const textAreaOnChangeHandler = (event) => {
    setTextAreaContent(event.target.value);
  };
  const filePickerRef = useRef();
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const clearTextArea = () => {
    // console.log("here");
    setTextAreaContent("");
  };

  const handleOnClick = (event) => {
    event.preventDefault();
    if (text_area_content.length === 0) {
      return;
    }

    const create_time = new Date();
    const create_date = create_time.toLocaleDateString();
    const new_random_seed = create_time.getTime();

    const new_post_obj = {
      userId: props.cur_user_obj.id,
      id: randomPostID(),
      title: "new title for the new post",
      body: text_area_content,
      random_seed: new_random_seed,
      timestamp: create_date,
    };

    props.onSubmit(new_post_obj);
    clearTextArea();
  };

  return (
    <div>
      <form>
        <div className="mb-4 w-full bg-white rounded-xl border shadow-md">
          <div className="py-2 px-4 bg-white rounded-t-lg ">
            <label htmlFor="comment" className="sr-only">
              Create a post
            </label>
            <textarea
              id="comment"
              rows="4"
              className="px-0 w-full text-md text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
              placeholder="Create a new post!"
              required
              value={text_area_content}
              onChange={textAreaOnChangeHandler}
            ></textarea>
          </div>
          <div className="flex justify-end items-center py-2 px-3 border-t dark:border-gray-600">
            <Button
              kind="post"
              className="inline-flex items-center left-2"
              onClick={handleOnClick}
            >
              Create
            </Button>
            <Button
              kind="warning"
              className="flex left-2"
              onClick={clearTextArea}
            >
              Clear
            </Button>
            <div className="flex pl-0 space-x-1 sm:pl-2">
              <button
                type="button"
                className="inline-flex justify-self-end p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 "
                onClick={pickImageHandler}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Upload image</span>
              </button>
              <input
                type="file"
                ref={filePickerRef}
                className="hidden"
                accept=".jpg,.png,.jpeg"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewArticle;
