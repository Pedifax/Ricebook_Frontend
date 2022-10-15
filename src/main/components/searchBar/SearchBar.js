import React, { useState } from "react";
import Button from "../../../shared/components/UIs/Button";

const SearchBar = (props) => {
  const [input_area_content, setInputAreaContent] = useState("");

  const inputAreaOnChangeHandler = (event) => {
    setInputAreaContent(event.target.value);
    props.onSearch(event.target.value);
  };

  const content = (
    <React.Fragment>
      <div className="md:max-w-sm  flex-col items-center bg-white rounded-xl border shadow-md">
        <div className="md:flex-row md:max-w-sm flex flex-col items-center bg-white rounded-xl ">
          <input
            type={"text"}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-400 focus:border-cyan-400 block w-8/12  outline-none focus:outline-none"
            placeholder="🔎"
            onChange={inputAreaOnChangeHandler}
            value={input_area_content}
          />
          <Button className="w-4/12 p-2" onClick={inputAreaOnChangeHandler}>
            Search
          </Button>
        </div>
      </div>
    </React.Fragment>
  );

  return content;
};

export default SearchBar;
