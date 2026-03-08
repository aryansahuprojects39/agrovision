CREATE TABLE public.detection_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  image_url TEXT,
  disease TEXT NOT NULL,
  confidence TEXT,
  description TEXT,
  treatment TEXT[],
  prevention TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.detection_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own history" ON public.detection_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own history" ON public.detection_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own history" ON public.detection_history FOR DELETE TO authenticated USING (auth.uid() = user_id);