-- Create team votes table for live voting system
CREATE TABLE public.team_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT NOT NULL,
  user_id UUID,
  vote_score NUMERIC NOT NULL CHECK (vote_score >= 1 AND vote_score <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_votes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view team votes (public voting)
CREATE POLICY "Anyone can view team votes" 
ON public.team_votes 
FOR SELECT 
USING (true);

-- Allow anyone to insert team votes (public voting)
CREATE POLICY "Anyone can create team votes" 
ON public.team_votes 
FOR INSERT 
WITH CHECK (true);

-- Allow users to update their own votes only if they provided user_id
CREATE POLICY "Users can update their own votes" 
ON public.team_votes 
FOR UPDATE 
USING (user_id IS NULL OR auth.uid() = user_id);

-- Allow users to delete their own votes only if they provided user_id  
CREATE POLICY "Users can delete their own votes" 
ON public.team_votes 
FOR DELETE 
USING (user_id IS NULL OR auth.uid() = user_id);

-- Create function to get team average scores
CREATE OR REPLACE FUNCTION public.get_team_scores()
RETURNS TABLE(team_name text, average_score numeric, vote_count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    tv.team_name,
    ROUND(AVG(tv.vote_score), 1) as average_score,
    COUNT(*) as vote_count
  FROM public.team_votes tv
  GROUP BY tv.team_name
  ORDER BY average_score ASC; -- Lower scores are better (1=best, 5=worst)
$function$

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_team_votes_updated_at
BEFORE UPDATE ON public.team_votes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();