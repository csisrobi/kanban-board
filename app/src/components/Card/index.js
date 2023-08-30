import React, { useState } from "react";
import "./card.scss";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Card from "react-bootstrap/Card";
import NewCardModal from "../../components/NewCardModal";
import BoardAPI from "../../api/board";
import { TrashIcon } from "../Icons/TrashIcon";
import Button from "react-bootstrap/esm/Button";
import Toast from "../Toast";

const TaskCard = ({ task, users, columnId, refetchData }) => {
  const [showDialog, setShowDialog] = useState();
  const [saveInProgress, setSaveInProgress] = useState();
  const [cardHovered, setCardHovered] = useState(false);
  const [toastMessage, setToastMessage] = useState(undefined);

  const { importance, name, description, id, assigned } = task;
  const assignees = assigned.map(
    (assignedUser) => users.find((user) => user.id === assignedUser).name
  );
  const { setNodeRef, attributes, listeners, transition, transform } =
    useSortable({
      id,
      data: {
        type: "task",
        task,
        columnId,
      },
    });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleClose = () => setShowDialog(false);
  const handleShow = () => setShowDialog(true);
  const handleSave = async (data) => {
    setSaveInProgress(true);
    await BoardAPI.editTask(id, data)
      .then(() => {
        refetchData();
        handleClose();
      })
      .catch((e) => setToastMessage(e.message));
    setSaveInProgress(false);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    await BoardAPI.deleteTask(id)
      .then(() => {
        refetchData();
      })
      .catch((e) => setToastMessage(e.message));
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        onClick={handleShow}
        style={style}
        className={`importance-${importance}`}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
        {...attributes}
        {...listeners}
      >
        <Card.Body>
          <Card.Title className="py-2">{name}</Card.Title>
          <Card.Text className="mb-2 text-body-secondary gap-2 d-flex flex-wrap">
            {assignees.map((assignee, i) => (
              <span key={`${assignee}-${i}`} className="badge bg-secondary">
                {assignee}
              </span>
            ))}
          </Card.Text>
        </Card.Body>
        {cardHovered && (
          <div className="position-absolute bottom-0 start-50 translate-middle-x my-1">
            <Button onClick={handleDelete} variant="outline-danger" size="sm">
              <TrashIcon />
            </Button>
          </div>
        )}
      </Card>
      <NewCardModal
        show={showDialog}
        handleClose={handleClose}
        handleSave={handleSave}
        saveInProgress={saveInProgress}
        users={users}
        task={task}
      />
      <Toast
        show={!!toastMessage}
        text={toastMessage}
        onClose={() => setToastMessage(undefined)}
        variant={"danger"}
      />
    </>
  );
};

export default TaskCard;
