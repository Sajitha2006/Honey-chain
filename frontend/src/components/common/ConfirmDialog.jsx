// ConfirmDialog — used for delete confirmations
import Modal from "./Modal";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  danger = true,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <p className="confirm-message">{message}</p>
    <div className="confirm-actions">
      <button className="btn-outline" onClick={onClose}>
        {cancelText}
      </button>
      <button
        className={danger ? "btn-danger" : "btn-primary"}
        onClick={() => { onConfirm(); onClose(); }}
      >
        {confirmText}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
