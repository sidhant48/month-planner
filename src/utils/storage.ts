import type { Task, Filters } from "../types";

const TASKS_KEY = "monthplanner_tasks_v1";
const FILTERS_KEY = "monthplanner_filters_v1";

export const saveTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch {}
};

export const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
};

export const saveFilters = (filters: Filters) => {
  try {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  } catch {}
};

export const loadFilters = (): Filters => {
  try {
    const raw = localStorage.getItem(FILTERS_KEY);
    if (!raw) return { categories: [], time: null, search: "" };
    return JSON.parse(raw) as Filters;
  } catch {
    return { categories: [], time: null, search: "" };
  }
};
