-- Create sales performance data table
CREATE TABLE public.user_sales_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  sales_metrics JSONB NOT NULL DEFAULT '{}',
  monthly_data JSONB NOT NULL DEFAULT '{}',
  company_trip_progress JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_sales_data ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own sales data" 
ON public.user_sales_data 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sales data" 
ON public.user_sales_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sales data" 
ON public.user_sales_data 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sales data" 
ON public.user_sales_data 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sales_data_updated_at
BEFORE UPDATE ON public.user_sales_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();