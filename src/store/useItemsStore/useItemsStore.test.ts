import { beforeEach, expect, test } from "vitest";
import useItemsStore from "./useItemsStore";

const emptyState = {
  items: [] as { id: string; title: string }[],
  selectedItemsIds: [] as string[],
};

beforeEach(() => {
  localStorage.clear();
  useItemsStore.setState(emptyState);
});

test("should append a new item with a generated id when add is called", () => {
  useItemsStore.getState().add("First item");

  const { items } = useItemsStore.getState();

  expect(items).toHaveLength(1);
  expect(items[0].title).toBe("First item");
  expect(items[0].id).toEqual(expect.any(String));
  expect(items[0].id.length).toBeGreaterThan(0);
});

test("should keep insertion order and unique ids when several items are added", () => {
  useItemsStore.getState().add("First item");
  useItemsStore.getState().add("Second item");
  useItemsStore.getState().add("Third item");

  const { items } = useItemsStore.getState();

  expect(items.map((item) => item.title)).toEqual([
    "First item",
    "Second item",
    "Third item",
  ]);
  expect(new Set(items.map((item) => item.id)).size).toBe(3);
});

test("should add the id to the selection when updateSelectedItemsId is called for an unselected item", () => {
  useItemsStore.getState().updateSelectedItemsId("1");

  expect(useItemsStore.getState().selectedItemsIds).toEqual(["1"]);
});

test("should remove the id from the selection when updateSelectedItemsId is called for a selected item", () => {
  useItemsStore.getState().updateSelectedItemsId("1");
  useItemsStore.getState().updateSelectedItemsId("2");
  useItemsStore.getState().updateSelectedItemsId("1");

  expect(useItemsStore.getState().selectedItemsIds).toEqual(["2"]);
});

test("should remove only the selected items when remove is called", () => {
  useItemsStore.setState({
    items: [
      { id: "1", title: "First item" },
      { id: "2", title: "Second item" },
      { id: "3", title: "Third item" },
    ],
    selectedItemsIds: ["1", "3"],
  });

  useItemsStore.getState().remove();

  expect(useItemsStore.getState().items).toEqual([
    { id: "2", title: "Second item" },
  ]);
});

test("should keep all items when remove is called without a selection", () => {
  useItemsStore.setState({
    items: [
      { id: "1", title: "First item" },
      { id: "2", title: "Second item" },
    ],
    selectedItemsIds: [],
  });

  useItemsStore.getState().remove();

  expect(useItemsStore.getState().items).toHaveLength(2);
});

test("should remove only the last item when reset is called", () => {
  useItemsStore.setState({
    items: [
      { id: "1", title: "First item" },
      { id: "2", title: "Second item" },
    ],
    selectedItemsIds: [],
  });

  useItemsStore.getState().reset();

  expect(useItemsStore.getState().items).toEqual([
    { id: "1", title: "First item" },
  ]);
});

test("should keep the list empty when reset is called on an empty list", () => {
  useItemsStore.getState().reset();

  expect(useItemsStore.getState().items).toEqual([]);
});

test("should keep the selection unchanged when reset is called", () => {
  useItemsStore.setState({
    items: [
      { id: "1", title: "First item" },
      { id: "2", title: "Second item" },
    ],
    selectedItemsIds: ["1"],
  });

  useItemsStore.getState().reset();

  expect(useItemsStore.getState().selectedItemsIds).toEqual(["1"]);
});

test("should persist only the items list to localStorage", () => {
  useItemsStore.getState().add("Persisted item");
  const [item] = useItemsStore.getState().items;
  useItemsStore.getState().updateSelectedItemsId(item.id);

  const stored = JSON.parse(localStorage.getItem("items:v1") ?? "{}");

  expect(stored.state.items).toEqual([
    { id: item.id, title: "Persisted item" },
  ]);
  expect(stored.state.selectedItemsIds).toBeUndefined();
});

test("should restore items from localStorage when the store rehydrates", async () => {
  localStorage.setItem(
    "items:v1",
    JSON.stringify({
      state: { items: [{ id: "saved-1", title: "Saved item" }] },
      version: 0,
    }),
  );

  await useItemsStore.persist.rehydrate();

  expect(useItemsStore.getState().items).toEqual([
    { id: "saved-1", title: "Saved item" },
  ]);
  expect(useItemsStore.getState().selectedItemsIds).toEqual([]);
});
