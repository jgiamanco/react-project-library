
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
} from "@/components/ui";
import { Plus, Trash2, Check, Sun, Moon } from "lucide-react";
import { useAuth } from "@/contexts/auth-hooks";
import { getTodosByUser, storeTodo, deleteTodo } from "@/services/db-service";

// Define the Todo type
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
}

const TodoApp: React.FC = () => {
  // State
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load todos from database on mount and when user changes
  useEffect(() => {
    const loadTodos = async () => {
      if (!user) {
        setTodos([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userTodos = await getTodosByUser(user.email);
        setTodos(userTodos);
      } catch (error) {
        console.error("Error loading todos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, [user]);

  // Add a new todo
  const addTodo = async () => {
    if (inputValue.trim() === "" || !user) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false,
      userId: user.email,
    };

    try {
      await storeTodo(newTodo);
      setTodos([...todos, newTodo]);
      setInputValue("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Delete a todo
  const deleteTodoItem = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Toggle todo completion status
  const toggleTodo = async (id: string) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) return;
    
    try {
      const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };
      await storeTodo(updatedTodo);
      
      setTodos(
        todos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Handle keyboard input for adding todos
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
    
    // We don't need to update the DB for reordering since we're just
    // changing the visual order, not any data about the todos themselves
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

  // Clear completed todos
  const clearCompleted = async () => {
    if (!user) return;
    
    try {
      const completedTodos = todos.filter(todo => todo.completed);
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
      setTodos(todos.filter(todo => !todo.completed));
    } catch (error) {
      console.error("Error clearing completed todos:", error);
    }
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
            {user ? `Manage your tasks, ${user.displayName}` : "Sign in to save your tasks"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="flex space-x-2 mb-4">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a new task..."
                  className={
                    darkMode ? "bg-gray-700 text-white border-gray-600" : ""
                  }
                  disabled={!user}
                />
                <Button onClick={addTodo} disabled={!user}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

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

              {!user && (
                <div className="text-center py-6 text-muted-foreground border border-dashed rounded-md">
                  Please sign in to save and manage your todos
                </div>
              )}

              {user && (
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
                                      variant="outline"
                                      size="icon"
                                      className={`mr-2 ${
                                        todo.completed
                                          ? "bg-blue-500 text-white border-blue-500"
                                          : "border-blue-500 text-blue-500 hover:bg-blue-50"
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
                                      onClick={() => deleteTodoItem(todo.id)}
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
              )}
            </>
          )}
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
              onClick={clearCompleted}
              className="bg-white text-gray-900 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
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
