import { render, screen, cleanup } from "@testing-library/react";
import user from "@testing-library/user-event";
import { AppContext } from "./shared/context/app-context";
import App from "./App";
import { users } from "./dummy_API/users";
import { posts } from "./dummy_API/posts";
import { cur_user } from "./dummy_API/cur_user";
import { loggedInUser } from "./dummy_API/loggedInUser";

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.

it("Should render <App />", () => {
  render(<App />);
});

it("Should logout a user", async () => {
  user.setup();

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("posts", JSON.stringify(posts));
  localStorage.setItem("cur_user", JSON.stringify(cur_user));
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

  render(<App />);

  const logout_button = screen.getByTestId("logout_button");
  expect(logout_button).toBeInTheDocument();
  await user.click(logout_button);

  // here it should show login page
  const titleElement = screen.getByTestId("auth_title");
  expect(titleElement).toBeInTheDocument();
  expect(titleElement.textContent).toBe("Login");
  const hr = screen.getByTestId("hr");
  expect(hr).toBeInTheDocument();
  const input_username = screen.getByTestId("input_username");
  expect(input_username).toBeInTheDocument();

  localStorage.clear();
});
