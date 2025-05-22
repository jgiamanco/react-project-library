
-- Function to create users table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_users_table()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table already exists
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  ) THEN
    RETURN true;
  END IF;

  -- Create users table
  CREATE TABLE public.users (
    email VARCHAR PRIMARY KEY,
    display_name VARCHAR NOT NULL,
    photo_url VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
  );

  -- Enable RLS
  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

  -- Create RLS policies for users table
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

  RETURN true;
END;
$$;

-- Grant execute permission to the function for anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.create_users_table() TO anon;
GRANT EXECUTE ON FUNCTION public.create_users_table() TO authenticated;
