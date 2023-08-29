import React, { useMemo } from "react";
import { Card } from "../Card";
import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import "./column.scss";

export const Column = ({ column, users }) => {
  const { id, name, tasks } = column;
  const taskIds = useMemo(() => tasks.map((task) => task.id, [tasks]));
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: "column",
      column,
    },
  });
  return (
    <div
      ref={setNodeRef}
      className="border border-2 rounded p-2 bg-light columnRoot d-flex flex-column"
    >
      <div className="py-2 fs-5 fw-bold">{name}</div>
      <div className="d-flex flex-column gap-2 overflow-auto">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <Card key={task.id} columnId={id} users={users} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
