-- Create trip destinations table
CREATE TABLE public.trip_destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination_name TEXT NOT NULL,
  suggested_by_user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create destination votes table  
CREATE TABLE public.destination_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination_id UUID NOT NULL REFERENCES public.trip_destinations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(destination_id, user_id)
);

-- Enable RLS
ALTER TABLE public.trip_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_votes ENABLE ROW LEVEL SECURITY;

-- RLS policies for trip_destinations
CREATE POLICY "Users can view all active destinations" 
ON public.trip_destinations 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can create their own destinations" 
ON public.trip_destinations 
FOR INSERT 
WITH CHECK (auth.uid() = suggested_by_user_id);

CREATE POLICY "Users can update their own destinations" 
ON public.trip_destinations 
FOR UPDATE 
USING (auth.uid() = suggested_by_user_id);

-- RLS policies for destination_votes
CREATE POLICY "Users can view all votes" 
ON public.destination_votes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own votes" 
ON public.destination_votes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
ON public.destination_votes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to get top destinations with vote counts
CREATE OR REPLACE FUNCTION public.get_top_destinations(limit_count INTEGER DEFAULT 3)
RETURNS TABLE (
  id UUID,
  destination_name TEXT,
  vote_count BIGINT,
  suggested_by_user_id UUID
) 
LANGUAGE SQL STABLE
AS $$
  SELECT 
    d.id,
    d.destination_name,
    COALESCE(v.vote_count, 0) as vote_count,
    d.suggested_by_user_id
  FROM public.trip_destinations d
  LEFT JOIN (
    SELECT 
      destination_id, 
      COUNT(*) as vote_count
    FROM public.destination_votes 
    GROUP BY destination_id
  ) v ON d.id = v.destination_id
  WHERE d.is_active = true
  ORDER BY vote_count DESC, d.created_at ASC
  LIMIT limit_count;
$$;