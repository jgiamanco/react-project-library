import { supabase, handleSupabaseError } from "./supabase-client";
import type { TodoItem } from "./types";
import { v4 as uuidv4 } from "uuid";

// Todo operations
export const getTodosByUser = async (userId: string): Promise<TodoItem[]> => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) handleSupabaseError(error);

  return (
    data?.map((todo) => ({
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      userId: todo.user_id,
      createdAt: todo.created_at,
      updatedAt: todo.updated_at,
    })) || []
  );
};

export const storeTodo = async (
  todo: Omit<TodoItem, "id" | "createdAt" | "updatedAt">
): Promise<TodoItem> => {
  const todoWithId = {
    id: uuidv4(),
    ...todo,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("todos")
    .upsert({
      id: todoWithId.id,
      text: todoWithId.text,
      completed: todoWithId.completed,
      user_id: todoWithId.userId,
      updated_at: todoWithId.updated_at,
    })
    .select()
    .single();

  if (error) handleSupabaseError(error);

  return {
    id: data.id,
    text: data.text,
    completed: data.completed,
    userId: data.user_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const updateTodo = async (todo: TodoItem): Promise<TodoItem> => {
  const { data, error } = await supabase
    .from("todos")
    .update({
      text: todo.text,
      completed: todo.completed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", todo.id)
    .eq("user_id", todo.userId) // Ensure user can only update their own todos
    .select()
    .single();

  if (error) handleSupabaseError(error);

  return {
    id: data.id,
    text: data.text,
    completed: data.completed,
    userId: data.user_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const deleteTodo = async (id: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("user_id", userId); // Ensure user can only delete their own todos

  if (error) handleSupabaseError(error);
};

export const deleteAllTodosByUser = async (userId: string): Promise<void> => {
  const { error } = await supabase.from("todos").delete().eq("user_id", userId);

  if (error) handleSupabaseError(error);
};
