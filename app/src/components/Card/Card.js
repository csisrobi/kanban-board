import React from "react";
import "./style.scss";

export const Card = ({ title, description, assignees, importance }) => {
  return (
    <div className={`card importance-${importance}`}>
      <div className="card-body">
        <h5 className="card-title py-2">{title}</h5>
        <h6 className="card-subtitle mb-2 text-body-secondary gap-2 d-flex flex-wrap">
          {assignees.map((assignee, i) => (
            <span key={`${assignee}-${i}`} className="badge bg-secondary">
              {assignee}
            </span>
          ))}
        </h6>
      </div>
    </div>
  );
};
