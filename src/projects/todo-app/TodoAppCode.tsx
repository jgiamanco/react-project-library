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
            className={\`ml-2 text-sm cursor-pointer ${
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
};

interface FilterButtonsProps {
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ filter, setFilter }) => (
  <div className="flex space-x-2">
    <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
      All
    </Button>
    <Button variant={filter === 'active' ? 'default' : 'outline'} onClick={() => setFilter('active')}>
      Active
    </Button>
    <Button variant={filter === 'completed' ? 'default' : 'outline'} onClick={() => setFilter('completed')}>
      Completed
    </Button>
  </div>
);

interface ClearCompletedButtonProps {
  clearCompleted: () => void;
}

const ClearCompletedButton: React.FC<ClearCompletedButtonProps> = ({ clearCompleted }) => (
  <Button variant="destructive" onClick={clearCompleted}>
    <CircleSlash className="h-4 w-4 mr-2" />
    Clear Completed
  </Button>
);

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, toggleTodo, removeTodo }) => (
  <Droppable droppableId="todos">
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
        {todos.map((task, index) => (
          <Task key={task.id} task={task} index={index} toggleTodo={toggleTodo} removeTodo={removeTodo} />
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

interface TodoAppProps {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: 'all' | 'active' | 'completed';
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  clearCompleted: () => void;
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  reorderTodos: (startIndex: number, endIndex: number) => void;
}

const TodoApp: React.FC<TodoAppProps> = ({
  todos,
  filteredTodos,
  filter,
  addTodo,
  toggleTodo,
  removeTodo,
  clearCompleted,
  setFilter,
  reorderTodos,
}) => {
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    reorderTodos(result.source.index, result.destination.index);
  };

  return (
    <Card className="w-[400px] p-4 space-y-4">
      <CardHeader>
        <CardTitle>Todo App</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AddTask addTodo={addTodo} />
        <DragDropContext onDragEnd={onDragEnd}>
          <TodoList todos={filteredTodos} toggleTodo={toggleTodo} removeTodo={removeTodo} />
        </DragDropContext>
        <div className="flex items-center justify-between">
          <FilterButtons filter={filter} setFilter={setFilter} />
          <ClearCompletedButton clearCompleted={clearCompleted} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoApp;
`,
    "types.ts": `export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export type TodoFilter = 'all' | 'active' | 'completed';`,
    "hooks/useTodoState.tsx": `import { useState, useCallback } from 'react';
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
    setTodos([...todos, newTodo]);
  }, [todos]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, [todos]);

  const removeTodo = useCallback((id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  }, [todos]);

  const clearCompleted = useCallback(() => {
    setTodos(todos.filter((todo) => !todo.completed));
  }, [todos]);

  const setFilter = useCallback((filter: TodoFilter) => {
    setFilter(filter);
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
