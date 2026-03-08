-- Track user activity for analytics
CREATE TABLE public.user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  activity_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all activity"
  ON public.user_activity FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own activity"
  ON public.user_activity FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fix existing RLS policies that use hardcoded email to use has_role instead
DROP POLICY IF EXISTS "Admin can view all detection history" ON public.detection_history;
CREATE POLICY "Admin can view all detection history"
  ON public.detection_history FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admin can delete any product" ON public.products;
CREATE POLICY "Admin can delete any product"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));