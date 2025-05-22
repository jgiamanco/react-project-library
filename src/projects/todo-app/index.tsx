import * as React from "react";
import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  Badge,
  Button,
  Input,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import { Plus, Trash2, Check, Sun, Moon } from "lucide-react";

// Define the Todo type
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodoApp = () => {
  // State
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [darkMode, setDarkMode] = useState(false);

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Add a new todo
  const addTodo = () => {
    if (inputValue.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  // Delete a todo
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Toggle todo completion status
  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Handle keyboard input for adding todos
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  };

  // Filter todos based on current filter
  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // Toggle dark/light theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`min-h-screen p-4 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-100"
      }`}
    >
      <Card
        className={`mx-auto max-w-md ${
          darkMode ? "bg-gray-800 text-white" : ""
        }`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Todo App</CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
          <CardDescription className={darkMode ? "text-gray-400" : ""}>
            Manage your tasks with drag and drop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new task..."
              className={
                darkMode ? "bg-gray-700 text-white border-gray-600" : ""
              }
            />
            <Button onClick={addTodo}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          <div className="flex space-x-2 mb-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
            >
              Completed
            </Button>
          </div>

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
                      <Draggable
                        key={todo.id}
                        draggableId={todo.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              darkMode
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white"
                            } ${todo.completed ? "opacity-70" : ""}`}
                          >
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`mr-2 ${
                                  todo.completed ? "text-green-500" : ""
                                }`}
                                onClick={() => toggleTodo(todo.id)}
                              >
                                <Check
                                  className={`h-5 w-5 ${
                                    !todo.completed && "opacity-0"
                                  }`}
                                />
                              </Button>
                              <span
                                className={
                                  todo.completed
                                    ? "line-through text-gray-500"
                                    : ""
                                }
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
                                onClick={() => deleteTodo(todo.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {todos.filter((t) => !t.completed).length} items left
          </div>
          {todos.some((t) => t.completed) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTodos(todos.filter((t) => !t.completed))}
            >
              Clear completed
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TodoApp;
