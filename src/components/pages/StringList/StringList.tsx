import { useState } from "react";
import Reset from "../../../assets/icons/Reset";
import Button from "../../Button";
import Modal from "../../Modal";
import SelectableList from "../../SelectableList";
import styles from "./StringList.module.css";
import useItemsStore from "../../../store/useItemsStore";

const StringList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const items = useItemsStore((store) => store.items);
  const remove = useItemsStore((store) => store.remove);
  const reset = useItemsStore((store) => store.reset);

  return (
    <section className={styles.stringList}>
      <h1 className={styles.title}>This is a technical proof</h1>
      <p className={styles.description}>
        Lorem ipsum dolor sit amet consectetur adipiscing, elit mus primis nec
        inceptos. Lacinia habitasse arcu molestie maecenas cursus quam nunc,
        hendrerit posuere augue fames dictumst placerat porttitor, dis mi
        pharetra vestibulum venenatis phasellus.
      </p>
      <SelectableList items={items} />
      <div className={styles.buttons}>
        <div className={styles.buttonsSecondary}>
          <Button icon={<Reset />} onClick={reset} variant="secondary" />
          <Button text="DELETE" onClick={() => remove()} variant="secondary" />
        </div>
        <Button text="ADD" onClick={() => setIsModalOpen(true)} />
      </div>
      <Modal
        id="modal"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default StringList;
