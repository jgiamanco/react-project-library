
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-hooks";
import { getTodosByUser, storeTodo, deleteTodo } from "@/services/todo-service";
import { DropResult } from "react-beautiful-dnd";

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

  // Handle drag and drop reordering
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  };

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

  return {
    todos,
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
};
