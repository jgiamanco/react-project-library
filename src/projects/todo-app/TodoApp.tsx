
import * as React from "react";
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

export default TodoApp;
