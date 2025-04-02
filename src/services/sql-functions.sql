-- Function to get all tables in a schema
CREATE OR REPLACE FUNCTION get_tables(schema_name text)
RETURNS TABLE (
  table_name text,
  table_type text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.table_name::text,
    t.table_type::text
  FROM information_schema.tables t
  WHERE t.table_schema = schema_name
  AND t.table_type = 'BASE TABLE'
  ORDER BY t.table_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get table structure without data
CREATE OR REPLACE FUNCTION get_table_structure(table_name text)
RETURNS TABLE (
  column_name text,
  data_type text,
  is_nullable text,
  column_default text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text,
    c.column_default::text
  FROM information_schema.columns c
  WHERE c.table_name = table_name
  ORDER BY c.ordinal_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if RLS is enabled
CREATE OR REPLACE FUNCTION is_rls_enabled(table_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM pg_tables t
    JOIN pg_class c ON t.tablename = c.relname
    WHERE t.tablename = table_name
    AND c.relrowsecurity = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get policies for a table
CREATE OR REPLACE FUNCTION get_policies(table_name text)
RETURNS TABLE (
  policyname text,
  permissive text,
  roles text[],
  cmd text,
  qual text,
  with_check text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.policyname::text,
    p.permissive::text,
    p.roles::text[],
    p.cmd::text,
    p.qual::text,
    p.with_check::text
  FROM pg_policies p
  WHERE p.tablename = table_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.users;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
ON public.users
FOR SELECT
USING (
  auth.uid()::text = email OR
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
USING (
  auth.uid()::text = email OR
  auth.role() = 'service_role'
);

CREATE POLICY "Users can insert their own profile"
ON public.users
FOR INSERT
WITH CHECK (
  auth.uid()::text = email OR
  auth.role() = 'service_role'
);

CREATE POLICY "Users can delete their own profile"
ON public.users
FOR DELETE
USING (
  auth.uid()::text = email OR
  auth.role() = 'service_role'
);

-- Grant necessary permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;
GRANT SELECT ON public.users TO anon; 