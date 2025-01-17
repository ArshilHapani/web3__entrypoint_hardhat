import { create } from "zustand";

export type ModalType = `show-nft-${string}` | `update-price-${string}`;

interface ModalState {
  modalType: ModalType | null;
  openModal: (modalType: ModalType) => void;
  isOpen: boolean;
  closeModal: () => void;
}

const useModal = create<ModalState>((set) => ({
  modalType: null,
  isOpen: false,
  openModal: (modalType: ModalType) => set({ modalType, isOpen: true }),
  closeModal: () => set({ modalType: null, isOpen: false }),
}));

export default useModal;
