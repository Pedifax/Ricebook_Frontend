import React, { useState, useRef } from "react";
import Button from "../../../shared/components/UIs/Button";

const randomPostID = () => {
  return Math.floor(Math.random() * 1000 + 120);
};

const NewArticle = (props) => {
  const [body_content, setBodyContent] = useState("");
  const bodyOnChangeHandler = (event) => {
    setBodyContent(event.target.value);
  };
  const [title_content, setTitleContent] = useState("");
  const titleOnChangeHandler = (event) => {
    setTitleContent(event.target.value);
  };

  const [text_only, setTextOnly] = useState(false);
  const textonlyHandler = () => {
    setTextOnly((prev) => !prev);
  };

  const filePickerRef = useRef();
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const clearInputArea = () => {
    // console.log("here");
    setTitleContent("");
    setBodyContent("");
  };

  const handleOnClick = (event) => {
    event.preventDefault();
    if (body_content.length === 0) {
      return;
    }

    const create_time = new Date();
    const create_date = create_time.toLocaleDateString();
    const new_random_seed = create_time.getTime();

    const new_post_obj = {
      userId: props.cur_user_obj.id,
      username: props.cur_user_obj.username,
      id: randomPostID(),
      title: title_content,
      body: body_content,
      random_seed: new_random_seed,
      timestamp: create_date,
      text_only,
    };

    props.onSubmit(new_post_obj);
    clearInputArea();
  };

  return (
    <div>
      <form>
        <div className="w-full rounded-xl border bg-white shadow-md outline-none">
          <div className="rounded-t-lg bg-white py-2 px-4 ">
            <label htmlFor="title" className="sr-only">
              Title
            </label>
            <textarea
              id="title"
              rows="1"
              className="text-md w-full border-0 bg-white px-0 text-gray-900 focus:ring-0 "
              placeholder="Title"
              required
              value={title_content}
              onChange={titleOnChangeHandler}
              data-testid="new_post_title"
            ></textarea>
            <hr />
            <label htmlFor="comment" className="sr-only">
              Create a post
            </label>
            <textarea
              id="comment"
              rows="4"
              className="text-md w-full border-0 bg-white px-0 text-gray-900 focus:ring-0"
              placeholder="Share something"
              required
              value={body_content}
              onChange={bodyOnChangeHandler}
              data-testid="new_post_body"
            ></textarea>
          </div>
          {/* <div className="flex flex-row "> */}

          <div className="flex justify-between space-x-3 border-t py-2 px-3">
            <div className="flex justify-center self-center">
              <input
                id="text_only_checkbox"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-cyan-400 focus:ring-0 focus:ring-offset-0"
                onChange={textonlyHandler}
              />
              <label
                htmlFor="text_only_checkbox"
                className="ml-2 text-sm text-gray-500"
              >
                Text Only
              </label>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Button
                kind="post"
                className="left-2 inline-flex items-center"
                onClick={handleOnClick}
                testid="create_new_post_button"
              >
                Create
              </Button>
              <Button
                kind="warning"
                className="left-2 flex"
                onClick={clearInputArea}
              >
                Clear
              </Button>
              <div className="flex space-x-1 pl-0 sm:pl-2">
                <button
                  type="button"
                  className="inline-flex cursor-pointer justify-self-end rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 "
                  onClick={pickImageHandler}
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
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
        </div>
      </form>
    </div>
  );
};

export default NewArticle;
