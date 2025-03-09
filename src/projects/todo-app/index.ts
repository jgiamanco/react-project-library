
import TodoApp from "./TodoApp";

// Define the project metadata
const TodoAppProject = {
  app: TodoApp,
  code: () => import("./TodoAppCode"),
  title: "Todo App",
  description: "A simple task management application with drag and drop functionality"
};

export default TodoAppProject;
