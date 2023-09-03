import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import CardDataForm from "../CardDataForm";

const NewCardModal = ({
  show,
  handleClose,
  handleSave,
  saveInProgress,
  task = {},
}) => {
  const {
    name: defaultName = "",
    assigned: defaultAssigned = [],
    description: defaultDescription = "",
    importance: defaultImportance = 0,
  } = task;
  const [formState, setFormState] = useState({
    name: defaultName,
    description: defaultDescription,
    assigned: defaultAssigned,
    importance: defaultImportance,
  });
  const onSubmit = () => {
    handleSave(formState);
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add new task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CardDataForm formState={formState} setFormState={setFormState} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={saveInProgress}
        >
          Close
        </Button>
        <Button variant="primary" onClick={onSubmit} disabled={saveInProgress}>
          {saveInProgress && <Spinner animation="border" size="sm" />}
          <span>Save Changes</span>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewCardModal;
