import { render, screen, within } from "@testing-library/react";
import user from "@testing-library/user-event";
import { cur_user } from "../../dummy_API/cur_user";
import Profile from "../pages/Profile";

let input_username,
  input_password,
  input_password_confirmation,
  input_email,
  input_phone_number,
  input_zip;

beforeEach(() => {
  localStorage.setItem("cur_user", JSON.stringify(cur_user));
  render(<Profile />);

  input_username = screen.getByTestId("input_username");
  input_password = screen.getByTestId("input_password");
  input_password_confirmation = screen.getByTestId(
    "input_password_confirmation"
  );
  input_email = screen.getByTestId("input_email");
  input_phone_number = screen.getByTestId("input_phone_number");
  input_zip = screen.getByTestId("input_zip");
});

afterEach(() => {
  localStorage.clear();
});

test("Should fetch the user's profile username", () => {
  // cur_user = Bret

  const user_card = screen.getByPlaceholderText("user_card");
  const username_on_card = within(user_card).getByPlaceholderText("username");
  expect(username_on_card.textContent).toBe("Bret");
  expect(input_username.value).toBe("Bret");
  expect(input_password.value).toBe("Kulas Light");
  expect(input_password_confirmation.value).toBe("");
  expect(input_email.value).toBe("Sincere@april.biz");
  expect(input_phone_number.value).toBe("1-770-736-8031 x56442");
  expect(input_zip.value).toBe("92998-3874");
});

test("Should be able to update profile if given valid inputs", async () => {
  user.setup();

  await user.clear(input_password);
  await user.type(input_password, "123");
  await user.type(input_password_confirmation, "123");
  await user.clear(input_email);
  await user.type(input_email, "test@test.com");
  await user.clear(input_phone_number);
  await user.type(input_phone_number, "111-222-3333");
  await user.clear(input_zip);
  await user.type(input_zip, "66666");

  const update_button = screen.getByTestId("update_button");
  expect(update_button).toBeInTheDocument();

  // click update
  await user.click(update_button);

  // check update prompt
  const bottom_info = screen.getByTestId("bottom_info");
  expect(bottom_info.textContent).toBe("Profile updated successfully.");
});

test("Should give correct error message when given invalid inputs", async () => {
  user.setup();

  await user.type(input_password, "123");
  await user.type(input_password_confirmation, "123");
  await user.clear(input_email);
  await user.type(input_email, "test@test.com");
  await user.clear(input_phone_number);
  await user.type(input_phone_number, "111-222-3333");
  await user.clear(input_zip);
  await user.type(input_zip, "66666");

  const update_button = screen.getByTestId("update_button");
  expect(update_button).toBeInTheDocument();

  // click update
  await user.click(update_button);

  // check update prompt
  const bottom_info = screen.getByTestId("bottom_info");
  expect(bottom_info.textContent).toBe("Passwords mismatch.");
});
