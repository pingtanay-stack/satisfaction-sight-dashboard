-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.get_top_destinations(limit_count INTEGER DEFAULT 3)
RETURNS TABLE (
  id UUID,
  destination_name TEXT,
  vote_count BIGINT,
  suggested_by_user_id UUID
) 
LANGUAGE SQL STABLE
SECURITY DEFINER SET search_path = public
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