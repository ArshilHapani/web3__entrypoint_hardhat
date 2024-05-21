import { create } from "zustand";

export type ModalType = "connect";

interface ModalHookType {
  type: ModalType | null;
  isOpen: boolean;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}
const useModal = create<ModalHookType>((set) => ({
  type: null,
  isOpen: false,
  openModal: (type: ModalType) => set({ type, isOpen: true }),
  closeModal: () => set({ type: null, isOpen: false }),
}));

export default useModal;
