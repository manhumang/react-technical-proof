import { render, screen, within } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { beforeEach, expect, test } from "vitest";
import useItemsStore from "../../../store/useItemsStore";
import StringList from "./StringList";

const addItem = async (user: UserEvent, title: string) => {
  await user.click(screen.getByRole("button", { name: "ADD" }));

  const dialog = screen.getByRole("dialog");

  await user.type(
    within(dialog).getByRole("textbox", { name: "Add item to list" }),
    title,
  );
  await user.click(within(dialog).getByRole("button", { name: "ADD" }));
};

beforeEach(() => {
  localStorage.clear();
  useItemsStore.setState({ items: [], selectedItemsIds: [] });
});

test("should render the heading and description", () => {
  render(<StringList />);

  expect(
    screen.getByRole("heading", { name: "This is a technical proof" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Lorem ipsum dolor sit amet consectetur adipiscing/),
  ).toBeInTheDocument();
});

test("should render the add, delete and reset controls", () => {
  render(<StringList />);

  expect(screen.getByRole("button", { name: "ADD" })).toBeEnabled();
  expect(screen.getByRole("button", { name: "DELETE" })).toBeEnabled();
  expect(screen.getByRole("button", { name: "Refresh" })).toBeEnabled();
});

test("should show an empty list when there are no items", () => {
  render(<StringList />);

  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  expect(screen.getByRole("list")).toBeEmptyDOMElement();
});

test("should show the new item in the list when the modal form is submitted", async () => {
  const user = userEvent.setup();

  render(<StringList />);

  await addItem(user, "Buy milk");

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(
    screen.getByRole("checkbox", { name: "Buy milk" }),
  ).toBeInTheDocument();
  expect(screen.getAllByRole("checkbox")).toHaveLength(1);
});

test("should not add an item when the modal input contains only whitespace", async () => {
  const user = userEvent.setup();

  render(<StringList />);

  await user.click(screen.getByRole("button", { name: "ADD" }));
  const dialog = screen.getByRole("dialog");

  await user.type(
    within(dialog).getByRole("textbox", { name: "Add item to list" }),
    "   ",
  );

  expect(within(dialog).getByRole("button", { name: "ADD" })).toBeDisabled();

  await user.keyboard("{Enter}");

  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  expect(screen.getByRole("dialog")).toBeVisible();
});

test("should close the modal without adding an item when CANCEL is clicked", async () => {
  const user = userEvent.setup();

  render(<StringList />);

  await user.click(screen.getByRole("button", { name: "ADD" }));
  const dialog = screen.getByRole("dialog");

  await user.type(
    within(dialog).getByRole("textbox", { name: "Add item to list" }),
    "Draft item",
  );
  await user.click(within(dialog).getByRole("button", { name: "CANCEL" }));

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
});

test("should remove only the selected item when DELETE is clicked", async () => {
  const user = userEvent.setup();

  render(<StringList />);

  await addItem(user, "First item");
  await addItem(user, "Second item");

  await user.click(screen.getByRole("checkbox", { name: "First item" }));
  await user.click(screen.getByRole("button", { name: "DELETE" }));

  expect(
    screen.queryByRole("checkbox", { name: "First item" }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("checkbox", { name: "Second item" }),
  ).toBeInTheDocument();
});

test("should remove only the double clicked item", async () => {
  const user = userEvent.setup();

  render(<StringList />);

  await addItem(user, "First item");
  await addItem(user, "Second item");

  await user.dblClick(screen.getByText("First item"));

  expect(screen.queryByText("First item")).not.toBeInTheDocument();
  expect(screen.getByText("Second item")).toBeInTheDocument();
  expect(screen.getAllByRole("checkbox")).toHaveLength(1);
});

test("should keep every item when DELETE is clicked with nothing selected", async () => {
  const user = userEvent.setup();

  render(<StringList />);

  await addItem(user, "First item");
  await addItem(user, "Second item");

  await user.click(screen.getByRole("button", { name: "DELETE" }));

  expect(screen.getAllByRole("checkbox")).toHaveLength(2);
});

test("should remove only the last item when the reset control is clicked", async () => {
  const user = userEvent.setup();

  render(<StringList />);

  await addItem(user, "First item");
  await addItem(user, "Second item");

  await user.click(screen.getByRole("button", { name: "Refresh" }));

  expect(
    screen.getByRole("checkbox", { name: "First item" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("checkbox", { name: "Second item" }),
  ).not.toBeInTheDocument();
});

test("should render and delete from a long list", async () => {
  const user = userEvent.setup();

  useItemsStore.setState({
    items: Array.from({ length: 25 }, (_, index) => ({
      id: `id-${index}`,
      title: `Item ${index + 1}`,
    })),
    selectedItemsIds: [],
  });

  render(<StringList />);

  expect(screen.getAllByRole("checkbox")).toHaveLength(25);

  await user.click(screen.getByRole("checkbox", { name: "Item 1" }));
  await user.click(screen.getByRole("checkbox", { name: "Item 25" }));
  await user.click(screen.getByRole("button", { name: "DELETE" }));

  expect(screen.getAllByRole("checkbox")).toHaveLength(23);
  expect(
    screen.queryByRole("checkbox", { name: "Item 1" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("checkbox", { name: "Item 25" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("checkbox", { name: "Item 2" })).toBeInTheDocument();
});
