    -- Migration 009: Seed Admin Users
    -- This script creates the initial admin users safely.
    -- IMPORTANT: Run this in the Supabase SQL Editor.

    -- Enable pgcrypto for password hashing
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    -- Function to create an admin user safely
    CREATE OR REPLACE FUNCTION public.create_admin_user(
        email_address TEXT,
        password_text TEXT,
        full_name_text TEXT
    ) RETURNS VOID AS $$
    DECLARE
        new_user_id UUID := gen_random_uuid();
        existing_user_id UUID;
    BEGIN
        -- Check if user already exists
        SELECT id INTO existing_user_id FROM auth.users WHERE email = email_address;

        IF existing_user_id IS NULL THEN
            -- 1. Insert into auth.users
            INSERT INTO auth.users (
                id,
                instance_id,
                email,
                encrypted_password,
                email_confirmed_at,
                raw_app_meta_data,
                raw_user_meta_data,
                is_super_admin,
                role,
                aud,
                created_at,
                updated_at
            )
            VALUES (
                new_user_id,
                '00000000-0000-0000-0000-000000000000',
                email_address,
                crypt(password_text, gen_salt('bf')),
                now(),
                '{"provider":"email","providers":["email"]}',
                jsonb_build_object('full_name', full_name_text, 'role', 'admin'),
                false,
                'authenticated',
                'authenticated',
                now(),
                now()
            );
            existing_user_id := new_user_id;
        END IF;

        -- 2. Ensure profile exists and has admin role
        INSERT INTO public.profiles (id, full_name, role)
        VALUES (
            existing_user_id,
            full_name_text,
            'admin'
        )
        ON CONFLICT (id) DO UPDATE SET role = 'admin', full_name = EXCLUDED.full_name;

    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Create the 3 admin users
    SELECT public.create_admin_user('believe@gmail.com', 'Sudum@2025', 'Believe Admin');
    SELECT public.create_admin_user('theodore@mail.com', 'Sudum@2025', 'Theodore Admin');
    SELECT public.create_admin_user('sudum@gmail.com', 'Sudum@2025', 'Dr. Sudum Admin');

    -- Clean up helper function
    DROP FUNCTION public.create_admin_user(TEXT, TEXT, TEXT);
