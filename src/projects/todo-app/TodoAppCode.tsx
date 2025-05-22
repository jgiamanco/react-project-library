
import CodeViewer from "@/components/CodeViewer";

const TodoAppCode = () => {
  const files = {
    "TodoApp.tsx": `import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { X, GripVertical, Plus, CheckCircle2, CircleSlash } from 'lucide-react';
import { Todo } from './types';

interface TaskProps {
  task: Todo;
  index: number;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
}

const Task: React.FC<TaskProps> = ({ task, index, toggleTodo, removeTodo }) => (
  <Draggable draggableId={task.id} index={index}>
    {(provided) => (
      <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        className="flex items-center justify-between py-2 px-4 rounded-md bg-secondary/50 hover:bg-secondary/80 transition-colors"
      >
        <div className="flex items-center">
          <GripVertical className="mr-2 h-4 w-4 text-muted-foreground cursor-grab" />
          <Checkbox
            id={\`todo-\${task.id}\`}
            checked={task.completed}
            onCheckedChange={() => toggleTodo(task.id)}
          />
          <label
            htmlFor={\`todo-\${task.id}\`}
            className={\`ml-2 text-sm cursor-pointer \${
              task.completed ? 'line-through text-muted-foreground' : ''
            }\`}
          >
            {task.text}
          </label>
        </div>
        <Button variant="ghost" size="sm" onClick={() => removeTodo(task.id)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    )}
  </Draggable>
);

interface AddTaskProps {
  addTodo: (text: string) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ addTodo }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task..."
        className="mr-2"
      />
      <Button type="submit">
        <Plus className="h-4 w-4 mr-2" />
        Add
      </Button>
    </form>
  );
};`,
    "types.ts": `export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export type TodoFilter = 'all' | 'active' | 'completed';`,
    "hooks/useTodoState.tsx": `import { useState, useCallback, useMemo } from 'react';
import { Todo, TodoFilter } from '../types';

export const useTodoState = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  
  const addTodo = useCallback((text: string) => {
    const newTodo: Todo = {
      id: Math.random().toString(36).substring(7),
      text,
      completed: false,
      createdAt: new Date(),
    };
    setTodos(prev => [...prev, newTodo]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const removeTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter((todo) => todo.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter((todo) => !todo.completed));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const reorderTodos = useCallback((startIndex: number, endIndex: number) => {
    const result = Array.from(todos);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    setTodos(result);
  }, [todos]);
  
  return {
    todos,
    filteredTodos,
    filter,
    addTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
    setFilter,
    reorderTodos
  };
};`,
  };

  return <CodeViewer files={files} />;
};

export default TodoAppCode;
