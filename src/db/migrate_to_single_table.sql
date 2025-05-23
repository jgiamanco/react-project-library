-- Start a transaction
BEGIN;

-- First, create a temporary table to store the merged data
CREATE TEMP TABLE temp_merged_users AS
SELECT 
  COALESCE(u.email, up.email) AS email,
  COALESCE(u.display_name, up.display_name) AS display_name,
  COALESCE(u.photo_url, up.photo_url) AS photo_url,
  COALESCE(u.bio, up.bio) AS bio,
  COALESCE(u.location, up.location) AS location,
  COALESCE(u.website, up.website) AS website,
  COALESCE(u.github, up.github) AS github,
  COALESCE(u.twitter, up.twitter) AS twitter,
  COALESCE(u.role, up.role, 'user') AS role,
  COALESCE(u.theme, up.theme, 'system') AS theme,
  COALESCE(u.email_notifications, up.email_notifications, true) AS email_notifications,
  COALESCE(u.push_notifications, up.push_notifications, false) AS push_notifications,
  COALESCE(u.created_at, up.created_at, NOW()) AS created_at,
  COALESCE(u.updated_at, up.updated_at, NOW()) AS updated_at
FROM users u
FULL OUTER JOIN user_profiles up ON u.email = up.email;

-- Drop the existing tables
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Recreate the users table with the updated schema
CREATE TABLE users (
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
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = email);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = email);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = email);

-- Insert the merged data back into the users table
INSERT INTO users (
  email,
  display_name,
  photo_url,
  bio,
  location,
  website,
  github,
  twitter,
  role,
  theme,
  email_notifications,
  push_notifications,
  created_at,
  updated_at
)
SELECT * FROM temp_merged_users;

-- Drop the temporary table
DROP TABLE temp_merged_users;

-- Grant permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;

-- Commit the transaction
COMMIT; 