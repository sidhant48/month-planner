import React from "react";
import type { Task } from "../types";
import TaskBar from "./TaskBar";

export type DayTileProps = {
  day: Date;
  tasks: Task[];
  isSelected: boolean;
  onMouseDown: (day: Date) => void;
  onMouseOver: (day: Date) => void;
  onMouseUp: () => void;
  onTaskClick?: (task: Task) => void;
  onResizeStart?: (taskId: string, edge: "start" | "end") => void; // new
};

const DayTile: React.FC<DayTileProps> = ({
  day,
  tasks,
  isSelected,
  onMouseDown,
  onMouseOver,
  onMouseUp,
  onTaskClick,
  onResizeStart,
}) => {
  return (
    <div
      data-day={day.toISOString()}
      onMouseDown={() => onMouseDown(day)}
      onMouseOver={() => onMouseOver(day)}
      onMouseUp={onMouseUp}
      style={{
        border: isSelected ? "2px solid blue" : "1px solid #ccc",
        minHeight: "100px",
        padding: 30,
        position: "relative",
      }}
    >
      <div style={{ marginBottom: 4 }}>{day.getDate()}</div>

      {tasks.map((task) => (
        <TaskBar
          key={task.id}
          task={task}
          onClick={onTaskClick ? (t) => onTaskClick(t) : () => {}}
          onResizeStart={
            onResizeStart ? (id, edge) => onResizeStart(id, edge) : () => {}
          }
        />
      ))}
    </div>
  );
};

export default DayTile;
