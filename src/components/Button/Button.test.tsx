import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MouseEvent, SyntheticEvent } from "react";
import { expect, test, vi } from "vitest";
import Reset from "../../assets/icons/Reset";
import Button from "./Button";

test("should render the provided text when text is passed", () => {
  render(<Button text="SAVE" />);

  expect(screen.getByRole("button", { name: "SAVE" })).toBeInTheDocument();
});

test("should expose an accessible name from the icon when no text is passed", () => {
  render(<Button icon={<Reset />} />);

  expect(screen.getByRole("button", { name: "Refresh" })).toBeInTheDocument();
});

test("should render both icon and text when both are passed", () => {
  render(<Button icon={<Reset />} text="RESET" />);

  const button = screen.getByRole("button", { name: /RESET/ });

  expect(button).toHaveTextContent("RESET");
  expect(button).toBeInTheDocument();
});

test("should not submit a surrounding form when no type is passed", async () => {
  const user = userEvent.setup();
  const handleSubmit = vi.fn((event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
  });

  render(
    <form onSubmit={handleSubmit}>
      <Button text="SAVE" />
    </form>,
  );

  await user.click(screen.getByRole("button", { name: "SAVE" }));

  expect(handleSubmit).not.toHaveBeenCalled();
});

test("should submit a surrounding form when type is submit", async () => {
  const user = userEvent.setup();
  const handleSubmit = vi.fn((event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
  });

  render(
    <form onSubmit={handleSubmit}>
      <Button text="SAVE" type="submit" />
    </form>,
  );

  await user.click(screen.getByRole("button", { name: "SAVE" }));

  expect(handleSubmit).toHaveBeenCalledTimes(1);
});

test("should call onClick once with the click event when clicked", async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();

  render(<Button text="SAVE" onClick={onClick} />);
  const button = screen.getByRole("button", { name: "SAVE" });

  await user.click(button);

  expect(onClick).toHaveBeenCalledTimes(1);
  const event = onClick.mock.calls[0][0] as MouseEvent<HTMLButtonElement>;
  expect(event.type).toBe("click");
  expect(event.target).toBe(button);
});

test("should call onClick when activated with the keyboard", async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();

  render(<Button text="SAVE" onClick={onClick} />);

  await user.tab();
  expect(screen.getByRole("button", { name: "SAVE" })).toHaveFocus();

  await user.keyboard("{Enter}");
  expect(onClick).toHaveBeenCalledTimes(1);

  await user.keyboard(" ");
  expect(onClick).toHaveBeenCalledTimes(2);
});

test("should not call onClick when disabled and clicked", async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();

  render(<Button text="SAVE" disabled onClick={onClick} />);
  const button = screen.getByRole("button", { name: "SAVE" });

  expect(button).toBeDisabled();

  await user.click(button);

  expect(onClick).not.toHaveBeenCalled();
});
