-- Create user climate survey data table
CREATE TABLE public.user_climate_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  overall_satisfaction NUMERIC(2,1) DEFAULT 3.0,
  communication_cooperation NUMERIC(2,1) DEFAULT 3.0,
  learning_development NUMERIC(2,1) DEFAULT 3.0,
  team_name TEXT NOT NULL DEFAULT 'General',
  survey_data JSONB DEFAULT '{}',
  monthly_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create climate ideas table for think tank
CREATE TABLE public.climate_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  status TEXT DEFAULT 'New',
  votes INTEGER DEFAULT 0,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.user_climate_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.climate_ideas ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_climate_data
CREATE POLICY "Users can view their own climate data" 
ON public.user_climate_data 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own climate data" 
ON public.user_climate_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own climate data" 
ON public.user_climate_data 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own climate data" 
ON public.user_climate_data 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for climate_ideas (viewable by all, manageable by creator)
CREATE POLICY "Ideas are viewable by everyone" 
ON public.climate_ideas 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create ideas" 
ON public.climate_ideas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own ideas" 
ON public.climate_ideas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas" 
ON public.climate_ideas 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates on climate data
CREATE TRIGGER update_climate_data_updated_at
BEFORE UPDATE ON public.user_climate_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for automatic timestamp updates on ideas
CREATE TRIGGER update_climate_ideas_updated_at
BEFORE UPDATE ON public.climate_ideas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();