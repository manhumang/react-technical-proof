import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, expect, vi } from "vitest";
import useItemsStore from "../../store/useItemsStore";
import Modal from "./Modal";

type ModalProps = ComponentProps<typeof Modal>;

const renderModal = (props: Partial<ModalProps> = {}) => {
  const onClose = vi.fn();
  const utils = render(<Modal id="modal" onClose={onClose} {...props} />);

  return { onClose, ...utils };
};

beforeEach(() => {
  localStorage.clear();
  useItemsStore.setState({ items: [], selectedItemsIds: [] });
});

test("should be closed when open is not provided", () => {
  renderModal();

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("should render a visible dialog with a labeled input and actions when open", () => {
  renderModal({ open: true });

  const dialog = screen.getByRole("dialog");

  expect(dialog).toBeVisible();
  expect(
    screen.getByRole("textbox", { name: "Add item to list" }),
  ).toBeInTheDocument();
  expect(
    screen.getByPlaceholderText("Type the text here..."),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "ADD" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "CANCEL" })).toBeEnabled();
});

test("should keep ADD disabled when the input contains only whitespace", async () => {
  const user = userEvent.setup();

  renderModal({ open: true });
  const input = screen.getByRole("textbox", { name: "Add item to list" });
  const addButton = screen.getByRole("button", { name: "ADD" });

  await user.type(input, "   ");

  expect(input).toHaveValue("   ");
  expect(addButton).toBeDisabled();

  await user.clear(input);
  await user.type(input, "Buy milk");

  expect(addButton).toBeEnabled();
});

test("should add the trimmed title and request close when submitted", async () => {
  const user = userEvent.setup();

  const { onClose } = renderModal({ open: true });

  await user.type(
    screen.getByRole("textbox", { name: "Add item to list" }),
    "  Buy milk  ",
  );
  await user.click(screen.getByRole("button", { name: "ADD" }));

  expect(onClose).toHaveBeenCalledTimes(1);
  expect(useItemsStore.getState().items).toEqual([
    { id: expect.any(String), title: "Buy milk" },
  ]);
});

test("should clear the input after a successful submission", async () => {
  const user = userEvent.setup();

  renderModal({ open: true });

  const input = screen.getByRole("textbox", { name: "Add item to list" });

  await user.type(input, "Buy milk");
  await user.click(screen.getByRole("button", { name: "ADD" }));

  expect(input).toHaveValue("");
});

test("should not add anything when submitting a whitespace-only value", async () => {
  const user = userEvent.setup();

  const { onClose } = renderModal({ open: true });

  await user.type(
    screen.getByRole("textbox", { name: "Add item to list" }),
    "   ",
  );
  await user.keyboard("{Enter}");

  expect(onClose).not.toHaveBeenCalled();
  expect(useItemsStore.getState().items).toEqual([]);
  expect(screen.getByRole("dialog")).toBeVisible();
});

test("should close and clear the input when CANCEL is clicked", async () => {
  const user = userEvent.setup();

  const { onClose } = renderModal({ open: true });

  const input = screen.getByRole("textbox", { name: "Add item to list" });

  await user.type(input, "Draft item");
  await user.click(screen.getByRole("button", { name: "CANCEL" }));

  expect(onClose).toHaveBeenCalledTimes(1);
  expect(input).toHaveValue("");
  expect(useItemsStore.getState().items).toEqual([]);
});

test("should close when the backdrop is clicked", async () => {
  const user = userEvent.setup();

  const { onClose } = renderModal({ open: true });

  await user.click(screen.getByRole("dialog"));

  expect(onClose).toHaveBeenCalledTimes(1);
});

test("should stay open when a click happens inside the form", async () => {
  const user = userEvent.setup();

  const { onClose } = renderModal({ open: true });

  await user.click(screen.getByRole("textbox", { name: "Add item to list" }));

  expect(onClose).not.toHaveBeenCalled();
});

test("should open the dialog when open changes from false to true", () => {
  const onClose = vi.fn();
  const { rerender } = render(<Modal id="modal" onClose={onClose} />);

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

  rerender(<Modal id="modal" onClose={onClose} open />);

  expect(screen.getByRole("dialog")).toBeVisible();
});
