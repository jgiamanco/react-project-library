
// This file re-exports all service functionality for backward compatibility
import { supabase } from "./supabase-client";
import { getUserProfile, updateUserProfile, storeUser, getUser, deleteUser, ensureUsersTable } from "./user-service";
import { getProjectSession, updateProjectSession } from "./project-service";
import { getTodosByUser, storeTodo, deleteTodo, deleteAllTodosByUser } from "./todo-service";
export type { UserData, UserProfile, ProjectSession, TodoItem } from "./types";

// Re-export supabase client
export { supabase };

// Re-export all functions
export {
  // User operations
  storeUser,
  getUser,
  deleteUser,
  ensureUsersTable,
  
  // User Profile operations
  getUserProfile,
  updateUserProfile,
  
  // Project Session operations
  getProjectSession,
  updateProjectSession,
  
  // Todo operations
  getTodosByUser,
  storeTodo,
  deleteTodo,
  deleteAllTodosByUser
};
