import { React, useState, useEffect, useContext } from "react";

import Button from "../../../shared/components/UIs/Button";
import { AppContext } from "../../../shared/context/app-context";
import { useHttpRequest } from "../../../shared/hooks/http-request-hook";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const Comment = (props) => {
  // const comment = props.comment;
  const [comment, setComment] = useState(props.comment);
  const appContext = useContext(AppContext);
  const loggedUsername = appContext.loggedUsername;
  const { isLoading, error, sendRequest, clearError } = useHttpRequest();
  const [avatar, setAvatar] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editionText, setEditionText] = useState(comment.text);
  const EditionTextChangeHandler = (event) => {
    setEditionText(event.target.value);
  };

  useEffect(() => {
    const getAvatar = async () => {
      try {
        const responseData = await sendRequest(
          `${BACKEND}/avatar/${comment.username}`
        );
        setAvatar(responseData.avatar);
      } catch (err) {
        // console.log(`Comment > Error when getFeedArticles(): ${err}`);
      }
    };
    getAvatar();
  }, []);

  const clickEditHandler = async () => {
    if (comment.username !== loggedUsername) {
      return;
    }
    setIsEditMode(true);
  };

  const editComment = async () => {
    const payload = {
      text: editionText,
      commentId: comment.cid,
    };
    let updatedComment;
    try {
      const responseData = await sendRequest(
        `${BACKEND}/articles/${props.pid}`,
        "PUT",
        JSON.stringify(payload),
        {
          "Content-Type": "application/json", // MUST ADD THIS HEADER!
        }
      );
      updatedComment = responseData.updatedCommentText;
      setComment((oldComment) => ({ ...oldComment, text: updatedComment }));
      setIsEditMode(false);
    } catch (err) {
      // console.log("Comment > editHandler:  " + err);
    }
  };

  return (
    <div className="flex flex-row">
      {/* grid grid-cols-2 grid-rows-1 justify-items-stretch */}
      <div className="flex w-full flex-row">
        {/* justify-self-stretch */}
        <div className="mr-2 w-1/12 self-center">
          <img className="h-12 w-12 rounded-full" src={avatar} alt="" />
        </div>
        {isEditMode ? (
          <div className="flex w-11/12 flex-col rounded-lg p-2">
            <input
              type="text"
              className="text-md w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-900 outline-none focus:border-cyan-400  focus:outline-none focus:ring-cyan-400"
              placeholder="Edit comment"
              onChange={EditionTextChangeHandler}
              value={editionText}
            />
          </div>
        ) : (
          <div className="my-1 flex flex-col rounded-lg bg-gray-100 p-2">
            <div className="w-full text-lg font-semibold">
              {comment.username}
            </div>
            <div className="">{comment.text}</div>
          </div>
        )}
      </div>
      <div className="self-center">
        {/* justify-self-end */}
        {isEditMode ? (
          <Button onClick={editComment} className="justify-end">
            Update!
          </Button>
        ) : comment.username === loggedUsername ? (
          <Button
            kind="lowkey"
            onClick={clickEditHandler}
            className="justify-end"
          >
            Edit
          </Button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Comment;
