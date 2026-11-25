import useItemsStore from "../../store/useItemsStore";
import styles from "./SelectableList.module.css";

type Item = {
  id: string;
  title: string;
};
type SelectableListProps = {
  items: Item[];
};

const SelectableList = ({ items }: SelectableListProps) => {
  const updateSelectedItemsId = useItemsStore(
    (store) => store.updateSelectedItemsId,
  );
  const remove = useItemsStore((store) => store.remove);

  const handleOnchageItem = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.id;
    updateSelectedItemsId(id);
  };

  return (
    <ul className={styles.selectableList}>
      {items.map((item) => (
        <li key={item.id}>
          <input
            className={styles.checkbox}
            type="checkbox"
            id={item.id}
            onChange={handleOnchageItem}
          />
          <label
            className={styles.label}
            htmlFor={item.id}
            onDoubleClick={() => remove(item.id)}
          >
            {item.title}
          </label>
        </li>
      ))}
    </ul>
  );
};

export default SelectableList;
