
import * as React from "react";
import { memo } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Button, Badge } from "@/components/ui";
import { Trash2, Check } from "lucide-react";

interface TodoItemProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
  };
  index: number;
  toggleTodo: (id: string) => void;
  deleteTodoItem: (id: string) => void;
  darkMode: boolean;
}

// Using memo to prevent unnecessary re-renders
const TodoItem: React.FC<TodoItemProps> = memo(({
  todo,
  index,
  toggleTodo,
  deleteTodoItem,
  darkMode,
}) => {
  const handleToggle = React.useCallback(() => {
    toggleTodo(todo.id);
  }, [toggleTodo, todo.id]);

  const handleDelete = React.useCallback(() => {
    deleteTodoItem(todo.id);
  }, [deleteTodoItem, todo.id]);

  return (
    <Draggable key={todo.id} draggableId={todo.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex items-center justify-between p-3 rounded-lg border ${
            darkMode ? "bg-gray-700 border-gray-600" : "bg-white"
          } ${todo.completed ? "opacity-70" : ""}`}
        >
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className={`mr-2 ${
                todo.completed
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-blue-500 text-blue-500 hover:bg-blue-50"
              }`}
              onClick={handleToggle}
            >
              <Check
                className={`h-5 w-5 ${!todo.completed && "opacity-0"}`}
              />
            </Button>
            <span
              className={`${
                todo.completed
                  ? "line-through text-gray-500"
                  : darkMode
                  ? "text-gray-100"
                  : "text-gray-900"
              }`}
            >
              {todo.text}
            </span>
          </div>
          <div className="flex items-center">
            {todo.completed && (
              <Badge
                variant="outline"
                className="mr-2 text-green-500 border-green-500"
              >
                Done
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  );
});

TodoItem.displayName = "TodoItem";

export default TodoItem;
