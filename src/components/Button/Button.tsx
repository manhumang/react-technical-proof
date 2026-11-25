import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  disabled?: ButtonHTMLAttributes<HTMLButtonElement>["disabled"];
  icon?: React.ReactNode;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  text?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  variant?: "primary" | "secondary";
};

const Button = ({
  disabled,
  icon,
  onClick,
  text,
  type = "button",
  variant = "primary",
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={
        variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary
      }
      onClick={onClick}
      type={type}
    >
      {icon}
      {text}
    </button>
  );
};

export default Button;
