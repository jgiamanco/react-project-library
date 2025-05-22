
import * as React from "react";
import { Button } from "@/components/ui";

interface TodoFooterProps {
  todos: {
    id: string;
    completed: boolean;
  }[];
  darkMode: boolean;
  clearCompleted: () => void;
}

const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  darkMode,
  clearCompleted,
}) => {
  return (
    <div className="flex justify-between">
      <div
        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        {todos.filter((t) => !t.completed).length} items left
      </div>
      {todos.some((t) => t.completed) && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearCompleted}
          className="bg-white text-gray-900 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
        >
          Clear completed
        </Button>
      )}
    </div>
  );
};

export default TodoFooter;
