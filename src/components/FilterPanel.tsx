import React from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import type { Filters, TaskStatus } from "../types";

interface Props {
  filters: Filters;
  setFilters: (f: Filters) => void;
}

const STATUSES: TaskStatus[] = ["To Do", "In Progress", "Review", "Completed"];

const FilterPanel: React.FC<Props> = ({ filters, setFilters }) => {
  const toggleCategory = (c: TaskStatus) => {
    const next = filters.categories.includes(c)
      ? filters.categories.filter((s) => s !== c)
      : [...filters.categories, c];
    setFilters({ ...filters, categories: next });
  };

  return (
    <Box sx={{ width: 300, p: 2, borderRight: "1px solid #eee" }}>
      <TextField
        label="Search tasks"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        fullWidth
        size="small"
      />

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Categories</Typography>
        {STATUSES.map((s) => (
          <FormControlLabel
            key={s}
            control={
              <Checkbox
                checked={filters.categories.includes(s)}
                onChange={() => toggleCategory(s)}
              />
            }
            label={s}
          />
        ))}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Time-based</Typography>
        <RadioGroup
          value={filters.time ?? ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              time: e.target.value ? (e.target.value as any) : null,
            })
          }
        >
          <FormControlLabel
            value="1w"
            control={<Radio />}
            label="Tasks within 1 week"
          />
          <FormControlLabel
            value="2w"
            control={<Radio />}
            label="Tasks within 2 weeks"
          />
          <FormControlLabel
            value="3w"
            control={<Radio />}
            label="Tasks within 3 weeks"
          />
        </RadioGroup>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setFilters({ categories: [], time: null, search: "" })}
        >
          Clear Filters
        </Button>
      </Box>
    </Box>
  );
};

export default FilterPanel;
