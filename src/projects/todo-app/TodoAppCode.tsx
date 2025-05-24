import React from "react";
import CodeViewer from "@/components/CodeViewer";

const TodoAppCode = () => {
  const files = {
    "TodoApp.tsx": `import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import TodoInput from "./components/TodoInput";
import TodoFilters from "./components/TodoFilters";
import TodoList from "./components/TodoList";
import TodoFooter from "./components/TodoFooter";
import { useTodoState } from "./hooks/useTodoState";

const TodoApp: React.FC = () => {
  const {
    todos,
    inputValue,
    setInputValue,
    filter,
    setFilter,
    darkMode,
    isLoading,
    user,
    addTodo,
    deleteTodoItem,
    toggleTodo,
    handleDragEnd,
    toggleTheme,
    clearCompleted,
  } = useTodoState();

  return (
    <div
      className={\`min-h-screen p-4 \${
        darkMode ? "dark bg-gray-900" : "bg-gray-100"
      }\`}
    >
      <Card
        className={\`mx-auto max-w-md \${
          darkMode ? "bg-gray-800 text-white" : ""
        }\`}
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
            {user ? \`Manage your tasks, \${user.displayName}\` : "Sign in to save your tasks"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TodoInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            addTodo={addTodo}
            darkMode={darkMode}
            disabled={!user}
          />

          <TodoFilters filter={filter} setFilter={setFilter} />

          {!user && (
            <div className="text-center py-6 text-muted-foreground border border-dashed rounded-md">
              Please sign in to save and manage your todos
            </div>
          )}

          {user && (
            <>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
                </div>
              ) : (
                <TodoList
                  todos={todos}
                  filter={filter}
                  toggleTodo={toggleTodo}
                  deleteTodoItem={deleteTodoItem}
                  handleDragEnd={handleDragEnd}
                  darkMode={darkMode}
                />
              )}
            </>
          )}
        </CardContent>
        <CardFooter>
          <TodoFooter
            todos={todos}
            darkMode={darkMode}
            clearCompleted={clearCompleted}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default TodoApp;`,
    "components/TodoInput.tsx": `import * as React from "react";
import { Button, Input } from "@/components/ui";
import { Plus } from "lucide-react";

interface TodoInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  addTodo: () => void;
  darkMode: boolean;
  disabled: boolean;
}

const TodoInput: React.FC<TodoInputProps> = ({
  inputValue,
  setInputValue,
  addTodo,
  darkMode,
  disabled,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <div className="flex space-x-2 mb-4">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a new task..."
        className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}
        disabled={disabled}
      />
      <Button onClick={handleAddClick} disabled={disabled || !inputValue.trim()}>
        <Plus className="h-4 w-4 mr-1" /> Add
      </Button>
    </div>
  );
};

export default TodoInput;`,
    "components/TodoFilters.tsx": `import * as React from "react";
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
  );
};

export default TodoFilters;`,
    "components/TodoList.tsx": `import * as React from "react";
import { memo, useMemo } from "react";
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

const TodoList: React.FC<TodoListProps> = memo(({
  todos,
  filter,
  toggleTodo,
  deleteTodoItem,
  handleDragEnd,
  darkMode,
}) => {
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === "all") return true;
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    });
  }, [todos, filter]);

  const emptyStateMessage = useMemo(() => (
    <div
      className={\`text-center py-4 \${
        darkMode ? "text-gray-400" : "text-gray-500"
      }\`}
    >
      No tasks found
    </div>
  ), [darkMode]);

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
              emptyStateMessage
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
});

TodoList.displayName = "TodoList";

export default TodoList;`,
    "components/TodoItem.tsx": `import * as React from "react";
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
          className={\`flex items-center justify-between p-3 rounded-lg border \${
            darkMode ? "bg-gray-700 border-gray-600" : "bg-white"
          } \${
            todo.completed ? "opacity-70" : ""
          }\`}
        >
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className={\`mr-2 \${
                todo.completed
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-blue-500 text-blue-500 hover:bg-blue-50"
              }\`}
              onClick={handleToggle}
            >
              <Check
                className={\`h-5 w-5 \${
                  !todo.completed && "opacity-0"
                }\`}
              />
            </Button>
            <span
              className={\`$\{
                todo.completed
                  ? "line-through text-gray-500"
                  : darkMode
                  ? "text-gray-100"
                  : "text-gray-900"
              }\`}
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

export default TodoItem;`,
    "hooks/useTodoState.tsx": `import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/auth-hooks";
import { getTodosByUser, storeTodo, deleteTodo } from "@/services/todo-service";
import { DropResult } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
}

export const useTodoState = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsLoading(true);

        if (!user) {
          setTodos([]);
          setIsLoading(false);
          return;
        }

        const userTodos = await getTodosByUser(user.email);
        setTodos(userTodos);
      } catch (error) {
        console.error("Error loading todos:", error);
        setTodos([]);
      } finally {
        setIsLoading(false);
      }
    };

    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.log("Todo loading taking too long, stopping loading state");
        setIsLoading(false);
      }
    }, 3000);

    loadTodos();

    return () => clearTimeout(loadingTimeout);
  }, [user]);

  const addTodo = useCallback(async () => {
    if (inputValue.trim() === "") return;

    const newTodo = {
      id: uuidv4(),
      text: inputValue,
      completed: false,
      userId: user?.email || "anonymous",
    };

    try {
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setInputValue("");

      if (user) {
        try {
          await storeTodo(newTodo, user.email);
        } catch (error) {
          console.error("Error adding todo:", error);
        }
      }
    } catch (error) {
      console.error("Unexpected error in addTodo:", error);
    }
  }, [inputValue, user]);

  const deleteTodoItem = useCallback(
    async (id: string) => {
      try {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

        if (user) {
          try {
            await deleteTodo(id, user.email);
          } catch (error) {
            console.error("Error deleting todo:", error);
          }
        }
      } catch (error) {
        console.error("Unexpected error in deleteTodoItem:", error);
      }
    },
    [user]
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      setTodos((prevTodos) => {
        const todoToUpdate = prevTodos.find((todo) => todo.id === id);
        if (!todoToUpdate) return prevTodos;

        const updatedTodo = {
          ...todoToUpdate,
          completed: !todoToUpdate.completed,
        };

        const updatedTodos = prevTodos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        );

        if (user) {
          storeTodo(updatedTodo, user.email).catch((error) => {
            console.error("Error updating todo:", error);
          });
        }

        return updatedTodos;
      });
    },
    [user]
  );

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    setTodos((prevTodos) => {
      const items = Array.from(prevTodos);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination!.index, 0, reorderedItem);
      return items;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  }, []);

  const clearCompleted = useCallback(async () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));

    if (user) {
      try {
        await Promise.all(
          completedTodos.map((todo) => deleteTodo(todo.id, user.email))
        );
      } catch (error) {
        console.error("Error clearing completed todos:", error);
      }
    }
  }, [todos, user]);

  const filteredTodos = useMemo(
    () =>
      todos.filter((todo) => {
        if (filter === "all") return true;
        if (filter === "active") return !todo.completed;
        if (filter === "completed") return todo.completed;
        return true;
      }),
    [todos, filter]
  );

  return {
    todos,
    filteredTodos,
    inputValue,
    setInputValue,
    filter,
    setFilter,
    darkMode,
    setDarkMode,
    isLoading,
    user,
    addTodo,
    deleteTodoItem,
    toggleTodo,
    handleDragEnd,
    toggleTheme,
    clearCompleted,
  };
};`,
    "types.ts": `export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
}`
  };

  return <CodeViewer files={files} />;
};

export default TodoAppCode;