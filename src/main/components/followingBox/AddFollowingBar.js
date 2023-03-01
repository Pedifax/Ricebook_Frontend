import React, { useState } from "react";

import Button from "../../../shared/components/UIs/Button";

const AddFollowingBar = (props) => {
  const [input_area_content, setInputAreaContent] = useState("");

  const inputAreaOnChangeHandler = (event) => {
    setInputAreaContent(event.target.value);
  };

  const followClickHandler = (username_to_follow) => {
    let isSuccessful = props.onFollow(username_to_follow);
    if (isSuccessful) {
      setInputAreaContent("");
    }
  };

  const content = (
    <React.Fragment>
      <div className="flex rounded-xl border bg-white px-2 shadow-md">
        <div className="flex w-full flex-row items-center justify-center space-x-4 rounded-xl bg-white py-2">
          <div className="w-2/3">
            <input
              type="text"
              className="flex w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 outline-none focus:border-cyan-400  focus:outline-none focus:ring-cyan-400"
              placeholder="Follow others by username"
              onChange={inputAreaOnChangeHandler}
              value={input_area_content}
              data-testid="follow_bar"
            />
          </div>
          <div className="w-1/3">
            <Button
              onClick={() => {
                followClickHandler(input_area_content);
              }}
              testid="follow_button"
            >
              Follow
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );

  return content;
};

export default AddFollowingBar;
