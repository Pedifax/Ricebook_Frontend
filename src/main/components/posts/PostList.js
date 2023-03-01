import React, { useEffect, useState, useCallback } from "react";

import PostItem from "./PostItem";
import NewArticle from "./NewArticle";
import { useHttpRequest } from "../../../shared/hooks/http-request-hook";
import Button from "../../../shared/components/UIs/Button";
const BACKEND = process.env.REACT_APP_BACKEND_URL;

const PostList = (props) => {
  const searchFilter = props.searchFilter;
  const { isLoading, error, sendRequest, clearError } = useHttpRequest();
  const [completeArticles, setCompleteArticles] = useState([]);
  const [articles, setArticles] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  const getFeedArticles = async (toFilter = null) => {
    let keyword = null;
    if (toFilter) {
      keyword = toFilter;
    }
    let path = `feedArticles/${pageNumber}${keyword ? `/${keyword}` : ""}`;
    try {
      const responseData = await sendRequest(`${BACKEND}/${path}`);
      setArticles(responseData.articles);
    } catch (err) {
      // console.log(`PostList > Error when getFeedArticles(): ${err}`);
    }
  };

  const nextPage = () => {
    setPageNumber((p) => p + 1);
  };

  const previousPage = () => {
    setPageNumber((p) => p - 1);
  };

  useEffect(() => {
    getFeedArticles(props.searchFilter);
  }, [pageNumber]);

  useEffect(() => {
    getFeedArticles();
  }, []);

  useEffect(() => {
    getFeedArticles();
  }, [props.updateToggle]); // activates when follow or unfollow happens

  useEffect(() => {
    getFeedArticles(props.searchFilter);
    // We show the search result from the very beginning, i.e., page 1
    setPageNumber(1);
  }, [props.searchFilter]); // activates when searching

  const deletePostHandler = () => {
    getFeedArticles();
  };

  const createArticleHandler = () => {
    getFeedArticles();
  };

  return (
    <React.Fragment>
      <div className="mb-4 w-full">
        <NewArticle onCreateArticle={createArticleHandler} />
      </div>
      {articles.length === 0 ? (
        <h2 className="rounded-lg bg-red-100 p-4 text-sm text-red-700">
          No post to show.
        </h2>
      ) : (
        <div className="flex flex-col space-y-4">
          {articles.map((article) => (
            <PostItem
              key={article.pid}
              article={article}
              testid={article.pid}
              onDeletePost={deletePostHandler}
            />
          ))}
        </div>
      )}

      <div className="flex flex-row justify-center space-x-5 py-5">
        <Button
          onClick={previousPage}
          className={`block w-1/4 bg-white ${
            pageNumber > 1 ? "" : "invisible"
          }`}
        >
          <div className="flex flex-col justify-center">
            <div>Previous</div>
            <div className="self-center">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </div>
          </div>
        </Button>
        <Button
          onClick={nextPage}
          className={`block w-1/4 bg-white ${
            articles.length > 0 ? "" : "invisible"
          }`}
        >
          <div className="flex flex-col justify-center">
            <div>Next</div>
            <div className="self-center">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </div>
        </Button>
      </div>
    </React.Fragment>
  );
};

export default PostList;
