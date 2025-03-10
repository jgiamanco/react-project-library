-- Create users table
CREATE TABLE IF NOT EXISTS users (
  email VARCHAR PRIMARY KEY,
  display_name VARCHAR NOT NULL,
  photo_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
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

-- Create project sessions table
CREATE TABLE IF NOT EXISTS project_sessions (
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
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(email),
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = email);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = email);

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid()::text = email);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid()::text = email);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid()::text = email);

-- Project sessions policies
CREATE POLICY "Users can view their own project sessions" ON project_sessions
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own project sessions" ON project_sessions
  FOR ALL USING (auth.uid()::text = user_id);

-- Todos policies
CREATE POLICY "Users can view their own todos" ON todos
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can manage their own todos" ON todos
  FOR ALL USING (auth.uid()::text = user_id); 