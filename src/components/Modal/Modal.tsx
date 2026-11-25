import { useEffect, useRef, useState, type SyntheticEvent } from "react";

import styles from "./Modal.module.css";
import Button from "../Button";
import Input from "../Input";
import useItemsStore from "../../store/useItemsStore";

type ModalProps = {
  onClose: () => void;
  id: string;
  open?: boolean;
};

const EMPTY_STRING = "";
const Modal = ({ onClose, id, open = false }: ModalProps) => {
  const [newItemValue, setNewItemValue] = useState(EMPTY_STRING);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const add = useItemsStore((store) => store.add);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const dialogListener = (event: MouseEvent) => {
      if (event.target === dialog) onClose();
    };
    if (open) {
      dialog.showModal();
      dialog.addEventListener("click", dialogListener);
    }
    return () => {
      dialog.close();
      dialog.removeEventListener("click", dialogListener);
    };
  }, [open, onClose]);

  const trimmedItemValue = newItemValue.trim();

  const handleCloseModal = () => {
    onClose();
    setNewItemValue(EMPTY_STRING);
  };

  const handleOnSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedItemValue) return;
    add(trimmedItemValue);
    handleCloseModal();
  };

  return (
    <dialog id={id} ref={dialogRef} onCancel={onClose}>
      <form className={styles.form} onSubmit={handleOnSubmit}>
        <Input
          label="Add item to list"
          placeholder="Type the text here..."
          value={newItemValue}
          onChange={(event) => setNewItemValue(event.target.value)}
        />
        <div className={styles.buttons}>
          <Button disabled={!trimmedItemValue} type="submit" text="ADD" />
          <Button
            text="CANCEL"
            onClick={handleCloseModal}
            variant="secondary"
          />
        </div>
      </form>
    </dialog>
  );
};

export default Modal;
