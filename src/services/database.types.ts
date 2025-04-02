export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
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
        };
        Insert: {
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
        };
        Update: {
          email?: string;
          display_name?: string;
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
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
