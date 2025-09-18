-- Create admin user directly in auth.users
DO $$
DECLARE
  admin_user_id uuid := gen_random_uuid();
BEGIN
  -- Insert admin user into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    admin_user_id,
    'authenticated',
    'authenticated',
    'mariahadi@outlook.de',
    '$2a$10$kcaHIxW7yxWYUYGe8z2yxeKB2KnHx5OJ8r4hYGfWFwHsRxSKwjd6G', -- Password: 123456
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "admin"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- Insert corresponding profile
  INSERT INTO public.profiles (
    id,
    user_id,
    email,
    first_name,
    last_name,
    role,
    terms_accepted,
    terms_accepted_at
  ) VALUES (
    gen_random_uuid(),
    admin_user_id,
    'mariahadi@outlook.de',
    'Maria',
    'Hadi',
    'admin',
    true,
    now()
  );
END $$;