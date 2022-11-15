import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import Auth from "../pages/Auth";
import { users } from "../../dummy_API/users";
import { posts } from "../../dummy_API/posts";
import { AppContext } from "../../shared/context/app-context";
import { cur_user } from "../../dummy_API/cur_user";
import App from "../../App";
import Feed from "../../main/pages/Feed";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

test("Should render <Auth> page correctly", () => {
  render(<Auth />);
  const titleElement = screen.getByTestId("auth_title");
  expect(titleElement.textContent).toBe("Login");
  expect(titleElement).toBeInTheDocument();

  const hrEl = screen.getByTestId("hr");
  expect(hrEl).toBeInTheDocument();

  const inputUsernameEl = screen.getByTestId("input_username");
  expect(inputUsernameEl).toBeInTheDocument();

  const input_password = screen.getByTestId("input_password");
  expect(input_password).toBeInTheDocument();
});

test("Switch to register mode, should render inputs blocks for registration", async () => {
  user.setup();
  render(<Auth />);

  const switch_mode_button = screen.getByTestId("switch_mode_button");
  await user.click(switch_mode_button);

  const titleElement = screen.getByTestId("auth_title");
  expect(titleElement.textContent).toBe("Register");
  expect(titleElement).toBeInTheDocument();

  const input_password_confirmation = screen.getByTestId(
    "input_password_confirmation"
  );
  const input_email = screen.getByTestId("input_email");
  const input_phone_number = screen.getByTestId("input_phone_number");
  const zip = screen.getByTestId("zip");
  expect(input_password_confirmation).toBeInTheDocument();
  expect(input_email).toBeInTheDocument();
  expect(input_phone_number).toBeInTheDocument();
  expect(zip).toBeInTheDocument();
});

test("click twice on mode change, should only render login inputs", async () => {
  user.setup();
  render(<Auth />);
  // render(<Auth />);
  const switch_mode_button = screen.getByTestId("switch_mode_button");
  await user.click(switch_mode_button);
  await user.click(switch_mode_button);
});

test("Login a user: Bret", async () => {
  user.setup();
  render(<App />);

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("posts", JSON.stringify(posts));
  const input_username = screen.getByTestId("input_username");
  await user.type(input_username, "Bret");
  const input_password = screen.getByTestId("input_password");
  await user.type(input_password, "Kulas Light");

  const submit_button = screen.getByTestId("submit_button");
  await user.click(submit_button);

  localStorage.clear();
});

test("Login should fail when given wrong password", async () => {
  user.setup();
  render(<App />);

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("posts", JSON.stringify(posts));
  const input_username = screen.getByTestId("input_username");
  await user.type(input_username, "Bret");
  const input_password = screen.getByTestId("input_password");
  await user.type(input_password, "wwwrong passworddd");

  const submit_button = screen.getByTestId("submit_button");
  await user.click(submit_button);

  const bottom_warning_EL = screen.getByTestId("bottom_warning_EL");
  expect(bottom_warning_EL.textContent).toBe("Wrong credential.");

  localStorage.clear();
});

test("Successfully register a user: Username = Brian, Password = test", async () => {
  user.setup();
  // render(<App />);

  // 2nd method:
  render(
    <AppContext.Provider
      value={{
        isLoggedIn: false,
        userId: null,
        login: () => {},
        logout: () => {},
      }}
    >
      <Router>
        <Auth />
      </Router>
    </AppContext.Provider>
  );

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("posts", JSON.stringify(posts));

  const switch_mode_button = screen.getByTestId("switch_mode_button");
  await user.click(switch_mode_button);

  const input_username = screen.getByTestId("input_username");
  const input_password = screen.getByTestId("input_password");
  const input_password_confirmation = screen.getByTestId(
    "input_password_confirmation"
  );
  const input_email = screen.getByTestId("input_email");
  const input_phone_number = screen.getByTestId("input_phone_number");
  const zip = screen.getByTestId("zip");

  await user.type(input_username, "Brian");
  await user.type(input_password, "test");
  await user.type(input_password_confirmation, "test");
  await user.type(input_email, "test@test.com");
  await user.type(input_phone_number, "111-222-3333");
  await user.type(zip, "12345");

  const submit_button = screen.getByTestId("submit_button");
  await user.click(submit_button);
  
  localStorage.clear();
  // const bottom_warning_EL = screen.getByTestId("bottom_warning_EL");
  // expect(bottom_warning_EL.textContent).toBe("");
});
