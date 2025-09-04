// Utility functions for data processing and analysis

export interface TimeSeriesData {
  month: string;
  score: number;
}

export interface MetricType {
  type: 'nps' | 'satisfaction' | 'jira' | 'adhoc';
  scale: { min: number; max: number };
  thresholds: {
    critical: number;
    warning: number;
    good: number;
    excellent: number;
  };
}

// Define metric types and their characteristics
export const METRIC_TYPES: Record<string, MetricType> = {
  nps: {
    type: 'nps',
    scale: { min: -100, max: 100 },
    thresholds: {
      critical: -50,
      warning: 0,
      good: 30,
      excellent: 50
    }
  },
  satisfaction: {
    type: 'satisfaction',
    scale: { min: 0, max: 5 },
    thresholds: {
      critical: 2.0,
      warning: 3.0,
      good: 4.0,
      excellent: 4.5
    }
  },
  jira: {
    type: 'satisfaction',
    scale: { min: 0, max: 5 },
    thresholds: {
      critical: 2.0,
      warning: 3.0,
      good: 4.0,
      excellent: 4.5
    }
  },
  adhoc: {
    type: 'satisfaction',
    scale: { min: 0, max: 5 },
    thresholds: {
      critical: 2.0,
      warning: 3.0,
      good: 4.0,
      excellent: 4.5
    }
  }
};

/**
 * Calculate trend percentage between the last two months of data
 */
export function calculateTrend(data: TimeSeriesData[]): number {
  if (data.length < 2) return 0;
  
  const current = data[data.length - 1].score;
  const previous = data[data.length - 2].score;
  
  if (previous === 0) return 0;
  
  return ((current - previous) / Math.abs(previous)) * 100;
}

/**
 * Normalize score to 0-100 percentage based on metric type
 */
export function normalizeScore(score: number, metricType: string): number {
  const type = METRIC_TYPES[metricType];
  if (!type) return (score / 100) * 100; // fallback
  
  const { min, max } = type.scale;
  return ((score - min) / (max - min)) * 100;
}

/**
 * Get performance level based on score and metric type
 */
export function getPerformanceLevel(score: number, metricType: string): 'critical' | 'warning' | 'good' | 'excellent' {
  const type = METRIC_TYPES[metricType];
  if (!type) return 'good'; // fallback
  
  const { thresholds } = type;
  
  if (score < thresholds.critical) return 'critical';
  if (score < thresholds.warning) return 'warning';
  if (score < thresholds.good) return 'good';
  return 'excellent';
}

/**
 * Check if current data is from uploads vs defaults
 */
export function getDataSource(hasUploadedData: boolean, currentValue: number, defaultValue: number): {
  source: 'excel' | 'default';
  isReal: boolean;
} {
  const isReal = hasUploadedData && currentValue !== defaultValue;
  return {
    source: isReal ? 'excel' : 'default',
    isReal
  };
}

/**
 * Calculate data freshness score (0-100)
 */
export function getDataFreshness(lastUploadDate?: Date): number {
  if (!lastUploadDate) return 0;
  
  const now = new Date();
  const daysSinceUpload = Math.floor((now.getTime() - lastUploadDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Fresh for 7 days, then decays
  if (daysSinceUpload <= 7) return 100;
  if (daysSinceUpload <= 30) return Math.max(0, 100 - (daysSinceUpload - 7) * 3);
  return 0;
}