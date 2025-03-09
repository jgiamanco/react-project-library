
import * as React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import TodoItem from "./TodoItem";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
}

interface TodoListProps {
  todos: Todo[];
  filter: "all" | "active" | "completed";
  toggleTodo: (id: string) => void;
  deleteTodoItem: (id: string) => void;
  handleDragEnd: (result: DropResult) => void;
  darkMode: boolean;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  toggleTodo,
  deleteTodoItem,
  handleDragEnd,
  darkMode,
}) => {
  // Filter todos based on current filter
  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {filteredTodos.length === 0 ? (
              <div
                className={`text-center py-4 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No tasks found
              </div>
            ) : (
              filteredTodos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  index={index}
                  toggleTodo={toggleTodo}
                  deleteTodoItem={deleteTodoItem}
                  darkMode={darkMode}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TodoList;
