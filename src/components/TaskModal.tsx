import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import type { Task, TaskStatus } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  defaultStartIso: string;
  defaultEndIso: string;
  initialTask?: Task | null;
}

const STATUSES: TaskStatus[] = ["To Do", "In Progress", "Review", "Completed"];

const TaskModal: React.FC<Props> = ({
  open,
  onClose,
  onSave,
  defaultStartIso,
  defaultEndIso,
  initialTask = null,
}) => {
  const [name, setName] = useState(initialTask?.name ?? "");
  const [status, setStatus] = useState<TaskStatus>(
    initialTask?.status ?? "To Do"
  );
  const [startIso, setStartIso] = useState(
    initialTask?.startDate ?? defaultStartIso
  );
  const [endIso, setEndIso] = useState(initialTask?.endDate ?? defaultEndIso);

  useEffect(() => {
    setName(initialTask?.name ?? "");
    setStatus(initialTask?.status ?? "To Do");
    setStartIso(initialTask?.startDate ?? defaultStartIso);
    setEndIso(initialTask?.endDate ?? defaultEndIso);
  }, [initialTask, defaultStartIso, defaultEndIso, open]);

  const handleSave = () => {
    if (!name.trim()) return;
    const t: Task = {
      id: initialTask?.id ?? Date.now().toString(),
      name: name.trim(),
      status,
      startDate: new Date(startIso).toISOString(),
      endDate: new Date(endIso).toISOString(),
    };
    onSave(t);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialTask ? "Edit Task" : "Create Task"}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
            minWidth: 320,
          }}
        >
          <TextField
            autoFocus
            label="Task name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            select
            label="Category"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            fullWidth
          >
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Start date"
            type="date"
            value={startIso.split("T")[0]}
            onChange={(e) =>
              setStartIso(new Date(e.target.value).toISOString())
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End date"
            type="date"
            value={endIso.split("T")[0]}
            onChange={(e) => setEndIso(new Date(e.target.value).toISOString())}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!name.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;
