import { PostgrestError } from "@supabase/supabase-js";

// Database types
export interface DbProfile {
  email: string;
  display_name: string;
  photo_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  github: string | null;
  twitter: string | null;
  role: string;
  theme: string;
  email_notifications: boolean;
  push_notifications: boolean;
  created_at: string;
  updated_at: string;
}

// Application types
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
  theme?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Type guard for DbProfile
export function isDbProfile(obj: unknown): obj is DbProfile {
  if (!obj || typeof obj !== "object") return false;
  const profile = obj as Record<string, unknown>;
  return (
    typeof profile.email === "string" &&
    typeof profile.display_name === "string" &&
    (profile.photo_url === null || typeof profile.photo_url === "string") &&
    (profile.bio === null || typeof profile.bio === "string") &&
    (profile.location === null || typeof profile.location === "string") &&
    (profile.website === null || typeof profile.website === "string") &&
    (profile.github === null || typeof profile.github === "string") &&
    (profile.twitter === null || typeof profile.twitter === "string") &&
    typeof profile.role === "string" &&
    typeof profile.theme === "string" &&
    typeof profile.email_notifications === "boolean" &&
    typeof profile.push_notifications === "boolean" &&
    typeof profile.created_at === "string" &&
    typeof profile.updated_at === "string"
  );
}

// Helper function to convert database profile to application profile
export const dbToAppProfile = (dbProfile: DbProfile): UserProfile => ({
  email: dbProfile.email,
  displayName: dbProfile.display_name,
  photoURL: dbProfile.photo_url || undefined,
  bio: dbProfile.bio || undefined,
  location: dbProfile.location || undefined,
  website: dbProfile.website || undefined,
  github: dbProfile.github || undefined,
  twitter: dbProfile.twitter || undefined,
  role: dbProfile.role,
  theme: dbProfile.theme,
  emailNotifications: dbProfile.email_notifications,
  pushNotifications: dbProfile.push_notifications,
  createdAt: dbProfile.created_at,
  updatedAt: dbProfile.updated_at,
});

// Helper function to convert application profile to database profile
export const appToDbProfile = (appProfile: UserProfile): DbProfile => ({
  email: appProfile.email,
  display_name: appProfile.displayName,
  photo_url: appProfile.photoURL || null,
  bio: appProfile.bio || null,
  location: appProfile.location || null,
  website: appProfile.website || null,
  github: appProfile.github || null,
  twitter: appProfile.twitter || null,
  role: appProfile.role || "User",
  theme: appProfile.theme || "system",
  email_notifications: appProfile.emailNotifications ?? true,
  push_notifications: appProfile.pushNotifications ?? false,
  created_at: appProfile.createdAt || new Date().toISOString(),
  updated_at: appProfile.updatedAt || new Date().toISOString(),
});

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
