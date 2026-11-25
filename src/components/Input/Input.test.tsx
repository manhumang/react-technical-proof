import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type ChangeEvent } from "react";
import { expect, test, vi } from "vitest";
import Input from "./Input";

type ControlledInputProps = {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

const ControlledInput = ({ onChange }: ControlledInputProps) => {
  const [value, setValue] = useState("");

  return (
    <Input
      label="Name"
      placeholder="Type the text here..."
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        onChange?.(event);
      }}
    />
  );
};

test("should render an input associated with its label", () => {
  render(<ControlledInput />);

  const input = screen.getByLabelText("Name");

  expect(input).toBeInstanceOf(HTMLInputElement);
  expect(input).toHaveAccessibleName("Name");
});

test("should focus the input when the label is clicked", async () => {
  const user = userEvent.setup();

  render(<ControlledInput />);

  await user.click(screen.getByText("Name"));

  expect(screen.getByLabelText("Name")).toHaveFocus();
});

test("should show the provided placeholder", () => {
  render(<ControlledInput />);

  expect(
    screen.getByPlaceholderText("Type the text here..."),
  ).toBeInTheDocument();
});

test("should update the displayed value and call onChange on every keystroke", async () => {
  const user = userEvent.setup();
  const values: string[] = [];
  const onChange = vi.fn((event: ChangeEvent<HTMLInputElement>) => {
    values.push(event.target.value);
  });

  render(<ControlledInput onChange={onChange} />);
  const input = screen.getByLabelText("Name");

  await user.type(input, "Hello");

  expect(input).toHaveValue("Hello");
  expect(onChange).toHaveBeenCalledTimes(5);
  expect(values).toEqual(["H", "He", "Hel", "Hell", "Hello"]);
});

test("should keep whitespace input exactly as typed", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();

  render(<ControlledInput onChange={onChange} />);
  const input = screen.getByLabelText("Name");

  await user.type(input, "   ");

  expect(input).toHaveValue("   ");
  expect(onChange).toHaveBeenCalledTimes(3);
});

test("should render a provided value without user interaction", () => {
  render(<Input label="Name" value="Preset value" onChange={() => {}} />);

  expect(screen.getByLabelText("Name")).toHaveValue("Preset value");
});

test("should behave as an uncontrolled input when value and onChange are omitted", async () => {
  const user = userEvent.setup();

  render(<Input label="Name" />);
  const input = screen.getByLabelText("Name");

  await user.type(input, "abc");

  expect(input).toHaveValue("abc");
});
