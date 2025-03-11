import { supabase } from "./supabase-client";
import { TodoItem } from "./types";
import { v4 as uuidv4 } from "uuid";

// Todo operations
export const getTodosByUser = async (userId: string): Promise<TodoItem[]> => {
  try {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Return empty array if no data
    if (!data || data.length === 0) {
      return [];
    }

    return data.map((todo) => ({
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      userId: todo.user_id,
      createdAt: todo.created_at,
      updatedAt: todo.updated_at,
    }));
  } catch (error) {
    console.error("Error fetching todos:", error);
    // Return empty array on error to prevent app from getting stuck
    return [];
  }
};

export const storeTodo = async (todo: Omit<TodoItem, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<TodoItem> => {
  // Generate a UUID if one doesn't exist
  const todoWithId = {
    ...todo,
    id: todo.id || uuidv4(),
    user_id: todo.userId,
  };

  const { data, error } = await supabase
    .from("todos")
    .upsert({
      id: todoWithId.id,
      text: todoWithId.text,
      completed: todoWithId.completed,
      user_id: todoWithId.userId,
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
