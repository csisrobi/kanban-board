import React, { createContext, useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardAPI from "../../api/board";
import UserAPI from "../../api/user";
import { Column } from "../../components/Column";
import Toast from "../../components/Toast";
import "./board.scss";

export const BoardContext = createContext({
  columns: [],
  setColumns: () => {},
  users: [],
  setUsers: () => {},
});

const Board = () => {
  const [columns, setColumns] = useState([]);
  const [users, setUsers] = useState([]);
  const [toastMessage, setToastMessage] = useState(undefined);

  const fetchBoard = useCallback(async () => {
    await BoardAPI.getBoardColumns()
      .then((res) => setColumns(res.data))
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
    (taskData, newColumnId, oldColumnId, overTaskData) => {
      setColumns((prevColumns) => {
        const oldColumnBoardIndex = prevColumns.findIndex(
          (col) => col.id === oldColumnId
        );
        const newColumnBoardIndex = prevColumns.findIndex(
          (col) => col.id === newColumnId
        );

        const oldColumnTasks = prevColumns[oldColumnBoardIndex].tasks;
        const newColumnTasks = prevColumns[newColumnBoardIndex].tasks;

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

  return (
    <div className="boardRoot">
      <BoardContext.Provider
        value={{ columns, setColumns, users, setUsers, moveCardToColumn }}
      >
        <DndProvider backend={HTML5Backend}>
          <div className="d-flex gap-3 m-auto">
            {columns.map((column, index) => (
              <Column
                key={column.id}
                column={column}
                refetchData={fetchBoard}
                index={index}
              />
            ))}
          </div>
        </DndProvider>
      </BoardContext.Provider>
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
