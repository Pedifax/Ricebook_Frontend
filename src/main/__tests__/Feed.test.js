import { render, screen, within } from "@testing-library/react";
import user from "@testing-library/user-event";
import { users } from "../../dummy_API/users";
import { posts } from "../../dummy_API/posts";
import { cur_user } from "../../dummy_API/cur_user";
import Feed from "../pages/Feed";

test("fetch and render correct articles for current logged in user: Bret", () => {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("posts", JSON.stringify(posts));
  localStorage.setItem("cur_user", JSON.stringify(cur_user));
  render(<Feed />);

  // now there should be 40 posts, and only certain users:
  const Bret_following = ["Bret", "Karianne", "Samantha", "Antonette"];
  for (let i = 1; i <= 40; i++) {
    let post_to_find = screen.getByTestId(`post_${i}`);
    expect(post_to_find).toBeInTheDocument();
    let post_author = within(post_to_find).getByTestId(`post_${i}_author`);
    expect(Bret_following).toContainEqual(post_author.textContent);
  }

  localStorage.clear();
});

test("Should use a stored headline (for persistent headline)", () => {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("posts", JSON.stringify(posts));
  localStorage.setItem("cur_user", JSON.stringify(cur_user));
  localStorage.setItem(
    "stored_headline",
    JSON.stringify({
      username: "Bret",
      headline: "A stroed headline for testing.",
    })
  );
  render(<Feed />);

  localStorage.clear();
});

test("Comment toggle", async () => {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("posts", JSON.stringify(posts));
  localStorage.setItem("cur_user", JSON.stringify(cur_user));
  user.setup();
  render(<Feed />);

  const post_1 = screen.getByTestId("post_1");
  expect(post_1).toBeInTheDocument();
  const comment_toggle_1 = within(post_1).getByTestId("comment_toggle_1");
  expect(comment_toggle_1).toBeInTheDocument();
  await user.click(comment_toggle_1);

  const userB = within(post_1).getByText(/user B/i);
  const userC = within(post_1).getByText(/user C/i);
  const userD = within(post_1).getByText(/user D/i);

  expect(userB).toBeInTheDocument();
  expect(userC).toBeInTheDocument();
  expect(userD).toBeInTheDocument();

  localStorage.clear();
});

test("Should filter displayed articles by keyword", async () => {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("posts", JSON.stringify(posts));
  localStorage.setItem("cur_user", JSON.stringify(cur_user));
  user.setup();
  render(<Feed />);

  // type a keyword: Bret (author), NO NEED to click anything
  const search_bar = screen.getByTestId("search_bar");
  expect(search_bar).toBeInTheDocument();
  await user.type(search_bar, "Antonette");
  expect(search_bar.value).toBe("Antonette");

  // query all posts, should only be 11 results (10 posts + 1 following_user card)
  const all_about_Antonette = screen.getAllByText(/Antonette/);
  expect(all_about_Antonette.length).toBe(11);

  const all_about_Karianne = screen.getAllByText(/Karianne/);
  expect(all_about_Karianne.length).toBe(1);

  const all_about_Samantha = screen.getAllByText(/Samantha/);
  expect(all_about_Samantha.length).toBe(1);

  const all_about_Bret = screen.getAllByText(/Bret/);
  expect(all_about_Bret.length).toBe(1);

  localStorage.clear();
});

test("Should add articles when adding a follower: Kamren", async () => {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("posts", JSON.stringify(posts));
  localStorage.setItem("cur_user", JSON.stringify(cur_user));
  user.setup();
  render(<Feed />);

  // type a keyword: Bret (author), NO NEED to click anything
  const follow_bar = screen.getByTestId("follow_bar");
  const follow_button = screen.getByTestId("follow_button");
  await user.type(follow_bar, "Kamren");
  await user.click(follow_button);

  // query all posts from Kamren, should only be 11 results (10 posts + 1 following_user card)
  const all_about_Kamren = screen.getAllByText(/Kamren/);
  expect(all_about_Kamren.length).toBe(11);
});

test("Should remove articles when removing a follower: Antonette", async () => {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("posts", JSON.stringify(posts));
  localStorage.setItem("cur_user", JSON.stringify(cur_user));
  user.setup();
  render(<Feed />);

  const Antonette_unfollow_button = screen.getByTestId(
    "Antonette_unfollow_button"
  );
  await user.click(Antonette_unfollow_button);

  const all_posts = screen.getAllByPlaceholderText("post_item");
  for (let i = 0; i < all_posts.length; i++) {
    const author = within(all_posts[i]).getByPlaceholderText("post_author");
    expect(author.textContent).not.toBe("Antonette");
  }

  localStorage.clear();
});

test("Should create a new post successfully", async () => {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("posts", JSON.stringify(posts));
  localStorage.setItem("cur_user", JSON.stringify(cur_user));
  user.setup();
  render(<Feed />);

  const new_post_title = screen.getByTestId("new_post_title");
  const new_post_body = screen.getByTestId("new_post_body");
  const create_new_post_button = screen.getByTestId("create_new_post_button");

  await user.type(new_post_title, "Tesing title for new post");
  await user.type(
    new_post_body,
    "This is an example article that I am writing to show the validity of my testing function. "
  );
  await user.click(create_new_post_button);

  const post_items = screen.getAllByPlaceholderText("post_item");
  expect(post_items.length).toBe(41);
});
