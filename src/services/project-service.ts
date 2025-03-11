import { supabase, handleSupabaseError } from "./supabase-client";
import type { ProjectSession } from "./types";

// Project Session operations
export const getProjectSession = async (
  userId: string,
  projectId: string
): Promise<ProjectSession | null> => {
  const { data, error } = await supabase
    .from("project_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Record not found
    handleSupabaseError(error);
  }

  return data
    ? {
        id: data.id,
        userId: data.user_id,
        projectId: data.project_id,
        lastAccessed: data.last_accessed,
        settings: data.settings,
        progress: data.progress,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    : null;
};

export const updateProjectSession = async (
  userId: string,
  projectId: string,
  updates: Partial<ProjectSession>
): Promise<ProjectSession> => {
  const { data, error } = await supabase
    .from("project_sessions")
    .upsert({
      user_id: userId,
      project_id: projectId,
      last_accessed: new Date().toISOString(),
      settings: updates.settings || {},
      progress: updates.progress || {},
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) handleSupabaseError(error);

  return {
    id: data.id,
    userId: data.user_id,
    projectId: data.project_id,
    lastAccessed: data.last_accessed,
    settings: data.settings,
    progress: data.progress,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};
