import React, { useContext, useState, useRef } from "react";
import { useDrop } from "react-dnd";
import BoardAPI from "../../api/board";
import NewCardModal from "../../components/NewCardModal";
import { BoardContext } from "../../containers/Board";
import Card from "../Card";
import { PlusIcon } from "../Icons/PlusIcon";
import Toast from "../Toast";
import "./column.scss";

export const Column = ({ column, refetchData, index }) => {
  const { columns, moveCardToColumn } = useContext(BoardContext);
  const [showDialog, setShowDialog] = useState();
  const [saveInProgress, setSaveInProgress] = useState();
  const [toastMessage, setToastMessage] = useState(undefined);
  const ref = useRef();

  const { id, name, tasks } = column;

  const [, drop] = useDrop(
    () => ({
      accept: "card",
      item: { index },
      drop: () => {
        (async () => {
          await BoardAPI.editBoard(columns);
        })();
      },
      hover: (item, monitor) => {
        if (item.columnId === id) {
          return;
        }
        const dragIndex = columns.findIndex((c) => c.id === item.columnId);
        const hoverIndex = index;
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const clientOffset = monitor.getClientOffset();
        const hoverClientX = clientOffset.x;
        if (
          dragIndex < hoverIndex &&
          hoverClientX < hoverBoundingRect.left + 25
        ) {
          return;
        }
        if (
          dragIndex > hoverIndex &&
          hoverClientX > hoverBoundingRect.right - 25
        ) {
          return;
        }
        moveCardToColumn(item.task, id, item.columnId);
        item.columnId = id;
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
  drop(ref);
  return (
    <div
      ref={ref}
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
      {showDialog && (
        <NewCardModal
          show
          handleClose={handleClose}
          handleSave={handleSave}
          saveInProgress={saveInProgress}
        />
      )}
      <Toast
        show={!!toastMessage}
        text={toastMessage}
        onClose={() => setToastMessage(undefined)}
        variant={"danger"}
      />
    </div>
  );
};
