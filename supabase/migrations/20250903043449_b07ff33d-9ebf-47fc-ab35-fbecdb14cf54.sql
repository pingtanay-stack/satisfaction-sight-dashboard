-- Create tables for SharePoint integration

-- Table to store SharePoint connection configurations
CREATE TABLE public.sharepoint_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  sharepoint_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'connected', 'error', 'disconnected')),
  error_message TEXT,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to store Microsoft OAuth tokens securely
CREATE TABLE public.microsoft_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  connection_id UUID NOT NULL REFERENCES public.sharepoint_connections(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to store synced customer satisfaction data
CREATE TABLE public.customer_satisfaction_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id UUID NOT NULL REFERENCES public.sharepoint_connections(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sharepoint_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.microsoft_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_satisfaction_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sharepoint_connections
CREATE POLICY "Users can view their own connections" 
ON public.sharepoint_connections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own connections" 
ON public.sharepoint_connections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connections" 
ON public.sharepoint_connections 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own connections" 
ON public.sharepoint_connections 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for microsoft_tokens
CREATE POLICY "Users can view their own tokens" 
ON public.microsoft_tokens 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tokens" 
ON public.microsoft_tokens 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens" 
ON public.microsoft_tokens 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tokens" 
ON public.microsoft_tokens 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for customer_satisfaction_data  
CREATE POLICY "Users can view data from their connections"
ON public.customer_satisfaction_data
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.sharepoint_connections 
    WHERE id = connection_id AND user_id = auth.uid()
  )
);

CREATE POLICY "System can insert data"
ON public.customer_satisfaction_data
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.sharepoint_connections 
    WHERE id = connection_id
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_sharepoint_connections_updated_at
BEFORE UPDATE ON public.sharepoint_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_microsoft_tokens_updated_at
BEFORE UPDATE ON public.microsoft_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_satisfaction_data_updated_at
BEFORE UPDATE ON public.customer_satisfaction_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_sharepoint_connections_user_id ON public.sharepoint_connections(user_id);
CREATE INDEX idx_microsoft_tokens_user_id ON public.microsoft_tokens(user_id);
CREATE INDEX idx_microsoft_tokens_connection_id ON public.microsoft_tokens(connection_id);
CREATE INDEX idx_customer_satisfaction_data_connection_id ON public.customer_satisfaction_data(connection_id);
CREATE INDEX idx_customer_satisfaction_data_period ON public.customer_satisfaction_data(period_start, period_end);