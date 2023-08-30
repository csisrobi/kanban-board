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
  users,
  task = {},
}) => {
  const {
    name: defaultName = "",
    assigned: defaultAssigned = [],
    description: defaultDescription = "",
    importance: defaultImportance = 0,
  } = task;
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);
  const [assigned, setAssigned] = useState(defaultAssigned);
  const [importance, setImportance] = useState(defaultImportance);
  const onSubmit = () => {
    const data = {
      name,
      description,
      assigned,
      importance,
    };
    handleSave(data);
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add new task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CardDataForm
          users={users}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          assigned={assigned}
          setAssigned={setAssigned}
          importance={importance}
          setImportance={setImportance}
        />
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
