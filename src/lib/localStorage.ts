// localStorage utility functions for dashboard data persistence

const STORAGE_KEYS = {
  METRICS: 'dashboard_metrics',
  NPS_DATA: 'dashboard_nps_data',
  JIRA_DATA: 'dashboard_jira_data',
  SATISFACTION_DATA: 'dashboard_satisfaction_data',
  ADHOC_DATA: 'dashboard_adhoc_data',
} as const;

export interface DashboardData {
  metrics: any;
  npsData: Array<{ month: string; score: number }>;
  jiraData: Array<{ month: string; score: number }>;
  satisfactionData: Array<{ month: string; score: number }>;
  adhocData: Array<{ month: string; score: number }>;
}

// Save individual data to localStorage
export const saveDashboardData = (data: Partial<DashboardData>): void => {
  try {
    if (data.metrics) localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(data.metrics));
    if (data.npsData) localStorage.setItem(STORAGE_KEYS.NPS_DATA, JSON.stringify(data.npsData));
    if (data.jiraData) localStorage.setItem(STORAGE_KEYS.JIRA_DATA, JSON.stringify(data.jiraData));
    if (data.satisfactionData) localStorage.setItem(STORAGE_KEYS.SATISFACTION_DATA, JSON.stringify(data.satisfactionData));
    if (data.adhocData) localStorage.setItem(STORAGE_KEYS.ADHOC_DATA, JSON.stringify(data.adhocData));
  } catch (error) {
    console.warn('Failed to save dashboard data to localStorage:', error);
  }
};

// Load individual data from localStorage
export const loadDashboardData = (defaults: DashboardData): DashboardData => {
  try {
    const savedMetrics = localStorage.getItem(STORAGE_KEYS.METRICS);
    const savedNpsData = localStorage.getItem(STORAGE_KEYS.NPS_DATA);
    const savedJiraData = localStorage.getItem(STORAGE_KEYS.JIRA_DATA);
    const savedSatisfactionData = localStorage.getItem(STORAGE_KEYS.SATISFACTION_DATA);
    const savedAdhocData = localStorage.getItem(STORAGE_KEYS.ADHOC_DATA);

    return {
      metrics: savedMetrics ? JSON.parse(savedMetrics) : defaults.metrics,
      npsData: savedNpsData ? JSON.parse(savedNpsData) : defaults.npsData,
      jiraData: savedJiraData ? JSON.parse(savedJiraData) : defaults.jiraData,
      satisfactionData: savedSatisfactionData ? JSON.parse(savedSatisfactionData) : defaults.satisfactionData,
      adhocData: savedAdhocData ? JSON.parse(savedAdhocData) : defaults.adhocData,
    };
  } catch (error) {
    console.warn('Failed to load dashboard data from localStorage:', error);
    return defaults;
  }
};

// Clear all saved dashboard data
export const clearDashboardData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Failed to clear dashboard data from localStorage:', error);
  }
};

// Check if there's any saved data
export const hasSavedData = (): boolean => {
  try {
    return Object.values(STORAGE_KEYS).some(key => localStorage.getItem(key) !== null);
  } catch (error) {
    return false;
  }
};