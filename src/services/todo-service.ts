
import { supabase, handleSupabaseError, getSupabaseClient } from "./supabase-client";
import type { TodoItem } from "./types";
import { v4 as uuidv4 } from "uuid";

// Todo operations
export const getTodosByUser = async (userId: string): Promise<TodoItem[]> => {
  try {
    const client = getSupabaseClient(true);
    
    const { data, error } = await client
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Admin fetch failed, trying regular client:", error);
      // Try regular client as fallback
      const { data: regularData, error: regularError } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
        
      if (regularError) {
        console.error("Regular fetch also failed:", regularError);
        return [];
      }
      
      return transformTodoItems(regularData);
    }

    return transformTodoItems(data);
  } catch (error) {
    console.error("Error getting todos:", error);
    return [];
  }
};

// Helper function to transform todo items
const transformTodoItems = (data: any[]): TodoItem[] => {
  return (data || []).map((todo) => ({
    id: todo.id,
    text: todo.text,
    completed: todo.completed,
    userId: todo.user_id,
    createdAt: todo.created_at,
    updatedAt: todo.updated_at,
  }));
};

// Updated to accept both a todo object and a userId string
export const storeTodo = async (
  todo: Omit<TodoItem, "id" | "createdAt" | "updatedAt"> | TodoItem,
  userId: string
): Promise<TodoItem> => {
  try {
    // Make sure we have a user ID by using the passed userId parameter
    const todoWithId = {
      id: 'id' in todo ? todo.id : uuidv4(),
      text: todo.text,
      completed: todo.completed,
      userId: userId, // Use the provided userId parameter
      updated_at: new Date().toISOString(),
    };

    const client = getSupabaseClient(true);
    
    const { data, error } = await client
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

    if (error) {
      console.warn("Admin insert failed, trying regular client:", error);
      // Try regular client as fallback
      const { data: regularData, error: regularError } = await supabase
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
      
      if (regularError) {
        console.error("Regular insert also failed:", regularError);
        // Return a constructed todo with the ID we generated
        return {
          id: todoWithId.id,
          text: todoWithId.text,
          completed: todoWithId.completed,
          userId: todoWithId.userId,
          createdAt: new Date().toISOString(),
          updatedAt: todoWithId.updated_at,
        };
      }
      
      return {
        id: regularData.id,
        text: regularData.text,
        completed: regularData.completed,
        userId: regularData.user_id,
        createdAt: regularData.created_at,
        updatedAt: regularData.updated_at,
      };
    }

    return {
      id: data.id,
      text: data.text,
      completed: data.completed,
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error("Error storing todo:", error);
    // Return a constructed todo with the ID we generated as fallback
    const fallbackId = 'id' in todo ? todo.id : uuidv4();
    return {
      id: fallbackId,
      text: todo.text,
      completed: todo.completed,
      userId: userId, // Use the provided userId parameter
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
};

export const updateTodo = async (todo: TodoItem, userId: string): Promise<TodoItem> => {
  try {
    const client = getSupabaseClient(true);
    
    const { data, error } = await client
      .from("todos")
      .update({
        text: todo.text,
        completed: todo.completed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", todo.id)
      .eq("user_id", userId) // Ensure user can only update their own todos
      .select()
      .single();

    if (error) {
      console.warn("Admin update failed, trying regular client:", error);
      // Try regular client as fallback
      const { data: regularData, error: regularError } = await supabase
        .from("todos")
        .update({
          text: todo.text,
          completed: todo.completed,
          updated_at: new Date().toISOString(),
        })
        .eq("id", todo.id)
        .eq("user_id", userId)
        .select()
        .single();
        
      if (regularError) {
        console.error("Regular update also failed:", regularError);
        // Return the input todo as fallback with updated timestamp
        return {
          ...todo,
          updatedAt: new Date().toISOString(),
        };
      }
      
      return {
        id: regularData.id,
        text: regularData.text,
        completed: regularData.completed,
        userId: regularData.user_id,
        createdAt: regularData.created_at,
        updatedAt: regularData.updated_at,
      };
    }

    return {
      id: data.id,
      text: data.text,
      completed: data.completed,
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error("Error updating todo:", error);
    // Return the input todo as fallback with updated timestamp
    return {
      ...todo,
      updatedAt: new Date().toISOString(),
    };
  }
};

export const deleteTodo = async (id: string, userId: string): Promise<void> => {
  try {
    const client = getSupabaseClient(true);
    
    const { error } = await client
      .from("todos")
      .delete()
      .eq("id", id)
      .eq("user_id", userId); // Ensure user can only delete their own todos

    if (error) {
      console.warn("Admin delete failed, trying regular client:", error);
      // Try regular client as fallback
      const { error: regularError } = await supabase
        .from("todos")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
        
      if (regularError) {
        console.error("Regular delete also failed:", regularError);
      }
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

export const deleteAllTodosByUser = async (userId: string): Promise<void> => {
  try {
    const client = getSupabaseClient(true);
    
    const { error } = await client.from("todos").delete().eq("user_id", userId);

    if (error) {
      console.warn("Admin delete all failed, trying regular client:", error);
      // Try regular client as fallback
      const { error: regularError } = await supabase.from("todos").delete().eq("user_id", userId);
      
      if (regularError) {
        console.error("Regular delete all also failed:", regularError);
      }
    }
  } catch (error) {
    console.error("Error deleting all todos:", error);
  }
};
