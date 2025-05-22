import {
  supabase,
  handleSupabaseError,
  getSupabaseClient,
} from "./supabase-client";
import type { ProjectSession } from "./types";

type ProjectSettings = Record<string, string | number | boolean | null>;
type ProjectProgress = Record<string, string | number | boolean | null>;

// Initialize or get project session
export const initializeProjectSession = async (
  userId: string,
  projectId: string,
  initialSettings?: ProjectSettings,
  initialProgress?: ProjectProgress
): Promise<ProjectSession> => {
  try {
    const client = getSupabaseClient(true);

    // Try to get existing session first
    const { data: existingSession, error: fetchError } = await client
      .from("project_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (existingSession) {
      // Update last accessed time
      const { data, error } = await client
        .from("project_sessions")
        .update({ last_accessed: new Date().toISOString() })
        .eq("id", existingSession.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Create new session if none exists
    const { data, error } = await client
      .from("project_sessions")
      .insert({
        user_id: userId,
        project_id: projectId,
        settings: initialSettings || {},
        progress: initialProgress || {},
        last_accessed: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error initializing project session:", error);
    throw error;
  }
};

// Auto-save project session with debounce support
let autoSaveTimeout: NodeJS.Timeout;
export const autoSaveProjectSession = async (
  userId: string,
  projectId: string,
  updates: Partial<ProjectSession>,
  debounceMs: number = 2000
): Promise<void> => {
  clearTimeout(autoSaveTimeout);

  autoSaveTimeout = setTimeout(async () => {
    try {
      const client = getSupabaseClient(true);

      const { error } = await client.from("project_sessions").upsert({
        user_id: userId,
        project_id: projectId,
        ...updates,
        last_accessed: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error auto-saving project session:", error);
      // Don't throw error for auto-save to prevent disrupting user experience
    }
  }, debounceMs);
};

// Get project session with error handling
export const getProjectSession = async (
  userId: string,
  projectId: string
): Promise<ProjectSession | null> => {
  try {
    const client = getSupabaseClient(true);

    const { data, error } = await client
      .from("project_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error getting project session:", error);
    return null;
  }
};

// Update project session with validation
export const updateProjectSession = async (
  userId: string,
  projectId: string,
  updates: Partial<ProjectSession>
): Promise<ProjectSession> => {
  try {
    const client = getSupabaseClient(true);

    // Validate updates
    const validatedUpdates = {
      ...updates,
      settings: updates.settings || {},
      progress: updates.progress || {},
      last_accessed: new Date().toISOString(),
    };

    const { data, error } = await client
      .from("project_sessions")
      .upsert({
        user_id: userId,
        project_id: projectId,
        ...validatedUpdates,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating project session:", error);
    throw error;
  }
};

// Cleanup old sessions
export const cleanupOldSessions = async (
  userId: string,
  olderThanDays: number = 30
): Promise<void> => {
  try {
    const client = getSupabaseClient(true);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const { error } = await client
      .from("project_sessions")
      .delete()
      .eq("user_id", userId)
      .lt("last_accessed", cutoffDate.toISOString());

    if (error) throw error;
  } catch (error) {
    console.error("Error cleaning up old sessions:", error);
    // Don't throw error for cleanup to prevent disrupting user experience
  }
};
