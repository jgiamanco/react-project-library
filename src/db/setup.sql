-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Drop user_profiles policies
    DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
    
    -- Drop project_sessions policies
    DROP POLICY IF EXISTS "Users can read own project sessions" ON public.project_sessions;
    DROP POLICY IF EXISTS "Users can insert own project sessions" ON public.project_sessions;
    DROP POLICY IF EXISTS "Users can update own project sessions" ON public.project_sessions;
    DROP POLICY IF EXISTS "Users can delete own project sessions" ON public.project_sessions;
EXCEPTION
    WHEN undefined_table THEN 
        NULL;
END $$;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS handle_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS handle_updated_at ON public.project_sessions;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- Drop existing tables and policies
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop users policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- Drop triggers
DROP TRIGGER IF EXISTS handle_updated_at ON public.users;

-- Create or update users table
CREATE TABLE IF NOT EXISTS public.users (
  email TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  github TEXT,
  twitter TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  theme TEXT NOT NULL DEFAULT 'system',
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  push_notifications BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create new policies for users
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid()::text = email);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid()::text = email);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid()::text = email);

CREATE POLICY "Users can delete their own profile"
  ON public.users FOR DELETE
  USING (auth.uid()::text = email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
DROP INDEX IF EXISTS idx_users_email;
CREATE INDEX idx_users_email ON public.users(email);

-- Grant permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;

-- Create or update user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL REFERENCES auth.users(email) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    photo_url TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    github TEXT,
    twitter TEXT,
    role TEXT,
    theme TEXT DEFAULT 'system',
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(email)
);

-- Create or update project_sessions table
CREATE TABLE IF NOT EXISTS public.project_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(email) ON DELETE CASCADE,
    project_id TEXT NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb,
    progress JSONB DEFAULT '{}'::jsonb,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, project_id)
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_sessions ENABLE ROW LEVEL SECURITY;

-- Create new policies for user_profiles
CREATE POLICY "Enable read access for own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid()::text = email);

CREATE POLICY "Enable insert access for own profile"
    ON public.user_profiles FOR INSERT
    WITH CHECK (auth.uid()::text = email);

CREATE POLICY "Enable update access for own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid()::text = email);

CREATE POLICY "Enable delete access for own profile"
    ON public.user_profiles FOR DELETE
    USING (auth.uid()::text = email);

-- Create new policies for project_sessions
CREATE POLICY "Users can read own project sessions"
    ON public.project_sessions
    FOR SELECT
    USING ((auth.uid())::text = (email)::text);

CREATE POLICY "Users can insert own project sessions"
    ON public.project_sessions
    FOR INSERT
    WITH CHECK ((auth.uid())::text = (email)::text);

CREATE POLICY "Users can update own project sessions"
    ON public.project_sessions
    FOR UPDATE
    USING ((auth.uid())::text = (email)::text);

CREATE POLICY "Users can delete own project sessions"
    ON public.project_sessions
    FOR DELETE
    USING ((auth.uid())::text = (email)::text);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.project_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create or update indexes
DROP INDEX IF EXISTS idx_user_profiles_email;
DROP INDEX IF EXISTS idx_project_sessions_user_id;
DROP INDEX IF EXISTS idx_project_sessions_project_id;

CREATE INDEX idx_project_sessions_user_id ON public.project_sessions(user_id);
CREATE INDEX idx_project_sessions_project_id ON public.project_sessions(project_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 