import { X } from "lucide-react";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

import useModal, { type ModalType } from "@/hooks/useModal";

type Props = {
  children: React.ReactNode;
  type: ModalType;
  className?: string;
};

const Modal = ({ children, type: propsType, className }: Props) => {
  const { isOpen, closeModal: onClose, type } = useModal();
  const open = isOpen && type === propsType;

  // handle escape key modal closing behavior
  useEffect(() => {
    function handleEscapeKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Esc") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);
  return (
    <div draggable={false}>
      <dialog id="my_modal_4" className={`modal ${open && "modal-open"}`}>
        <div
          className={twMerge("modal-box max-w-5xl overflow-hidden", className)}
        >
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-5 top-5"
              onClick={onClose}
            >
              <X />
            </button>
          </form>
          {/* modal body */}
          <div className="overflow-auto">{children}</div>
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
