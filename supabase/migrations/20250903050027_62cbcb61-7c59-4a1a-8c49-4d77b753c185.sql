-- Create a simple table to store user's dashboard data
CREATE TABLE public.user_dashboard_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metrics JSONB NOT NULL,
  nps_data JSONB NOT NULL,
  satisfaction_data JSONB NOT NULL,
  jira_data JSONB NOT NULL,
  adhoc_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_dashboard_data ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own dashboard data" 
ON public.user_dashboard_data 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dashboard data" 
ON public.user_dashboard_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboard data" 
ON public.user_dashboard_data 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dashboard data" 
ON public.user_dashboard_data 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_dashboard_data_updated_at
BEFORE UPDATE ON public.user_dashboard_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();