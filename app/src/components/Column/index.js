import React, { useMemo, useState } from "react";
import Card from "../Card";
import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import "./column.scss";
import { PlusIcon } from "../Icons/PlusIcon";
import NewCardModal from "../../components/NewCardModal";
import BoardAPI from "../../api/board";
import Toast from "../Toast";

export const Column = ({ column, users, refetchData }) => {
  const [showDialog, setShowDialog] = useState();
  const [saveInProgress, setSaveInProgress] = useState();
  const [toastMessage, setToastMessage] = useState(undefined);

  const { id, name, tasks } = column;
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: "column",
      column,
    },
  });
  const taskIds = useMemo(() => tasks.map((task) => task.id, [tasks]));

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
      ref={setNodeRef}
      className="border border-2 rounded p-2 bg-light columnRoot d-flex flex-column"
    >
      <div className="py-2 fs-5 fw-bold d-flex w-full">
        <span className="flex-grow-1">{name}</span>
        <div onClick={handleShow} style={{ cursor: "pointer" }}>
          <PlusIcon />
        </div>
      </div>
      <div className="d-flex flex-column gap-2 overflow-auto">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <Card
              key={task.id}
              columnId={id}
              users={users}
              task={task}
              refetchData={refetchData}
            />
          ))}
        </SortableContext>
      </div>
      <NewCardModal
        show={showDialog}
        handleClose={handleClose}
        handleSave={handleSave}
        saveInProgress={saveInProgress}
        users={users}
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
