// YTD (Year-to-Date) calculation utilities for sales dashboard

export interface YTDAnalysis {
  ytdActual: number;
  ytdExpected: number;
  ytdAchievement: number; // percentage of expected YTD achieved
  projectedYearEnd: number;
  requiredMonthlyAverage: number;
  isOnTrack: boolean;
  monthsCompleted: number;
  monthsRemaining: number;
}

/**
 * Calculate Year-to-Date analysis based on monthly data
 * @param monthlyData Array of monthly actual values
 * @param annualTarget Full year target
 * @param currentMonth Current month (1-12, defaults to monthlyData.length)
 */
export function calculateYTDAnalysis(
  monthlyData: number[], 
  annualTarget: number, 
  currentMonth?: number
): YTDAnalysis {
  const months = currentMonth || monthlyData.length;
  const monthsCompleted = Math.min(months, monthlyData.length);
  const monthsRemaining = 12 - monthsCompleted;
  
  // Calculate YTD values
  const ytdActual = monthlyData.slice(0, monthsCompleted).reduce((sum, val) => sum + val, 0);
  const ytdExpected = (annualTarget / 12) * monthsCompleted;
  const ytdAchievement = ytdExpected > 0 ? (ytdActual / ytdExpected) * 100 : 0;
  
  // Project year-end performance based on current trend
  const avgMonthlyActual = monthsCompleted > 0 ? ytdActual / monthsCompleted : 0;
  const projectedYearEnd = ytdActual + (avgMonthlyActual * monthsRemaining);
  
  // Calculate required monthly average for remaining months to meet target
  const remainingRequired = Math.max(0, annualTarget - ytdActual);
  const requiredMonthlyAverage = monthsRemaining > 0 ? remainingRequired / monthsRemaining : 0;
  
  // Determine if on track (within 5% of expected YTD)
  const isOnTrack = ytdAchievement >= 95;
  
  return {
    ytdActual,
    ytdExpected,
    ytdAchievement,
    projectedYearEnd,
    requiredMonthlyAverage,
    isOnTrack,
    monthsCompleted,
    monthsRemaining
  };
}

/**
 * Calculate trend percentage from monthly data
 */
export function calculateTrend(monthlyData: number[]): number {
  if (monthlyData.length < 2) return 0;
  
  const current = monthlyData[monthlyData.length - 1];
  const previous = monthlyData[monthlyData.length - 2];
  
  if (previous === 0) return 0;
  
  return ((current - previous) / previous) * 100;
}

/**
 * Format currency values for display
 */
export function formatCurrency(value: number, scale: 'M' | 'K' | '' = 'M'): string {
  switch (scale) {
    case 'M':
      return `$${(value / 1000000).toFixed(2)}M`;
    case 'K':
      return `$${(value / 1000).toFixed(0)}K`;
    default:
      return `$${value.toLocaleString()}`;
  }
}

/**
 * Get performance status based on achievement percentage
 */
export function getPerformanceStatus(achievement: number): {
  status: 'excellent' | 'good' | 'warning' | 'critical';
  label: string;
  color: string;
} {
  if (achievement >= 100) {
    return { status: 'excellent', label: 'Target Achieved', color: 'text-success' };
  } else if (achievement >= 95) {
    return { status: 'good', label: 'On Track', color: 'text-success' };
  } else if (achievement >= 80) {
    return { status: 'warning', label: 'Behind Schedule', color: 'text-warning' };
  } else {
    return { status: 'critical', label: 'Critical', color: 'text-destructive' };
  }
}