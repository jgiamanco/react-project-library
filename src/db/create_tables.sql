-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table
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

-- Drop existing policies if they exist
IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view their own profile') THEN
  DROP POLICY "Users can view their own profile" ON public.users;
END IF;

IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update their own profile') THEN
  DROP POLICY "Users can update their own profile" ON public.users;
END IF;

IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can insert their own profile') THEN
  DROP POLICY "Users can insert their own profile" ON public.users;
END IF;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid()::text = email);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid()::text = email);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid()::text = email);

-- Grant permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;

-- Create project_sessions table
CREATE TABLE IF NOT EXISTS public.project_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(email),
  project_id VARCHAR NOT NULL,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  settings JSONB DEFAULT '{}',
  progress JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, project_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.project_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for project_sessions table
DO $$
BEGIN
  -- Drop policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_sessions' AND policyname = 'Users can view their own project sessions') THEN
    DROP POLICY "Users can view their own project sessions" ON public.project_sessions;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_sessions' AND policyname = 'Users can manage their own project sessions') THEN
    DROP POLICY "Users can manage their own project sessions" ON public.project_sessions;
  END IF;
  
  -- Create the policies
  CREATE POLICY "Users can view their own project sessions"
    ON public.project_sessions
    FOR SELECT
    USING (auth.uid()::text = user_id);

  CREATE POLICY "Users can manage their own project sessions"
    ON public.project_sessions
    FOR ALL
    USING (auth.uid()::text = user_id);
END
$$;

-- Create todos table
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(email),
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security on all tables
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for todos table
DO $$
BEGIN
  -- Drop policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'todos' AND policyname = 'Users can view their own todos') THEN
    DROP POLICY "Users can view their own todos" ON public.todos;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'todos' AND policyname = 'Users can manage their own todos') THEN
    DROP POLICY "Users can manage their own todos" ON public.todos;
  END IF;
  
  -- Create the policies
  CREATE POLICY "Users can view their own todos"
    ON public.todos
    FOR SELECT
    USING (auth.uid()::text = user_id);

  CREATE POLICY "Users can manage their own todos"
    ON public.todos
    FOR ALL
    USING (auth.uid()::text = user_id);
END
$$;

-- Create the user function for ensuring tables exist
CREATE OR REPLACE FUNCTION public.create_users_table()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Function now just returns true as tables are created by the script
  RETURN true;
END;
$$;

-- Grant execute permission to the function
GRANT EXECUTE ON FUNCTION public.create_users_table() TO anon;
GRANT EXECUTE ON FUNCTION public.create_users_table() TO authenticated;
