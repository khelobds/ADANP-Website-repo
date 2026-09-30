import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{message}</h3>
        </div>
        <div className="modal-actions">
          <button className="modal-btn modal-btn-yes" onClick={onConfirm}>
            Yes
          </button>
          <button className="modal-btn modal-btn-no" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
