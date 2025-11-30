import React, { useMemo, useRef, useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  parseISO,
  addDays,
  differenceInCalendarDays,
  format,
} from "date-fns";
import DayTile from "./DayTile";
import TaskModal from "./TaskModal";
import { DndContext } from "@dnd-kit/core";
import type { MonthViewProps, Task } from "../types";
import { dayIsBetween } from "../utils/dateHelpers";

const MonthView: React.FC<MonthViewProps> = ({
  tasks: outerTasks,
  setTasks,
  filters,
}) => {
  const [tasks, setLocalTasks] = useState<Task[]>(outerTasks);
  useEffect(() => {
    setLocalTasks(outerTasks);
  }, [outerTasks]);

  const today = new Date();
  const first = startOfWeek(startOfMonth(today));
  const last = endOfWeek(endOfMonth(today));
  const days = useMemo(
    () => eachDayOfInterval({ start: first, end: last }),
    [first, last]
  );

  const selectingRef = useRef(false);
  const [selectStart, setSelectStart] = useState<Date | null>(null);
  const [selectEnd, setSelectEnd] = useState<Date | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalDefaultStart, setModalDefaultStart] = useState<string>(
    new Date().toISOString()
  );
  const [modalDefaultEnd, setModalDefaultEnd] = useState<string>(
    new Date().toISOString()
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [resizingTask, setResizingTask] = useState<{
    taskId: string;
    edge: "start" | "end";
  } | null>(null);
  const [previewTasks, setPreviewTasks] = useState<Task[] | null>(null);

  const handleResizeStart = (taskId: string, edge: "start" | "end") => {
    setResizingTask({ taskId, edge });
    setPreviewTasks([...tasks]);
  };

  const filteredTasks = useMemo(() => {
    const now = new Date();
    let limit = addDays(now, 0);

    if (filters.time === "1w") limit = addDays(now, 7);
    if (filters.time === "2w") limit = addDays(now, 14);
    if (filters.time === "3w") limit = addDays(now, 21);

    return tasks.filter((t) => {
      if (
        filters.search &&
        !t.name.toLowerCase().includes(filters.search.trim().toLowerCase())
      )
        return false;

      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(t.status)
      )
        return false;

      if (filters.time) {
        const ts = parseISO(t.startDate);
        const te = parseISO(t.endDate);
        if (te < now || ts > limit) return false;
      }

      return true;
    });
  }, [tasks, filters]);

  const tasksToRender = filteredTasks;

  const handleTileMouseDown = (day: Date) => {
    selectingRef.current = true;
    setSelectStart(day);
    setSelectEnd(day);
  };
  const handleTileMouseOver = (day: Date) => {
    if (!selectingRef.current) return;
    setSelectEnd(day);
  };
  const handleTileMouseUp = () => {
    if (!selectStart || !selectEnd) {
      selectingRef.current = false;
      setSelectStart(null);
      setSelectEnd(null);
      return;
    }
    const start = selectStart <= selectEnd ? selectStart : selectEnd;
    const end = selectEnd >= selectStart ? selectEnd : selectStart;
    setModalDefaultStart(start.toISOString());
    setModalDefaultEnd(end.toISOString());
    setEditingTask(null);
    setModalOpen(true);

    selectingRef.current = false;
    setSelectStart(null);
    setSelectEnd(null);
  };

  const isDaySelected = (d: Date) => {
    if (!selectStart || !selectEnd) return false;
    const s = selectStart <= selectEnd ? selectStart : selectEnd;
    const e = selectEnd >= selectStart ? selectEnd : selectStart;
    return d >= s && d <= e;
  };

  const handleModalSave = (task: Task) => {
    if (editingTask) {
      const updated = tasks.map((t) => (t.id === task.id ? task : t));
      setLocalTasks(updated);
      setTasks(updated);
    } else {
      const newTask = { ...task, id: task.id ?? Date.now().toString() };
      const next = [...tasks, newTask];
      setLocalTasks(next);
      setTasks(next);
    }
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setModalDefaultStart(task.startDate);
    setModalDefaultEnd(task.endDate);
    setModalOpen(true);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!active || !over) return;
    const taskId = active.id as string;
    const dropDay = new Date(over.id as string);
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const dur = differenceInCalendarDays(
      parseISO(task.endDate),
      parseISO(task.startDate)
    );
    const newStart = new Date(
      dropDay.getFullYear(),
      dropDay.getMonth(),
      dropDay.getDate()
    );
    const newEnd = addDays(newStart, dur);

    const updated = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            startDate: newStart.toISOString(),
            endDate: newEnd.toISOString(),
          }
        : t
    );
    setLocalTasks(updated);
    setTasks(updated);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!resizingTask) return;
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (!target) return;
      const dayIso = (target as HTMLElement).getAttribute("data-day");
      if (!dayIso) return;

      const day = new Date(dayIso);
      const t = tasks.find((t) => t.id === resizingTask.taskId);
      if (!t) return;

      const updated = tasks.map((task) => {
        if (task.id !== t.id) return task;
        if (resizingTask.edge === "start")
          return { ...task, startDate: day.toISOString() };
        return { ...task, endDate: day.toISOString() };
      });

      setPreviewTasks(updated);
    };

    const handlePointerUp = () => {
      if (previewTasks) setTasks(previewTasks);
      setResizingTask(null);
      setPreviewTasks(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [resizingTask, tasks, previewTasks, setTasks]);

  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  const weekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentMonthYear = format(today, "MMMM yyyy");

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box onMouseUp={handleTileMouseUp}>
        <Box sx={{ mb: 2, textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold">
            {currentMonthYear}
          </Typography>
        </Box>

        <Grid container spacing={0.5} sx={{ mb: 1 }}>
          {weekDayNames.map((dayName) => (
            <Grid key={dayName} sx={{ flex: "1 1 0" }}>
              <Box
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  py: 1,
                }}
              >
                <Typography variant="body2">{dayName}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {weeks.map((week, weekIndex) => (
          <Grid container spacing={0.5} key={weekIndex} sx={{ mb: 0.5 }}>
            {week.map((day) => (
              <Grid key={day.toISOString()} sx={{ flex: "1 1 0" }}>
                <DayTile
                  day={day}
                  tasks={(previewTasks || tasksToRender).filter((t) =>
                    dayIsBetween(day, t.startDate, t.endDate)
                  )}
                  isSelected={isDaySelected(day)}
                  onMouseDown={handleTileMouseDown}
                  onMouseOver={handleTileMouseOver}
                  onMouseUp={handleTileMouseUp}
                  onTaskClick={handleTaskClick}
                  onResizeStart={handleResizeStart}
                />
              </Grid>
            ))}
          </Grid>
        ))}

        <TaskModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingTask(null);
          }}
          defaultStartIso={modalDefaultStart}
          defaultEndIso={modalDefaultEnd}
          initialTask={editingTask ?? null}
          onSave={handleModalSave}
        />
      </Box>
    </DndContext>
  );
};

export default MonthView;
