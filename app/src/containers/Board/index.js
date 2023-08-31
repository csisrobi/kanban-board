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

  return (
    <div className="boardRoot">
      <BoardContext.Provider value={{ columns, setColumns, users, setUsers }}>
        <DndProvider backend={HTML5Backend}>
          <div className="d-flex gap-3 m-auto">
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                refetchData={fetchBoard}
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
