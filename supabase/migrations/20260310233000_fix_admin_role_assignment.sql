-- Ensure admin role assignment works for existing and future admin account records.

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
  END IF;
  RETURN NEW;
END;
$$;

-- Backfill admin role in case the admin account existed before trigger creation
-- or was created with different email casing.
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(trim(u.email)) = 'admin@agrovision.com'
ON CONFLICT (user_id, role) DO NOTHING;
