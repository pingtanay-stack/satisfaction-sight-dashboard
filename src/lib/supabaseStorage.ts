import { supabase } from '@/integrations/supabase/client';

export interface DashboardData {
  metrics: {
    nps: { current: number; target: number; respondents: number };
    jira: { current: number; target: number; respondents: number };
    project: { current: number; target: number; respondents: number };
    adhoc: { current: number; target: number; respondents: number };
  };
  npsData: { month: string; score: number }[];
  satisfactionData: { month: string; score: number }[];
  jiraData: { month: string; score: number }[];
  adhocData: { month: string; score: number }[];
}

export const saveDashboardDataToSupabase = async (data: DashboardData): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Check if user already has data
  const { data: existing } = await supabase
    .from('user_dashboard_data')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    // Update existing record
    const { error } = await supabase
      .from('user_dashboard_data')
      .update({
        metrics: data.metrics,
        nps_data: data.npsData,
        satisfaction_data: data.satisfactionData,
        jira_data: data.jiraData,
        adhoc_data: data.adhocData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) throw error;
  } else {
    // Insert new record
    const { error } = await supabase
      .from('user_dashboard_data')
      .insert({
        user_id: user.id,
        metrics: data.metrics,
        nps_data: data.npsData,
        satisfaction_data: data.satisfactionData,
        jira_data: data.jiraData,
        adhoc_data: data.adhocData
      });

    if (error) throw error;
  }
};

export const loadDashboardDataFromSupabase = async (defaultData: DashboardData): Promise<DashboardData> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return defaultData;

  const { data: savedData, error } = await supabase
    .from('user_dashboard_data')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !savedData) {
    console.log('No saved data found or error loading:', error);
    return defaultData;
  }

  return {
    metrics: savedData.metrics as DashboardData['metrics'],
    npsData: savedData.nps_data as DashboardData['npsData'],
    satisfactionData: savedData.satisfaction_data as DashboardData['satisfactionData'],
    jiraData: savedData.jira_data as DashboardData['jiraData'],
    adhocData: savedData.adhoc_data as DashboardData['adhocData']
  };
};

export const clearDashboardDataFromSupabase = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('user_dashboard_data')
    .delete()
    .eq('user_id', user.id);

  if (error) throw error;
};

export const hasSavedDataInSupabase = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('user_dashboard_data')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  return !!data;
};