import { PostgrestError } from "@supabase/supabase-js";

// Common types for services
export interface UserProfile {
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

// UserData is now an alias of UserProfile for backward compatibility
export type UserData = UserProfile;

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

// Weather dashboard favorite locations
export interface WeatherFavorites {
  favorites: FavoriteLocation[];
}

// Define the FavoriteLocation interface if not already defined
export interface FavoriteLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

// Markdown editor notes and folders
export interface MarkdownNotes {
  notes: Note[];
  folders: Folder[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
}

export type DbResult<T> = {
  data: T | null;
  error: PostgrestError | null;
};

export type DbResultList<T> = {
  data: T[] | null;
  error: PostgrestError | null;
};
