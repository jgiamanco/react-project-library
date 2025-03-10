import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://yqbuvfezarqgsevcfoqc.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxYnV2ZmV6YXJxZ3NldmNmb3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2Mjk1NDYsImV4cCI6MjA1NzIwNTU0Nn0.ESPR8o__2Ze-HiYsh2toJt1kf_UdncWYPxx5PniAq4Y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface UserData {
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  twitter?: string;
  role?: string;
  theme?: "light" | "dark" | "system";
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectSession {
  id: string;
  userId: string;
  projectId: string;
  lastAccessed: string;
  settings?: Record<string, string | number | boolean | null>;
  progress?: Record<string, string | number | boolean | null>;
  createdAt?: string;
  updatedAt?: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

// User operations
export const storeUser = async (userData: UserData): Promise<UserData> => {
  const { data, error } = await supabase
    .from("users")
    .upsert({
      email: userData.email,
      display_name: userData.displayName,
      photo_url: userData.photoURL,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return {
    email: data.email,
    displayName: data.display_name,
    photoURL: data.photo_url,
  };
};

export const getUser = async (email: string): Promise<UserData | null> => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("email", email)
    .single();

  if (error) return null;

  return data
    ? {
        email: data.email,
        displayName: data.display_name,
        photoURL: data.photo_url,
      }
    : null;
};

export const deleteUser = async (email: string): Promise<void> => {
  const { error } = await supabase.from("users").delete().eq("email", email);

  if (error) throw error;
};

// User Profile operations
export const getUserProfile = async (
  email: string
): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return null;

  return data
    ? {
        id: data.id,
        email: data.email,
        displayName: data.display_name,
        photoURL: data.photo_url,
        bio: data.bio,
        location: data.location,
        website: data.website,
        github: data.github,
        twitter: data.twitter,
        role: data.role,
        theme: data.theme,
        emailNotifications: data.email_notifications,
        pushNotifications: data.push_notifications,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    : null;
};

export const updateUserProfile = async (
  email: string,
  profile: Partial<UserProfile>
): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from("user_profiles")
    .upsert({
      email,
      display_name: profile.displayName,
      photo_url: profile.photoURL,
      bio: profile.bio,
      location: profile.location,
      website: profile.website,
      github: profile.github,
      twitter: profile.twitter,
      role: profile.role,
      theme: profile.theme,
      email_notifications: profile.emailNotifications,
      push_notifications: profile.pushNotifications,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    email: data.email,
    displayName: data.display_name,
    photoURL: data.photo_url,
    bio: data.bio,
    location: data.location,
    website: data.website,
    github: data.github,
    twitter: data.twitter,
    role: data.role,
    theme: data.theme,
    emailNotifications: data.email_notifications,
    pushNotifications: data.push_notifications,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

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

  if (error) return null;

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
      settings: updates.settings,
      progress: updates.progress,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

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
