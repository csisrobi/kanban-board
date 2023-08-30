import React from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const CustomToast = ({ onClose, show, text, variant }) => {
  return (
    <ToastContainer
      className="py-3 px-3"
      position={"bottom-start"}
      style={{ zIndex: 1056 }}
    >
      <Toast onClose={onClose} show={show} delay={3000} autohide bg={variant}>
        <Toast.Body>{text}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default CustomToast;
