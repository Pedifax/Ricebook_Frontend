import React, { useState, useEffect, useContext, useCallback } from "react";

import Button from "../../../shared/components/UIs/Button";
import Comment from "./Comment";
import { useHttpRequest } from "../../../shared/hooks/http-request-hook";
import { AppContext } from "../../../shared/context/app-context";
import { comment } from "postcss";
const BACKEND = process.env.REACT_APP_BACKEND_URL;

const PostItem = (props) => {
  const appContext = useContext(AppContext);
  const loggedUsername = appContext.loggedUsername;
  const { isLoading, error, sendRequest, clearError } = useHttpRequest();
  const [avatar, setAvatar] = useState("");
  const [article, setArticle] = useState(props.article);
  const [showComment, setShowComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [numOfComments, setNumOfComments] = useState(article.comments.length);
  const [isEditMode, setIsEditMode] = useState(false);
  const [edittedArticle, setEdittedArticle] = useState({
    title: article.title,
    text: article.text,
  });

  const newCommentChangeHandler = (event) => {
    setNewComment(event.target.value);
  };
  const newTitleHandler = (event) => {
    setEdittedArticle((prev) => ({
      ...prev,
      title: event.target.value,
    }));
  };
  const newTextHandler = (event) => {
    setEdittedArticle((prev) => ({
      ...prev,
      text: event.target.value,
    }));
  };

  const toggleShowComment = () => {
    setShowComment((prev) => !prev);
  };

  useEffect(() => {
    const getAvatar = async () => {
      try {
        const responseData = await sendRequest(
          `${BACKEND}/avatar/${article.author}`
        );
        setAvatar(responseData.avatar);
      } catch (err) {
        // console.log(`PostItem > Error when getFeedArticles(): ${err}`);
      }
    };
    getAvatar();
  }, []);

  const commentHandler = async () => {
    if (newComment.trim().length === 0) {
      return;
    }
    const payload = {
      text: newComment,
      commentId: -1,
    };
    try {
      const responseData = await sendRequest(
        `${BACKEND}/articles/${article.pid}`,
        "PUT",
        JSON.stringify(payload),
        {
          "Content-Type": "application/json", // MUST ADD THIS HEADER!
        }
      );
      let updatedArticle = responseData.articles;
      setArticle(updatedArticle);
      setNumOfComments(updatedArticle.comments.length);
      setNewComment("");
      if (!showComment) toggleShowComment();
    } catch (err) {
      // console.log("PostItem > commentHandler:  " + err);
    }
  };

  const editClickHandler = () => {
    setIsEditMode(true);
  };

  const editCancelHandler = () => {
    setIsEditMode(false);
  };

  const deletePostHandler = async () => {
    try {
      const responseData = await sendRequest(
        `${BACKEND}/articles/${article.pid}`,
        "DELETE"
      );
      props.onDeletePost();
    } catch (err) {
      // console.log("PostItem > deletePostHandler:  " + err);
    }
  };

  const editPost = async () => {
    if (edittedArticle.text.trim().length === 0) {
      return;
    }

    const payload = {
      title: edittedArticle.title,
      text: edittedArticle.text,
    };
    try {
      const responseData = await sendRequest(
        `${BACKEND}/articles/${article.pid}`,
        "PUT",
        JSON.stringify(payload),
        {
          "Content-Type": "application/json", // MUST ADD THIS HEADER!
        }
      );
      let updatedArticle = responseData.articles;
      setArticle(updatedArticle);
      setIsEditMode(false);
    } catch (err) {
      // console.log("PostItem > commentHandler:  " + err);
    }
  };

  return (
    <div
      className=" rounded-lg border border-gray-200 bg-white px-5 py-2 text-left shadow-lg "
      data-testid={`post_${props.testid}`}
      placeholder="post_item" // placeholders are for Jest testing. Don't delete.
    >
      <div className="flex justify-between py-2">
        <div className="flex flex-row">
          <div className="">
            <img
              className="h-16 w-16 rounded-full"
              src={avatar}
              alt={`${article.author} avatar`}
            />
          </div>
          <div className="flex flex-col">
            <div className="py-2">
              <h5
                className="self-center px-2 text-xl font-medium text-gray-900"
                data-testid={`post_${props.testid}_author`}
                placeholder="post_author"
              >
                {article.author}
              </h5>
            </div>
            <div>
              <p className="self-center px-2 text-center text-sm text-gray-600">
                {article.timestamp}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="float-right self-center">
            {article.author === loggedUsername ? (
              isEditMode ? (
                <div className="flex flex-row space-x-2">
                  <div
                    onClick={deletePostHandler}
                    className="rounded-lg border-0 bg-red-200 p-2 hover:cursor-pointer hover:border-gray-200 hover:bg-red-400 focus:outline-none"
                  >
                    <svg
                      className="h-6 w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </div>
                  <div
                    onClick={editPost}
                    className="rounded-lg border-0 bg-green-100 p-2 hover:cursor-pointer hover:border-gray-200 hover:bg-green-300 focus:outline-none"
                  >
                    <svg
                      className="h-6 w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div
                    onClick={editCancelHandler}
                    className="rounded-lg border-0 bg-gray-100 p-2 hover:cursor-pointer hover:border-gray-200 hover:bg-gray-200 focus:outline-none"
                  >
                    <svg
                      className="h-6 w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                </div>
              ) : (
                <div
                  onClick={editClickHandler}
                  className="rounded-lg border-0 bg-gray-50 p-2 ring-cyan-400 hover:cursor-pointer hover:border-gray-200 hover:bg-gray-200 focus:outline-none"
                >
                  <svg
                    className="text-md h-6 w-6 text-center font-medium"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    ></path>
                  </svg>
                </div>
              )
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <div className="md:flex-col">
        <div>
          <div className="w-full">
            {isEditMode ? (
              <div className="flex w-full flex-row rounded-lg py-2">
                <div className="w-full">
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-50 bg-gray-50 text-3xl font-medium text-gray-900 outline-none focus:border-cyan-400  focus:outline-none focus:ring-cyan-400"
                    placeholder="Edit Title"
                    onChange={newTitleHandler}
                    value={edittedArticle.title}
                  />
                </div>
              </div>
            ) : article ? ( // to avoid article === null
              article.title ? (
                <div>
                  <h5 className="pt-2 text-3xl font-medium text-gray-900">
                    {article.title}
                  </h5>
                </div>
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </div>
          <div>
            {isEditMode ? (
              <div className="flex w-full flex-row rounded-lg py-2">
                <div className="w-full">
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-50 bg-gray-50 text-2xl font-light text-gray-900 outline-none focus:border-cyan-400  focus:outline-none focus:ring-cyan-400"
                    placeholder="Edit Title"
                    onChange={newTextHandler}
                    value={edittedArticle.text}
                  />
                </div>
              </div>
            ) : (
              <p className="py-2 text-2xl font-light text-gray-800">
                {article.text}
              </p>
            )}
          </div>
        </div>

        {article.image !== undefined ? (
          <div className="">
            <img
              className=""
              src={article.image}
              alt={`image for post ${article.pid}`}
            />
          </div>
        ) : (
          ""
        )}

        <div className="flex flex-row py-3">
          {/* <div className="w-3/4"> */}
          <input
            type="text"
            className="text-md  w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-900 outline-none focus:border-cyan-400  focus:outline-none focus:ring-cyan-400"
            placeholder="Add comment"
            onChange={newCommentChangeHandler}
            value={newComment}
          />
          <div className="ml-2 ">
            <Button kind="lowkey" onClick={commentHandler}>
              Comment
            </Button>
          </div>
        </div>
        <div className="" id="comment section">
          {showComment &&
            article.comments.map((comment) => (
              <Comment
                key={comment.cid}
                pid={article.pid}
                comment={comment}
                testid={comment.cid}
              />
            ))}
          {/* <div className="" data-testid={`comment_toggle_${props.testid}`}>
            <Button kind="lowkey_pxless" onClick={toggleShowComment}> */}
          {numOfComments > 0 ? (
            showComment ? (
              <div className="" data-testid={`comment_toggle_${props.testid}`}>
                <Button kind="lowkey_pxless" onClick={toggleShowComment}>
                  Hide comments
                </Button>
              </div>
            ) : (
              <div className="" data-testid={`comment_toggle_${props.testid}`}>
                <Button kind="lowkey_pxless" onClick={toggleShowComment}>
                  Show all {numOfComments} comment
                  {numOfComments > 1 ? "s" : ""}
                </Button>
              </div>
            )
          ) : (
            ""
          )}
          {/* </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PostItem;
