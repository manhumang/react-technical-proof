import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test } from "vitest";
import useItemsStore from "../../store/useItemsStore";
import SelectableList from "./SelectableList";

type Item = {
  id: string;
  title: string;
};

const items: Item[] = [
  { id: "1", title: "First item" },
  { id: "2", title: "Second item" },
];

beforeEach(() => {
  localStorage.clear();
  useItemsStore.setState({ items: [], selectedItemsIds: [] });
});

test("should render one checkbox per item with the title as accessible name", () => {
  render(<SelectableList items={items} />);

  expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  expect(
    screen.getByRole("checkbox", { name: "First item" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("checkbox", { name: "Second item" }),
  ).toBeInTheDocument();
});

test("should render an empty list when no items are provided", () => {
  render(<SelectableList items={[]} />);

  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  expect(screen.getByRole("list")).toBeEmptyDOMElement();
});

test("should check the item and select it in the store when clicked", async () => {
  const user = userEvent.setup();

  render(<SelectableList items={items} />);
  const checkbox = screen.getByRole("checkbox", { name: "First item" });

  await user.click(checkbox);

  expect(checkbox).toBeChecked();
  expect(useItemsStore.getState().selectedItemsIds).toEqual(["1"]);
});

test("should uncheck the item and deselect it in the store when clicked twice", async () => {
  const user = userEvent.setup();

  render(<SelectableList items={items} />);
  const checkbox = screen.getByRole("checkbox", { name: "First item" });

  await user.click(checkbox);
  await user.click(checkbox);

  expect(checkbox).not.toBeChecked();
  expect(useItemsStore.getState().selectedItemsIds).toEqual([]);
});

test("should toggle the checkbox when its label is clicked", async () => {
  const user = userEvent.setup();

  render(<SelectableList items={items} />);

  await user.click(screen.getByText("Second item"));

  expect(screen.getByRole("checkbox", { name: "Second item" })).toBeChecked();
  expect(useItemsStore.getState().selectedItemsIds).toEqual(["2"]);
});

test("should select every clicked item when several are checked", async () => {
  const user = userEvent.setup();

  render(<SelectableList items={items} />);

  await user.click(screen.getByRole("checkbox", { name: "First item" }));
  await user.click(screen.getByRole("checkbox", { name: "Second item" }));

  expect(useItemsStore.getState().selectedItemsIds).toEqual(["1", "2"]);
});

test("should remove only the double clicked item from the store", async () => {
  const user = userEvent.setup();

  useItemsStore.setState({ items });
  render(<SelectableList items={items} />);

  await user.dblClick(screen.getByText("First item"));

  expect(useItemsStore.getState().items).toEqual([
    { id: "2", title: "Second item" },
  ]);
});

test("should not remove an item when its label is clicked once", async () => {
  const user = userEvent.setup();

  useItemsStore.setState({ items });
  render(<SelectableList items={items} />);

  await user.click(screen.getByText("First item"));

  expect(useItemsStore.getState().items).toEqual(items);
});

test("should render every row when the list is long", () => {
  const manyItems: Item[] = Array.from({ length: 50 }, (_, index) => ({
    id: `id-${index}`,
    title: `Item ${index + 1}`,
  }));

  render(<SelectableList items={manyItems} />);

  expect(screen.getAllByRole("checkbox")).toHaveLength(50);
  expect(screen.getByRole("checkbox", { name: "Item 50" })).toBeInTheDocument();
});
