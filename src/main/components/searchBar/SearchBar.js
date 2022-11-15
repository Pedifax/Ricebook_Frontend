import React, { useState } from "react";
import Button from "../../../shared/components/UIs/Button";

const SearchBar = (props) => {
  const [input_area_content, setInputAreaContent] = useState("");

  const inputAreaOnChangeHandler = (event) => {
    // console.log("input changed");
    setInputAreaContent(event.target.value);
    props.onSearch(event.target.value);
  };

  const content = (
    <div className="rounded-xl border bg-white px-2 shadow-md md:max-w-sm">
      <div className=" items-center space-x-4 rounded-xl bg-white py-2 md:max-w-sm md:flex-row">
        <input
          type="text"
          className="flex w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 outline-none focus:border-cyan-400  focus:outline-none focus:ring-cyan-400"
          placeholder="🔎 Search by author or text"
          onChange={inputAreaOnChangeHandler}
          value={input_area_content}
          data-testid='search_bar'
        />
        {/* <Button className="w-4/12" onClick={inputAreaOnChangeHandler}>
          Search
        </Button> */}
      </div>
    </div>
  );

  return content;
};

export default SearchBar;
