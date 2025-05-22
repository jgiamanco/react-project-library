
import { PostgrestError } from "@supabase/supabase-js";

// Database profile structure - this should match exactly what's in Supabase
export interface DbUserProfile {
  id?: string; // Added ID field to match the database schema
  email: string;
  display_name: string;
  photo_url?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  github?: string | null;
  twitter?: string | null;
  role?: string;
  theme?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
  created_at?: string;
  updated_at?: string;
}

// App profile structure - this is what the app uses
export interface UserProfile {
  id?: string; // Added ID field
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
}

// Type guard for database profile
export function isDbProfile(profile: any): profile is DbUserProfile {
  return (
    profile &&
    typeof profile === 'object' &&
    'email' in profile &&
    'display_name' in profile
  );
}

// Convert app profile to database profile
export function appToDbProfile(profile: UserProfile): DbUserProfile {
  return {
    id: profile.id || profile.email, // Use email as ID if no ID is provided
    email: profile.email,
    display_name: profile.displayName || '',
    photo_url: profile.photoURL || null,
    bio: profile.bio || null,
    location: profile.location || null,
    website: profile.website || null,
    github: profile.github || null,
    twitter: profile.twitter || null,
    role: profile.role || 'user',
    theme: profile.theme || 'system',
    email_notifications: profile.emailNotifications !== undefined ? profile.emailNotifications : true,
    push_notifications: profile.pushNotifications !== undefined ? profile.pushNotifications : false
  };
}

// Convert database profile to app profile - This function has the issue
export function dbToAppProfile(profile: DbUserProfile): UserProfile {
  return {
    id: profile.id || profile.email,
    email: profile.email,
    displayName: profile.display_name,
    // Fix: Properly handle null values to preserve them in the app model
    photoURL: profile.photo_url !== null ? profile.photo_url : undefined,
    bio: profile.bio !== null ? profile.bio : undefined,
    location: profile.location !== null ? profile.location : undefined,
    website: profile.website !== null ? profile.website : undefined,
    github: profile.github !== null ? profile.github : undefined,
    twitter: profile.twitter !== null ? profile.twitter : undefined,
    role: profile.role || 'User',
    theme: profile.theme || 'system',
    emailNotifications: profile.email_notifications !== undefined ? profile.email_notifications : true,
    pushNotifications: profile.push_notifications !== undefined ? profile.push_notifications : false
  };
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
