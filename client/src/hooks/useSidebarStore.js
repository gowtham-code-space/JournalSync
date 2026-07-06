import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  isOpen: false,
  setOpen: (val) => set({ isOpen: val }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useSidebarStore;
