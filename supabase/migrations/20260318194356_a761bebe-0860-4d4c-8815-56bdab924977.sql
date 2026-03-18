-- Allow admins to view all worksheet data
CREATE POLICY "Admins can view all worksheet data"
ON public.worksheet_data
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));