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
import { useAuth } from "./shared/hooks/auth-hook";
import { AppContext } from "./shared/context/app-context";

const App = () => {
  const { isLoggedIn, loggedUsername, login, logout } = useAuth();
  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Feed />
        </Route>

        {/* <Route path="/feed" exact>
          <Feed />
        </Route> */}

        <Route path="/profile" exact>
          <Profile />
        </Route>

        {/* <Redirect to="/feed" /> */}
        <Redirect to="/" />
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
        loggedUsername: loggedUsername,
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
