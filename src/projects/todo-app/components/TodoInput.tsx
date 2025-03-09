
import * as React from "react";
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
      <Button onClick={addTodo} disabled={disabled}>
        <Plus className="h-4 w-4 mr-1" /> Add
      </Button>
    </div>
  );
};

export default TodoInput;
