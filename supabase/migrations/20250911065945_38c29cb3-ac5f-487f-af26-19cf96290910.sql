-- Add monthly_targets column to user_sales_data table
ALTER TABLE public.user_sales_data 
ADD COLUMN IF NOT EXISTS monthly_targets JSONB DEFAULT '{}'::jsonb;