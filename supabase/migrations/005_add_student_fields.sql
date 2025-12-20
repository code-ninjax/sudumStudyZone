-- Add Faculty, Department, and Matric Number fields to profiles table

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS faculty TEXT,
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS matric_number TEXT UNIQUE;

-- Create index for matric_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_matric_number ON profiles(matric_number);

-- Create index for department for filtering
CREATE INDEX IF NOT EXISTS idx_profiles_department ON profiles(department);

