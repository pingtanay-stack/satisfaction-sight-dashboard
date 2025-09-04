-- Add nps_comments column to store customer feedback comments
ALTER TABLE user_dashboard_data 
ADD COLUMN nps_comments JSONB DEFAULT '[]'::jsonb;