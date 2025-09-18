export type TaskStatus = "To Do" | "In Progress" | "Review" | "Completed";

export type Task = {
  id: string;
  name: string;
  status: TaskStatus;
  startDate: string;
  endDate: string;
};

export type Filters = {
  categories: TaskStatus[];
  time: "1w" | "2w" | "3w" | null;
  search: string;
};

export type DayTileProps = {
  day: Date;
  tasks: Task[];
  isSelected: boolean;
  onMouseDown: (day: Date) => void;
  onMouseOver: (day: Date) => void;
  onMouseUp: () => void;
};

export interface MonthViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  filters: Filters;
}
