import { useId, type InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

type InputProps = {
  label: string;
  placeholder?: InputHTMLAttributes<HTMLInputElement>["placeholder"];
  value?: InputHTMLAttributes<HTMLInputElement>["value"];
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
};

const Input = ({ label, placeholder, value, onChange }: InputProps) => {
  const id = useId();
  return (
    <>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        className={styles.textBox}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

export default Input;
