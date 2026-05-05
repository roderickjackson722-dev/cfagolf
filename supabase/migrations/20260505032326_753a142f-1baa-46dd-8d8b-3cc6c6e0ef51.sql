
CREATE POLICY "Admins can view all target schools" ON public.target_schools FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins can view all coach contacts" ON public.coach_contacts FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins can view all tournament results" ON public.tournament_results FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins can view all campus visits" ON public.campus_visits FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins can view all scholarship offers" ON public.scholarship_offers FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins can view all recruiting milestones" ON public.recruiting_milestones FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins can view all transfer portal entries" ON public.transfer_portal_entries FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins can view all favorites" ON public.favorites FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins can view all wagr attendance" ON public.wagr_attendance FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
