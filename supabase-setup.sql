-- Drop existing tables and functions if they exist
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP FUNCTION IF EXISTS public.exec_sql(text) CASCADE;

-- Create exec_sql function for admin operations
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Create users table
CREATE TABLE public.users (
    email VARCHAR PRIMARY KEY,
    display_name VARCHAR NOT NULL,
    photo_url VARCHAR,
    bio TEXT,
    location VARCHAR,
    website VARCHAR,
    github VARCHAR,
    twitter VARCHAR,
    role VARCHAR DEFAULT 'User',
    theme VARCHAR DEFAULT 'system',
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data"
    ON public.users
    FOR SELECT
    USING (auth.jwt()->>'email' = email);

CREATE POLICY "Users can update their own data"
    ON public.users
    FOR UPDATE
    USING (auth.jwt()->>'email' = email);

CREATE POLICY "Users can insert their own data"
    ON public.users
    FOR INSERT
    WITH CHECK (auth.jwt()->>'email' = email);

-- Create user_profiles table
CREATE TABLE public.user_profiles (
    email VARCHAR PRIMARY KEY REFERENCES public.users(email) ON DELETE CASCADE,
    display_name VARCHAR NOT NULL,
    photo_url VARCHAR,
    bio TEXT,
    location VARCHAR,
    website VARCHAR,
    github VARCHAR,
    twitter VARCHAR,
    role VARCHAR DEFAULT 'User',
    theme VARCHAR DEFAULT 'system',
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.jwt()->>'email' = email);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.jwt()->>'email' = email);

CREATE POLICY "Users can insert their own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.jwt()->>'email' = email);

-- Grant necessary permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create function to sync user data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into users table
    INSERT INTO public.users (email, display_name, photo_url)
    VALUES (
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'photo_url'
    );

    -- Insert into user_profiles table
    INSERT INTO public.user_profiles (email, display_name, photo_url)
    VALUES (
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'photo_url'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 