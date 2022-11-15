import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Auth from "./auth/pages/Auth";
import Feed from "./main/pages/Feed";
import Profile from "./profile/pages/Profile";
import NavigationBar from "./shared/components/navigations/NavigationBar";
import { AppContext } from "./shared/context/app-context";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const login = useCallback((userId) => {
    setIsLoggedIn(true);
    setLoggedUserId(userId);
    localStorage.setItem("loggedInUser", JSON.stringify({ id: userId }));
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setLoggedUserId(null);
    let stored_headline = localStorage.getItem("stored_headline");
    localStorage.clear();
    localStorage.setItem("stored_headline", stored_headline);
  }, []);

  useEffect(() => {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      login(loggedInUser.id);
    }
  }, [login]);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Feed />
        </Route>

        <Route path="/feed" exact>
          <Feed />
        </Route>

        <Route path="/profile" exact>
          <Profile />
        </Route>

        <Redirect to="/feed" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Auth />
        </Route>

        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AppContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: loggedUserId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <NavigationBar />
        {routes}
      </Router>
    </AppContext.Provider>
  );
};

export default App;
