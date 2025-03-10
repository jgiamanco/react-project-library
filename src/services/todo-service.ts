
import { supabase } from "./supabase-client";
import { TodoItem } from "./types";

// Todo operations
export const getTodosByUser = async (userId: string): Promise<TodoItem[]> => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((todo) => ({
    id: todo.id,
    text: todo.text,
    completed: todo.completed,
    userId: todo.user_id,
    createdAt: todo.created_at,
    updatedAt: todo.updated_at,
  }));
};

export const storeTodo = async (todo: TodoItem): Promise<TodoItem> => {
  const { data, error } = await supabase
    .from("todos")
    .upsert({
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      user_id: todo.userId,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    text: data.text,
    completed: data.completed,
    userId: data.user_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const deleteTodo = async (id: string): Promise<void> => {
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) throw error;
};

export const deleteAllTodosByUser = async (userId: string): Promise<void> => {
  const { error } = await supabase.from("todos").delete().eq("user_id", userId);

  if (error) throw error;
};
