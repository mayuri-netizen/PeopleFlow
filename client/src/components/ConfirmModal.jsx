import React from 'react';
import ReactDOM from 'react-dom';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onClose} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="btn btn-danger">
                        Confirm
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;

