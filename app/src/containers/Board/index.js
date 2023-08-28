import React, { useEffect, useState } from "react";
import { Card } from "../../components/Card/Card";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardAPI from "../../api/board";
import UserAPI from "../../api/user";

const Board = () => {
  const [boardColumns, setBoardColumns] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(async () => {
    const resBoard = await BoardAPI.getBoardColumns();
    const resUsers = await UserAPI.getUsers();

    setBoardColumns(resBoard.data);
    setUsers(resUsers.data);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="row mb-3 overflow-scroll">
        {boardColumns.map((boardColumn) => (
          <div key={boardColumn.id} className="col-4 example-grid-col">
            <div className="py-2 fs-5 fw-bold">{boardColumn.name}</div>
            <div className="d-flex flex-column gap-2">
              {boardColumn.tasks.map((task) => {
                const assignees = task.assigned.map(
                  (assignedUser) =>
                    users.find((user) => user.id === assignedUser).name
                );
                return (
                  <Card
                    key={task.id}
                    title={task.name}
                    description={task.description}
                    assignees={assignees}
                    importance={task.importance}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </DndProvider>
  );
};

export default Board;
