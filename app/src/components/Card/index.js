import React, { useCallback, useContext, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/esm/Button";
import { useDrag, useDrop } from "react-dnd";
import BoardAPI from "../../api/board";
import NewCardModal from "../../components/NewCardModal";
import { BoardContext } from "../../containers/Board";
import { TrashIcon } from "../Icons/TrashIcon";
import Toast from "../Toast";
import "./card.scss";

const TaskCard = ({ task, columnId, refetchData, index }) => {
  const { users, columns, setColumns } = useContext(BoardContext);
  const [showDialog, setShowDialog] = useState();
  const [saveInProgress, setSaveInProgress] = useState();
  const [cardHovered, setCardHovered] = useState(false);
  const [toastMessage, setToastMessage] = useState(undefined);
  const ref = useRef();

  const { importance, name, id, assigned } = task;
  const assignees = assigned.map(
    (assignedUser) => users.find((user) => user.id === assignedUser).name
  );

  const sortCard = useCallback(
    (
      activeTaskData,
      activeTaskIndex,
      overTaskData,
      overTaskIndex,
      columnId
    ) => {
      setColumns((prevBoardColumns) => {
        const columnBoardIndex = prevBoardColumns.findIndex(
          (boardColumn) => boardColumn.id === columnId
        );
        const columnTasks = prevBoardColumns[columnBoardIndex].tasks;
        const copyColumnTasks = columnTasks;
        copyColumnTasks[overTaskIndex] = activeTaskData;
        copyColumnTasks[activeTaskIndex] = overTaskData;

        return prevBoardColumns.map((boardColumn) => {
          if (boardColumn.id === columnId) {
            return {
              ...boardColumn,
              tasks: copyColumnTasks,
            };
          }
          return boardColumn;
        });
      });
    },
    [columns]
  );
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "card",
      item: { task, columnId },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [columns, columnId, task]
  );
  const [, drop] = useDrop(
    () => ({
      accept: "card",
      hover(item, monitor) {
        if (!ref.current) {
          return;
        }

        const columnBoard = columns.find(
          (boardColumn) => boardColumn.id === item.columnId
        );
        const columnTasks = columnBoard.tasks;

        const dragIndex = columnTasks.findIndex((c) => c.id === item.task.id);
        const hoverIndex = index;
        if (
          dragIndex < 0 ||
          (dragIndex === hoverIndex && item.columnId === columnId) ||
          item.task.id === task.id
        ) {
          return;
        }
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
        sortCard(item.task, dragIndex, task, hoverIndex, columnId);
        item.index = hoverIndex;
      },
    }),
    [columns, task, columnId, index]
  );
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

  drag(drop(ref));

  const opacity = isDragging ? 0.5 : 1;

  return (
    <>
      <Card
        ref={ref}
        onClick={handleShow}
        style={{ opacity }}
        className={`importance-${importance}`}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
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
