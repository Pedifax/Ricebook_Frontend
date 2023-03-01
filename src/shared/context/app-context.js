import { createContext } from "react";

export const AppContext = createContext({
  // Auth
  isLoggedIn: false,
  loggedUsername: null,
  token: null,
  login: () => {},
  logout: () => {},
});
