import { useState, useEffect, useCallback, useMemo } from "react";
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

  // Load todos from database on mount and when user changes
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
        // Even if there's an error, stop the loading state
        setTodos([]);
      } finally {
        // Always set loading to false to prevent infinite loading
        setIsLoading(false);
      }
    };

    // Set a timeout to ensure loading state doesn't get stuck
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.log("Todo loading taking too long, stopping loading state");
        setIsLoading(false);
      }
    }, 5000);

    loadTodos();

    // Clear timeout on cleanup
    return () => clearTimeout(loadingTimeout);
  }, [user]);

  // Add a new todo (memoized)
  const addTodo = useCallback(async () => {
    if (inputValue.trim() === "" || !user) return;

    const newTodo = {
      id: uuidv4(),
      text: inputValue,
      completed: false,
      userId: user.email,
    };

    try {
      // Optimistically update UI first for better user experience
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setInputValue("");
      
      // Then create the todo in the database
      await storeTodo(newTodo);
    } catch (error) {
      console.error("Error adding todo:", error);
      // If there's an error, remove the optimistically added todo
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== newTodo.id));
    }
  }, [inputValue, user]);

  // Delete a todo (memoized)
  const deleteTodoItem = useCallback(async (id: string) => {
    try {
      // Optimistically update UI
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      // Then delete from database
      await deleteTodo(id);
    } catch (error) {
      console.error("Error deleting todo:", error);
      // If there's an error, reload the todos to restore the correct state
      if (user) {
        const userTodos = await getTodosByUser(user.email);
        setTodos(userTodos);
      }
    }
  }, [user]);

  // Toggle todo completion status (memoized)
  const toggleTodo = useCallback(async (id: string) => {
    setTodos(prevTodos => {
      const todoToUpdate = prevTodos.find(todo => todo.id === id);
      if (!todoToUpdate) return prevTodos;
      
      const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };
      
      // Optimistically update UI
      const updatedTodos = prevTodos.map(todo => 
        todo.id === id ? updatedTodo : todo
      );
      
      // Update in database
      storeTodo(updatedTodo).catch(error => {
        console.error("Error updating todo:", error);
        // Revert on error
        setTodos(prevTodos);
      });
      
      return updatedTodos;
    });
  }, []);

  // Handle drag and drop reordering (memoized)
  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    setTodos(prevTodos => {
      const items = Array.from(prevTodos);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination!.index, 0, reorderedItem);
      return items;
    });
  }, []);

  // Toggle dark/light theme (memoized)
  const toggleTheme = useCallback(() => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  }, []);

  // Clear completed todos (memoized)
  const clearCompleted = useCallback(async () => {
    if (!user) return;
    
    try {
      const completedTodos = todos.filter(todo => todo.completed);
      // Optimistically update UI
      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
      
      // Delete in database
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
    } catch (error) {
      console.error("Error clearing completed todos:", error);
      // Reload todos on error
      if (user) {
        try {
          const userTodos = await getTodosByUser(user.email);
          setTodos(userTodos);
        } catch (loadError) {
          console.error("Error reloading todos:", loadError);
        }
      }
    }
  }, [todos, user]);

  // Memoize filtered todos to prevent unnecessary re-renders
  const filteredTodos = useMemo(() => 
    todos.filter(todo => {
      if (filter === "all") return true;
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    }),
  [todos, filter]);

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
};
