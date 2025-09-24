import { supabase } from '@/integrations/supabase/client';

export interface MonthlyTargetData {
  month: string;
  targets: { [productKey: string]: number };
  actuals: { [productKey: string]: number };
}

export interface SalesData {
  salesMetrics: {
    // External Sales - Health IT
    eclair: { current: number; target: number; achieved: number };
    delphicAP: { current: number; target: number; achieved: number };
    delphicLIS: { current: number; target: number; achieved: number };
    hclabExternal: { current: number; target: number; achieved: number };
    
    // External Sales - IVD
    urinalysis: {
      total: { current: number; target: number; achieved: number };
      breakdown: {
        instrument: { current: number; target: number; achieved: number };
        reagents: { current: number; target: number; achieved: number };
        service: { current: number; target: number; achieved: number };
      };
    };
    ogt: { current: number; target: number; achieved: number }; // Only reagents
    fcm: {
      total: { current: number; target: number; achieved: number };
      breakdown: {
        reagents: { current: number; target: number; achieved: number };
        instrument: { current: number; target: number; achieved: number };
        service: { current: number; target: number; achieved: number };
      };
    };
    
    // Internal Sales
    hclabInternal: { current: number; target: number; achieved: number };
    snzInternal: { current: number; target: number; achieved: number }; // Renamed from snzService
  };
  monthlyData: {
    [key: string]: {
      month: string;
      [productKey: string]: number | string;
    }[];
  };
  monthlyTargets: {
    [category: string]: MonthlyTargetData[];
  };
  companyTripProgress: {
    overall: number;
    target: number;
    achieved: number;
    requiredForTrip: number;
  };
}

export const saveSalesDataToSupabase = async (data: SalesData): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: existing } = await supabase
    .from('user_sales_data')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('user_sales_data')
      .update({
        sales_metrics: data.salesMetrics as any,
        monthly_data: data.monthlyData as any,
        monthly_targets: data.monthlyTargets as any,
        company_trip_progress: data.companyTripProgress as any,
        updated_at: new Date().toISOString()
      } as any)
      .eq('user_id', user.id);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('user_sales_data')
      .insert({
        user_id: user.id,
        sales_metrics: data.salesMetrics as any,
        monthly_data: data.monthlyData as any,
        monthly_targets: data.monthlyTargets as any,
        company_trip_progress: data.companyTripProgress as any
      } as any);

    if (error) throw error;
  }
};

export const loadSalesDataFromSupabase = async (defaultData: SalesData): Promise<SalesData> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return defaultData;

  const { data: savedData, error } = await supabase
    .from('user_sales_data')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !savedData) {
    console.log('No saved sales data found or error loading:', error);
    return defaultData;
  }

  return {
    salesMetrics: savedData.sales_metrics as SalesData['salesMetrics'],
    monthlyData: savedData.monthly_data as SalesData['monthlyData'],
    monthlyTargets: (savedData as any).monthly_targets as SalesData['monthlyTargets'] || {},
    companyTripProgress: savedData.company_trip_progress as SalesData['companyTripProgress']
  };
};

export const clearSalesDataFromSupabase = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('user_sales_data')
    .delete()
    .eq('user_id', user.id);

  if (error) throw error;
};

export const hasSavedSalesDataInSupabase = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('user_sales_data')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  return !!data;
};