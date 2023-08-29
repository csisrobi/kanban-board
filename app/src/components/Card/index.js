import React, { useEffect } from "react";
import "./card.scss";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";

export const Card = ({ task, users, columnId }) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card importance-${importance}`}
      {...attributes}
      {...listeners}
    >
      <div className="card-body">
        <h5 className="card-title py-2">{name}</h5>
        <p className="card-text mb-2 text-body-secondary gap-2 d-flex flex-wrap">
          {assignees.map((assignee, i) => (
            <span key={`${assignee}-${i}`} className="badge bg-secondary">
              {assignee}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};
