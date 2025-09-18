import React, { useEffect, useState } from "react";
import { Container, Grid, Box, Typography } from "@mui/material";
import MonthView from "./components/CalendarMonthView";
import FilterPanel from "./components/FilterPanel";
import {
  loadTasks,
  saveTasks,
  loadFilters,
  saveFilters,
} from "./utils/storage";
import type { Task, Filters } from "./types";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [filters, setFilters] = useState<Filters>(() => loadFilters());

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);
  useEffect(() => {
    saveFilters(filters);
  }, [filters]);

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Month View Task Planner
      </Typography>
      <Grid container spacing={2}>
        <Grid>
          <FilterPanel filters={filters} setFilters={setFilters} />
        </Grid>
        <Grid>
          <Box sx={{ border: "1px solid #eee", borderRadius: 1, p: 1 }}>
            <MonthView tasks={tasks} setTasks={setTasks} filters={filters} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
