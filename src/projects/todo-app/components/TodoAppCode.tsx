import React from "react";
import CodeViewer from "@/components/CodeViewer";

export const TodoAppCode = () => {
  const files = {
    "TodoApp.tsx": `import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button, Input } from '@/components/ui';
import { Todo } from './types';

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  // Add more of the actual implementation here...
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      {/* Rest of the component implementation */}
    </div>
  );
};

export default TodoApp;`,
    "types.ts": `export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}`,
    "components/TodoList.tsx": `import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  return (
    <Droppable droppableId="todos">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {/* Todo items implementation */}
        </div>
      )}
    </Droppable>
  );
};`,
    "components/TodoItem.tsx": `import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, index, onToggle, onDelete }) => {
  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {/* Todo item implementation */}
        </div>
      )}
    </Draggable>
  );
};`
  };

  return <CodeViewer files={files} title="Todo App Code" />;
};

export default TodoAppCode;
