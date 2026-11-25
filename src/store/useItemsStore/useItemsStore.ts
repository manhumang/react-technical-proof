import { create } from "zustand";
import { persist } from "zustand/middleware";

type Item = {
  id: string;
  title: string;
};
interface ItemsState {
  items: Item[];
  selectedItemsIds: string[];
  add: (title: string) => void;
  updateSelectedItemsId: (id: string) => void;
  reset: () => void;
  remove: (id?: string) => void;
}
const useItemsStore = create<ItemsState>()(
  persist(
    (set) => ({
      items: [],
      selectedItemsIds: [],
      updateSelectedItemsId: (id) =>
        set((state) => {
          if (!state.selectedItemsIds.includes(id)) {
            return {
              selectedItemsIds: [...state.selectedItemsIds, id],
            };
          }
          return {
            selectedItemsIds: state.selectedItemsIds.filter(
              (item) => item !== id,
            ),
          };
        }),
      add: (title) =>
        set((state) => ({
          items: [...state.items, { id: crypto.randomUUID(), title }],
        })),

      reset: () =>
        set((state) => {
          state.items.pop();
          return {
            items: [...state.items],
          };
        }),

      remove: (id) =>
        set((state) => {
          if (id) {
            state.updateSelectedItemsId(id);
            return {
              items: state.items.filter((item) => id !== item.id),
            };
          }
          const toRemove = new Set(state.selectedItemsIds);
          return {
            items: state.items.filter((item) => !toRemove.has(item.id)),
          };
        }),
    }),
    {
      name: "items:v1",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export default useItemsStore;
