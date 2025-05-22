
import * as React from "react";
import { Button } from "@/components/ui";

interface TodoFiltersProps {
  filter: "all" | "active" | "completed";
  setFilter: (filter: "all" | "active" | "completed") => void;
}

const TodoFilters: React.FC<TodoFiltersProps> = ({ filter, setFilter }) => {
  return (
    <div className="flex space-x-2 mb-4">
      <Button
        variant={filter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("all")}
        className={`${
          filter === "all"
            ? ""
            : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        All
      </Button>
      <Button
        variant={filter === "active" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("active")}
        className={`${
          filter === "active"
            ? ""
            : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        Active
      </Button>
      <Button
        variant={filter === "completed" ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter("completed")}
        className={`${
          filter === "completed"
            ? ""
            : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        Completed
      </Button>
    </div>
  );
};

export default TodoFilters;
