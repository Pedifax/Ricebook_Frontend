import { useState, useCallback, useEffect } from "react";

import { useHttpRequest } from "./http-request-hook";
const BACKEND = process.env.REACT_APP_BACKEND_URL;

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUsername, setLoggedUsername] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpRequest();

  const login = useCallback((username) => {
    setIsLoggedIn(true);
    setLoggedUsername(username);
  }, []);

  const logout = useCallback(async () => {
    try {
      const responseData = await sendRequest(
        `${BACKEND}/logout`,
        "PUT"
      );
      setIsLoggedIn(false);
      setLoggedUsername(null);
    } catch (err) {
      // console.log(`Logout failed: ${err}`);
    }
  }, []);

  useEffect(() => {
    const cookieLogin = async () => {
      try {
        const responseData = await sendRequest(
          `${BACKEND}/auto_login`,
          "GET",
          null,
          {
            isAutoLogin: true,
          }
        );
        // console.log(`Successfully auto-logged in '${responseData.username}'`);
        login(responseData.username);
      } catch (err) {
        // console.log(`AutoLogin failed at cookieLogin(): ${err}`);
      }
    };
    cookieLogin();
  }, []);

  return { isLoggedIn, loggedUsername, login, logout };
};
