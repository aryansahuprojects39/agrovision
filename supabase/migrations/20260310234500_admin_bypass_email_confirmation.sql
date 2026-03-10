-- Keep email confirmation enabled for all users, but bypass it for the admin account.

CREATE OR REPLACE FUNCTION public.auto_assign_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(trim(NEW.email)) = 'admin@agrovision.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Auto-confirm admin account so admin login is not blocked by email verification.
    UPDATE auth.users
    SET
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      confirmed_at = COALESCE(confirmed_at, now())
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Backfill for existing admin account(s): grant admin role and ensure email is confirmed.
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(trim(u.email)) = 'admin@agrovision.com'
ON CONFLICT (user_id, role) DO NOTHING;

UPDATE auth.users
SET
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  confirmed_at = COALESCE(confirmed_at, now())
WHERE lower(trim(email)) = 'admin@agrovision.com';
