
-- Add session tracking columns to meeting_progress
ALTER TABLE public.meeting_progress 
  ADD COLUMN IF NOT EXISTS session_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS session_duration_minutes integer,
  ADD COLUMN IF NOT EXISTS meet_link text,
  ADD COLUMN IF NOT EXISTS next_agenda text;

-- Session notes table (shared between admin and user)
CREATE TABLE public.session_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_number integer NOT NULL,
  author_id uuid NOT NULL,
  author_role text NOT NULL DEFAULT 'admin',
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.session_notes ENABLE ROW LEVEL SECURITY;

-- Users can view notes for their own sessions
CREATE POLICY "Users can view own session notes"
  ON public.session_notes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add notes to their own sessions
CREATE POLICY "Users can add own session notes"
  ON public.session_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id AND author_role = 'user');

-- Users can update their own authored notes
CREATE POLICY "Users can update own authored notes"
  ON public.session_notes FOR UPDATE
  USING (auth.uid() = author_id AND author_role = 'user');

-- Users can delete their own authored notes
CREATE POLICY "Users can delete own authored notes"
  ON public.session_notes FOR DELETE
  USING (auth.uid() = author_id AND author_role = 'user');

-- Admins can do everything with session notes
CREATE POLICY "Admins can manage all session notes"
  ON public.session_notes FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Session action items table
CREATE TABLE public.session_action_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_number integer NOT NULL,
  title text NOT NULL,
  is_completed boolean NOT NULL DEFAULT false,
  completed_date timestamp with time zone,
  assigned_by text NOT NULL DEFAULT 'admin',
  due_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.session_action_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own action items
CREATE POLICY "Users can view own action items"
  ON public.session_action_items FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own action items (mark complete)
CREATE POLICY "Users can update own action items"
  ON public.session_action_items FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can do everything with action items
CREATE POLICY "Admins can manage all action items"
  ON public.session_action_items FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Add updated_at triggers
CREATE TRIGGER update_session_notes_updated_at
  BEFORE UPDATE ON public.session_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_action_items_updated_at
  BEFORE UPDATE ON public.session_action_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
