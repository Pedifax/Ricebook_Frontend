import { createContext } from "react";

export const AppContext = createContext({
  // Auth
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => {
    this.isLoggedIn = true;
  },
  logout: () => {},

  // Posts
  posts: null,
  addPost: () => {},

  // Users
  users: null,
  addUser: () => {},
});
