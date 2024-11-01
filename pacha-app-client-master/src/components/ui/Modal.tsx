import React, { ReactNode } from 'react';
import './modal.css'; // Import styles for the modal

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode; // Content to be rendered inside the modal
}

const Modal: React.FC<ModalProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null; // Don't render the modal if it's not open

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.classList.contains('modal-overlay')) {
      onOpenChange(false); // Close the modal when overlay is clicked
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content">
        <button className="modal-close" onClick={() => onOpenChange(false)}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;