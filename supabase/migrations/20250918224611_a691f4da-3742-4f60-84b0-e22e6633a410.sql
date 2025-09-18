-- Add RLS policy to allow users to delete their own destinations
CREATE POLICY "Users can delete their own destinations" 
ON public.trip_destinations 
FOR DELETE 
USING (auth.uid() = suggested_by_user_id);