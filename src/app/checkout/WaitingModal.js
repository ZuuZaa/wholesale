const Modal = ({ isOpen, onClose, email, children }) => {
  if (!isOpen) return null;

  return (
    <div className="login-verification-modal-wrapper">
      <div className="account-lr-wrap mx-auto p-8 text-center">
        <h4 className="account-page-title">Waiting...</h4>
        <p className="mb-4">Don't close window!</p>
      </div>
    </div>
  );
};

export default Modal;
