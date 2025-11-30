import React from "react";
import { Box, Typography } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import type { Task } from "../types";

interface Props {
  task: Task;
  onResizeStart: (taskId: string, edge: "start" | "end") => void;
  onClick?: (task: Task) => void;
}

const TaskBar: React.FC<Props> = ({ task, onResizeStart, onClick }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id,
    data: { task },
  });

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        display: "flex",
        alignItems: "center",
        height: 28,
        width: "91%",
        borderRadius: 1,
        px: 3,
        cursor: "grab",
        userSelect: "none",
        backgroundColor:
          task.status === "To Do"
            ? "grey.600"
            : task.status === "In Progress"
            ? "info.main"
            : task.status === "Review"
            ? "warning.main"
            : "success.main",
        color: "white",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(task);
      }}
    >
      <Box
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeStart(task.id, "start");
        }}
        sx={{ width: 8, height: "100%", cursor: "ew-resize" }}
      />
      <Typography
        variant="caption"
        sx={{
          flex: 1,
          textAlign: "center",
          fontSize: 12,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {task.name}
      </Typography>
      <Box
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeStart(task.id, "end");
        }}
        sx={{ width: 8, height: "100%", cursor: "ew-resize" }}
      />
    </Box>
  );
};

export default TaskBar;
