-- Check and update existing admin account or create new one
DO $$
DECLARE
  admin_user_id uuid;
  admin_profile_exists boolean := false;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'mariahadi@outlook.de' 
  LIMIT 1;
  
  -- If user doesn't exist, create it
  IF admin_user_id IS NULL THEN
    admin_user_id := gen_random_uuid();
    
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
  END IF;

  -- Check if profile exists for this user
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE user_id = admin_user_id) INTO admin_profile_exists;
  
  -- If profile doesn't exist, create it
  IF NOT admin_profile_exists THEN
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
  ELSE
    -- Update existing profile to ensure it's admin
    UPDATE public.profiles 
    SET 
      role = 'admin',
      terms_accepted = true,
      terms_accepted_at = COALESCE(terms_accepted_at, now()),
      first_name = COALESCE(first_name, 'Maria'),
      last_name = COALESCE(last_name, 'Hadi')
    WHERE user_id = admin_user_id;
  END IF;
END $$;