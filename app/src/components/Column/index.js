import React, { useContext, useState, useCallback } from "react";
import { useDrop } from "react-dnd";
import BoardAPI from "../../api/board";
import NewCardModal from "../../components/NewCardModal";
import { BoardContext } from "../../containers/Board";
import Card from "../Card";
import { PlusIcon } from "../Icons/PlusIcon";
import Toast from "../Toast";
import "./column.scss";

export const Column = ({ column, refetchData }) => {
  const { columns, setColumns } = useContext(BoardContext);
  const [showDialog, setShowDialog] = useState();
  const [saveInProgress, setSaveInProgress] = useState();
  const [toastMessage, setToastMessage] = useState(undefined);

  const { id, name, tasks } = column;

  const moveCardToColumn = useCallback(
    (taskData, newColumnId, oldColumnId, overTaskData) => {
      setColumns((prevColumns) => {
        const oldColumnBoardIndex = prevColumns.findIndex(
          (col) => col.id === oldColumnId
        );

        const oldColumnTasks = prevColumns[oldColumnBoardIndex].tasks;
        const newTaskListForOldColumn = oldColumnTasks.filter(
          (task) => task.id !== taskData.id
        );
        let newTaskListForNewColumn;
        if (overTaskData) {
          const overColumnIndex = newColumnTasks.findIndex(
            (col) => col.id === overTaskData.id
          );
          newTaskListForNewColumn = newColumnTasks.toSpliced(
            overColumnIndex,
            0,
            taskData
          );
        } else {
          newTaskListForNewColumn = [...tasks, taskData];
        }
        return prevColumns.map((col) => {
          if (col.id === oldColumnId) {
            return {
              ...col,
              tasks: newTaskListForOldColumn,
            };
          }
          if (col.id === newColumnId) {
            return {
              ...col,
              tasks: newTaskListForNewColumn,
            };
          }
          return col;
        });
      });
    },
    [columns]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "card",
      drop: () => {
        (async () => {
          await BoardAPI.editBoard(columns);
        })();
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
      hover: (item, monitor) => {
        if (item.columnId !== id) {
          moveCardToColumn(item.task, id, item.columnId);
          item.columnId = id;
        }
      },
    }),
    [columns, id]
  );

  const handleClose = () => setShowDialog(false);
  const handleShow = () => setShowDialog(true);
  const handleSave = async (data) => {
    setSaveInProgress(true);
    await BoardAPI.createTask(id, data)
      .then(() => {
        refetchData();
        handleClose();
      })
      .catch((e) => setToastMessage(e.message));
    setSaveInProgress(false);
  };
  return (
    <div
      ref={drop}
      className="border border-2 rounded p-2 bg-light columnRoot d-flex flex-column"
    >
      <div className="py-2 fs-5 fw-bold d-flex w-full">
        <span className="flex-grow-1">{name}</span>
        <div onClick={handleShow} style={{ cursor: "pointer" }}>
          <PlusIcon />
        </div>
      </div>
      <div className="d-flex flex-column gap-2 overflow-auto">
        {tasks.map((task, index) => (
          <Card
            key={task.id}
            columnId={id}
            task={task}
            refetchData={refetchData}
            index={index}
          />
        ))}
      </div>
      <NewCardModal
        show={showDialog}
        handleClose={handleClose}
        handleSave={handleSave}
        saveInProgress={saveInProgress}
      />
      <Toast
        show={!!toastMessage}
        text={toastMessage}
        onClose={() => setToastMessage(undefined)}
        variant={"danger"}
      />
    </div>
  );
};
