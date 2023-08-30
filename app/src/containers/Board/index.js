import React, { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { createPortal } from "react-dom";
import BoardAPI from "../../api/board";
import UserAPI from "../../api/user";
import { Column } from "../../components/Column";
import { arrayMove } from "@dnd-kit/sortable";
import Card from "../../components/Card";
import Toast from "../../components/Toast";
import "./board.scss";

const Board = () => {
  const [boardColumns, setBoardColumns] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [toastMessage, setToastMessage] = useState(undefined);

  const fetchBoard = useCallback(async () => {
    await BoardAPI.getBoardColumns()
      .then((res) => setBoardColumns(res.data))
      .catch((e) => setToastMessage(e.message));
  }, []);

  const fetchUsers = useCallback(async () => {
    await UserAPI.getUsers()
      .then((res) => setUsers(res.data))
      .catch((e) => setToastMessage(e.message));
  }, []);

  useEffect(() => {
    (async () => {
      await fetchUsers();
      await fetchBoard();
    })();
  }, [fetchUsers, fetchBoard]);

  const moveCardToColumn = useCallback(
    (taskData, newColumnData, oldColumnId, overTaskData) => {
      const oldColumnBoardIndex = boardColumns.findIndex(
        (boardColumn) => boardColumn.id === oldColumnId
      );

      const oldColumnTasks = boardColumns[oldColumnBoardIndex].tasks;
      const newColumnTasks = newColumnData.tasks;

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
        newTaskListForNewColumn = [...newColumnTasks, taskData];
      }
      setBoardColumns((prevBoardColumns) =>
        prevBoardColumns.map((boardColumn) => {
          if (boardColumn.id === oldColumnId) {
            return {
              ...boardColumn,
              tasks: newTaskListForOldColumn,
            };
          }
          if (boardColumn.id === newColumnData.id) {
            return {
              ...boardColumn,
              tasks: newTaskListForNewColumn,
            };
          }
          return boardColumn;
        })
      );
    },
    [boardColumns]
  );

  const sortCard = useCallback(
    (activeTaskData, overTaskData, columnId) => {
      const columnBoardIndex = boardColumns.findIndex(
        (boardColumn) => boardColumn.id === columnId
      );
      const columnTasks = boardColumns[columnBoardIndex].tasks;

      const activeColumnIndex = columnTasks.findIndex(
        (col) => col.id === activeTaskData.id
      );
      const overColumnIndex = columnTasks.findIndex(
        (col) => col.id === overTaskData.id
      );

      const newTaskListForColumn = arrayMove(
        columnTasks,
        activeColumnIndex,
        overColumnIndex
      );

      setBoardColumns((prevBoardColumns) =>
        prevBoardColumns.map((boardColumn) => {
          if (boardColumn.id === columnId) {
            return {
              ...boardColumn,
              tasks: newTaskListForColumn,
            };
          }
          return boardColumn;
        })
      );
    },
    [boardColumns]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const onDragStart = (event) => {
    setActiveTask(event.active.data.current.task);
  };

  const onDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "task";
    const isOverATask = over.data.current?.type === "task";

    if (!isActiveATask) return;
    const activeTask = active.data.current;
    const columnId = active.data.current.columnId;

    if (isActiveATask && isOverATask) {
      const overTask = over.data.current;

      if (columnId !== overTask.columnId) {
        const newColumnData = boardColumns.find(
          (boardColumn) => boardColumn.id === overTask.columnId
        );
        return moveCardToColumn(
          activeTask.task,
          newColumnData,
          columnId,
          overTask.task
        );
      }
      const columnData = boardColumns.find(
        (boardColumn) => boardColumn.id === columnId
      );
      return sortCard(activeTask.task, overTask.task, columnData.id);
    }

    const isOverAColumn = over.data.current?.type === "column";

    if (isActiveATask && isOverAColumn) {
      const newColumnData = over.data.current.column;
      moveCardToColumn(activeTask.task, newColumnData, columnId);
    }
  };
  const onDragEnd = (event) => {
    (async () => {
      await BoardAPI.editBoard(boardColumns);
    })();
  };
  return (
    <div className="boardRoot">
      <DndContext
        sensors={sensors}
        onDragOver={onDragOver}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="d-flex gap-3 m-auto">
          {boardColumns.map((boardColumn) => (
            <Column
              key={boardColumn.id}
              column={boardColumn}
              users={users}
              refetchData={fetchBoard}
            />
          ))}
        </div>
        {createPortal(
          <DragOverlay modifiers={[restrictToWindowEdges]}>
            {activeTask && (
              <Card task={activeTask} users={users} columnId={"test"} />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
      <Toast
        show={!!toastMessage}
        text={toastMessage}
        onClose={() => setToastMessage(undefined)}
        variant={"danger"}
      />
    </div>
  );
};

export default Board;
