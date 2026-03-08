-- Allow admin to view all detection history
CREATE POLICY "Admin can view all detection history"
ON public.detection_history
FOR SELECT
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@agrovision.com'
);

-- Allow admin to view all products (already has public select, so this is fine)
-- Allow admin to delete any product
CREATE POLICY "Admin can delete any product"
ON public.products
FOR DELETE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@agrovision.com'
);