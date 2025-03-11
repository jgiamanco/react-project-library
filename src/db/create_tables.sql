
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  email VARCHAR PRIMARY KEY,
  display_name VARCHAR NOT NULL,
  photo_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  display_name VARCHAR NOT NULL,
  photo_url VARCHAR,
  bio TEXT,
  location VARCHAR,
  website VARCHAR,
  github VARCHAR,
  twitter VARCHAR,
  role VARCHAR,
  theme VARCHAR CHECK (theme IN ('light', 'dark', 'system')),
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

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
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
DO $$
BEGIN
  -- Drop policies if they exist to avoid errors when recreating
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can read own data') THEN
    DROP POLICY "Users can read own data" ON public.users;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can insert own data') THEN
    DROP POLICY "Users can insert own data" ON public.users;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update own data') THEN
    DROP POLICY "Users can update own data" ON public.users;
  END IF;
  
  -- Create the policies
  CREATE POLICY "Users can read own data"
    ON public.users
    FOR SELECT
    USING (auth.uid()::text = email);

  CREATE POLICY "Users can insert own data"
    ON public.users
    FOR INSERT
    WITH CHECK (auth.uid()::text = email);

  CREATE POLICY "Users can update own data"
    ON public.users
    FOR UPDATE
    USING (auth.uid()::text = email);
END
$$;

-- Create RLS policies for user_profiles table
DO $$
BEGIN
  -- Drop policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can view their own profile') THEN
    DROP POLICY "Users can view their own profile" ON public.user_profiles;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can update their own profile') THEN
    DROP POLICY "Users can update their own profile" ON public.user_profiles;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can insert their own profile') THEN
    DROP POLICY "Users can insert their own profile" ON public.user_profiles;
  END IF;
  
  -- Create the policies
  CREATE POLICY "Users can view their own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid()::text = email);

  CREATE POLICY "Users can update their own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid()::text = email);

  CREATE POLICY "Users can insert their own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.uid()::text = email);
END
$$;

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
