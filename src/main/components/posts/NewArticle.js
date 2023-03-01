import React, { useState, useRef, useEffect } from "react";
import Button from "../../../shared/components/UIs/Button";
import { Redirect, useHistory } from "react-router-dom";

import { AppContext } from "../../../shared/context/app-context";
import { useHttpRequest } from "../../../shared/hooks/http-request-hook";
const BACKEND = process.env.REACT_APP_BACKEND_URL;

const NewArticle = (props) => {
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpRequest();
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState();
  const [previewURL, setPreviewURL] = useState();
  const [textOnly, setTextOnly] = useState(false);
  const [warning, setWarning] = useState({ show: false, message: "" });

  const bodyOnChangeHandler = (event) => {
    setBody(event.target.value);
  };

  const titleOnChangeHandler = (event) => {
    setTitle(event.target.value);
  };

  const textonlyHandler = () => {
    setTextOnly((prev) => {
      if (!prev) {
        setPreviewURL(null);
        setImageFile(null);
      }
      return !prev;
    });
  };

  /*             */
  /* File Upload */
  /*             */
  const filePickerRef = useRef();
  const browseImageHandler = () => {
    filePickerRef.current.click();
  };
  const imagePickedHandler = (event) => {
    setImageFile(event.target.files[0]);
  };

  useEffect(() => {
    // image preview
    if (!imageFile) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewURL(fileReader.result);
    };
    fileReader.readAsDataURL(imageFile);
  }, [imageFile]);
  /*             */
  /* File Upload */
  /*             */

  const clearInputArea = (event) => {
    // event.preventDefault();
    setTitle("");
    setBody("");
    setPreviewURL(null);
    setImageFile(null);
    setWarning({ show: false, message: "" });
  };

  const createArticle = async (event) => {
    // event.preventDefault();

    if (body.trim().length === 0) {
      setWarning({
        show: true,
        message: "Post content can't be empty.",
      });
      return;
    }

    if (!textOnly && !imageFile) {
      setWarning({
        show: true,
        message: "Should upload an image when 'Text Only' is not selected.",
      });
      return;
    }

    if (textOnly) {
      const payload = {
        title,
        text: body,
        textOnly: true,
      };

      try {
        await sendRequest(
          `${BACKEND}/article_text`,
          "POST",
          JSON.stringify(payload),
          {
            "Content-Type": "application/json", // MUST ADD THIS HEADER!
          }
        );
        setWarning({ show: false, message: "" });
        clearInputArea();
        props.onCreateArticle();
      } catch (err) {
        // console.log(`NewArticle > createArticle (text only): ${err.message}`);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("text", body);
        formData.append("image", imageFile);

        await sendRequest(
          `${BACKEND}/article`,
          "POST",
          formData
          // {
          //   "Content-Type": "multipart/form-data",
          // }
        );
        setWarning({ show: false, message: "" });
        clearInputArea();
        props.onCreateArticle();
      } catch (err) {
        // console.log(`NewArticle > createArticle (with image): ${err.message}`);
      }
    }
  };

  return (
    <div>
      <div>
        <div className="w-full rounded-xl border bg-white shadow-lg outline-none">
          <div className="rounded-t-lg bg-white py-2 px-4 ">
            <label htmlFor="title" className="sr-only">
              Title
            </label>
            <textarea
              id="title"
              rows="1"
              className="text-md w-full resize-none border-0 bg-white px-0 font-medium text-gray-900 focus:ring-0"
              placeholder="Title"
              value={title}
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
              className="text-md w-full border-0 bg-white px-0 font-light text-gray-900 focus:ring-0"
              placeholder="Share something?"
              value={body}
              onChange={bodyOnChangeHandler}
              data-testid="new_post_body"
            ></textarea>
          </div>

          {previewURL ? (
            <div>
              <img src={previewURL} alt="previewImage" />
            </div>
          ) : (
            ""
          )}

          <div className="flex justify-between border-t py-2 px-3">
            <div className="flex flex-row self-center">
              <div className="flex self-center rounded p-2 hover:bg-gray-200">
                <input
                  id="textOnly_checkbox"
                  type="checkbox"
                  defaultChecked={textOnly}
                  className="self-center rounded border-gray-300 bg-gray-100 text-cyan-400 focus:ring-0 focus:ring-offset-0"
                  onChange={textonlyHandler}
                />
                <label
                  htmlFor="textOnly_checkbox"
                  className="ml-2 text-sm text-gray-500"
                >
                  Text Only
                </label>
              </div>

              <div
                className={`block cursor-pointer self-center justify-self-end  rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 sm:pl-2 ${
                  textOnly ? "invisible" : ""
                }`}
                onClick={browseImageHandler}
              >
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
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
                <input
                  type="file"
                  ref={filePickerRef}
                  style={{ display: "none" }}
                  className="hidden"
                  accept=".jpg,.png,.jpeg,.gif"
                  onChange={imagePickedHandler}
                />
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Button
                kind="post"
                className="left-2 inline-flex items-center"
                onClick={createArticle}
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
            </div>
          </div>
        </div>
      </div>
      <div>
        {warning.show && (
          <div
            className="mt-2 rounded-lg bg-red-100 p-4 text-sm text-red-700"
            role="alert"
          >
            {warning.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArticle;
