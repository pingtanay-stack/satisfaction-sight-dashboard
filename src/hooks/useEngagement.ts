import { useState, useCallback, useEffect } from "react";
import { Achievement } from "@/components/ui/achievement-badge";
import { Insight } from "@/components/ui/insight-card";
import { Alert } from "@/components/ui/alert-notification";
import { normalizeScore, getPerformanceLevel, METRIC_TYPES } from "@/utils/dataHelpers";

interface EngagementState {
  achievements: Achievement[];
  insights: Insight[];
  alerts: Alert[];
  performanceScore: number;
  showAchievementNotification: Achievement | null;
}

interface MetricData {
  currentScore: number;
  target: number;
  maxScore: number;
  trend: number;
  title: string;
  metricType: string;
  isRealData?: boolean;
}

export function useEngagement() {
  const [state, setState] = useState<EngagementState>({
    achievements: [],
    insights: [],
    alerts: [],
    performanceScore: 0,
    showAchievementNotification: null
  });

  // Calculate overall performance score with proper normalization
  const calculatePerformanceScore = useCallback((metrics: MetricData[]) => {
    if (metrics.length === 0) return 0;
    
    const totalScore = metrics.reduce((sum, metric) => {
      const normalizedScore = normalizeScore(metric.currentScore, metric.metricType);
      return sum + normalizedScore;
    }, 0);
    
    return Math.round(totalScore / metrics.length);
  }, []);

  // Generate achievements based on metrics
  const generateAchievements = useCallback((metrics: MetricData[]) => {
    const newAchievements: Achievement[] = [];
    const now = new Date();

    metrics.forEach(metric => {
      const percentage = normalizeScore(metric.currentScore, metric.metricType);
      const isTargetMet = metric.currentScore >= metric.target;
      const performanceLevel = getPerformanceLevel(metric.currentScore, metric.metricType);
      
      // Target achievement
      if (isTargetMet) {
        newAchievements.push({
          id: `target-${metric.title.toLowerCase().replace(/\s+/g, '-')}`,
          type: "target",
          title: "Target Crusher",
          description: `Achieved target for ${metric.title}`,
          earnedAt: now
        });
      }

      // Excellence achievement - use performance level
      if (performanceLevel === 'excellent') {
        newAchievements.push({
          id: `excellence-${metric.title.toLowerCase().replace(/\s+/g, '-')}`,
          type: "excellence", 
          title: "Excellence Award",
          description: `Achieved excellence in ${metric.title}`,
          earnedAt: now
        });
      }

      // Improvement achievement
      if (metric.trend > 10) {
        newAchievements.push({
          id: `improvement-${metric.title.toLowerCase().replace(/\s+/g, '-')}`,
          type: "improvement",
          title: "Rising Star",
          description: `${metric.title} improved by ${metric.trend.toFixed(1)}%`,
          earnedAt: now
        });
      }

      // Streak achievement (simulated)
      if (percentage > 80 && metric.trend > 0) {
        newAchievements.push({
          id: `streak-${metric.title.toLowerCase().replace(/\s+/g, '-')}`,
          type: "streak",
          title: "Consistency Champion",
          description: `Maintaining high performance in ${metric.title}`,
          earnedAt: now
        });
      }
    });

    return newAchievements;
  }, []);

  // Generate insights based on metrics
  const generateInsights = useCallback((metrics: MetricData[]) => {
    const newInsights: Insight[] = [];
    const now = new Date();

    metrics.forEach(metric => {
      const percentage = normalizeScore(metric.currentScore, metric.metricType);
      const performanceLevel = getPerformanceLevel(metric.currentScore, metric.metricType);
      
      // Trend insights
      if (Math.abs(metric.trend) > 5) {
        const isPositive = metric.trend > 0;
        newInsights.push({
          id: `trend-${metric.title.toLowerCase().replace(/\s+/g, '-')}`,
          type: "trend",
          title: `${metric.title} ${isPositive ? 'Rising' : 'Declining'}`,
          description: isPositive 
            ? `${metric.title} has increased by ${metric.trend.toFixed(1)}% this month. This positive trend indicates effective initiatives.`
            : `${metric.title} has decreased by ${Math.abs(metric.trend).toFixed(1)}% this month. Consider reviewing recent changes.`,
          confidence: 85,
          impact: Math.abs(metric.trend) > 15 ? "high" : Math.abs(metric.trend) > 10 ? "medium" : "low",
          metric: metric.title,
          value: metric.currentScore,
          change: metric.trend,
          actionable: true,
          createdAt: now
        });
      }

      // Performance warnings - use metric-specific thresholds
      if (performanceLevel === 'critical' || performanceLevel === 'warning') {
        const severity = performanceLevel === 'critical' ? 'critical' : 'warning';
        const dataStatus = metric.isRealData ? '' : ' (using default data - upload Excel for accurate insights)';
        
        newInsights.push({
          id: `warning-${metric.title.toLowerCase().replace(/\s+/g, '-')}`,
          type: "warning",
          title: `${metric.title} Needs Attention`,
          description: `Current performance is ${severity}. ${performanceLevel === 'critical' ? 'Immediate' : 'Prompt'} action recommended.${dataStatus}`,
          confidence: metric.isRealData ? 90 : 50,
          impact: performanceLevel === 'critical' ? 'high' : 'medium',
          metric: metric.title,
          value: metric.currentScore,
          actionable: true,
          createdAt: now
        });
      }

      // Opportunity insights
      if (percentage >= 70 && percentage < 90 && metric.trend > 0) {
        newInsights.push({
          id: `opportunity-${metric.title.toLowerCase().replace(/\s+/g, '-')}`,
          type: "opportunity",
          title: `${metric.title} Growth Opportunity`,
          description: `With current positive momentum (+${metric.trend.toFixed(1)}%), ${metric.title} could reach excellence levels with focused effort.`,
          confidence: 75,
          impact: "medium",
          metric: metric.title,
          value: metric.currentScore,
          change: metric.trend,
          actionable: true,
          createdAt: now
        });
      }

      // Achievement insights
      if (metric.currentScore >= metric.target && metric.trend > 0) {
        newInsights.push({
          id: `achievement-${metric.title.toLowerCase().replace(/\s+/g, '-')}`,
          type: "achievement",
          title: `${metric.title} Target Achieved!`,
          description: `Congratulations! You've successfully met your target for ${metric.title} with a score of ${metric.currentScore.toFixed(1)}.`,
          confidence: 100,
          impact: "high",
          metric: metric.title,
          value: metric.currentScore,
          actionable: false,
          createdAt: now
        });
      }
    });

    return newInsights;
  }, []);

  // Generate alerts based on metrics
  const generateAlerts = useCallback((metrics: MetricData[]) => {
    const newAlerts: Alert[] = [];
    const now = new Date();

    metrics.forEach(metric => {
      const percentage = normalizeScore(metric.currentScore, metric.metricType);
      const performanceLevel = getPerformanceLevel(metric.currentScore, metric.metricType);
      
      // Critical performance alerts - use metric-specific thresholds
      if (performanceLevel === 'critical') {
        const dataStatus = metric.isRealData ? '' : ' Note: This alert is based on default data.';
        
        newAlerts.push({
          id: `critical-${metric.title.toLowerCase().replace(/\s+/g, '-')}`,
          type: "error",
          title: "Critical Performance Alert",
          message: `${metric.title} has dropped to critical levels. Immediate intervention required.${dataStatus}`,
          severity: "critical",
          metric: metric.title,
          currentValue: metric.currentScore,
          threshold: METRIC_TYPES[metric.metricType]?.thresholds.critical || 0,
          actionable: true,
          autodismiss: false,
          createdAt: now
        });
      }

      // Significant decline alerts
      if (metric.trend < -10) {
        newAlerts.push({
          id: `decline-${metric.title.toLowerCase().replace(/\s+/g, '-')}`,
          type: "warning",
          title: "Significant Decline Detected",
          message: `${metric.title} has declined by ${Math.abs(metric.trend).toFixed(1)}% this month. Review recent changes and take corrective action.`,
          severity: "high",
          metric: metric.title,
          currentValue: metric.currentScore,
          actionable: true,
          autodismiss: false,
          createdAt: now
        });
      }

      // Target achievement alerts
      if (metric.currentScore >= metric.target && metric.trend > 0) {
        newAlerts.push({
          id: `target-met-${metric.title.toLowerCase().replace(/\s+/g, '-')}`,
          type: "success",
          title: "Target Achieved!",
          message: `Excellent work! ${metric.title} has reached its target of ${metric.target.toFixed(1)}.`,
          severity: "low",
          metric: metric.title,
          currentValue: metric.currentScore,
          threshold: metric.target,
          actionable: false,
          autodismiss: true,
          dismissAfter: 8000,
          createdAt: now
        });
      }
    });

    return newAlerts;
  }, []);

  // Update engagement data based on metrics
  const updateEngagement = useCallback((metrics: MetricData[]) => {
    const newAchievements = generateAchievements(metrics);
    const newInsights = generateInsights(metrics);
    const newAlerts = generateAlerts(metrics);
    const newPerformanceScore = calculatePerformanceScore(metrics);

    setState(prev => {
      // Find newly earned achievements
      const prevAchievementIds = prev.achievements.map(a => a.id);
      const newlyEarned = newAchievements.find(a => 
        !prevAchievementIds.includes(a.id) && a.earnedAt
      );

      return {
        achievements: newAchievements,
        insights: newInsights.slice(0, 10), // Keep only recent insights
        alerts: newAlerts,
        performanceScore: newPerformanceScore,
        showAchievementNotification: newlyEarned || null
      };
    });
  }, [generateAchievements, generateInsights, generateAlerts, calculatePerformanceScore]);

  // Dismiss achievement notification
  const dismissAchievementNotification = useCallback(() => {
    setState(prev => ({ ...prev, showAchievementNotification: null }));
  }, []);

  // Dismiss alert
  const dismissAlert = useCallback((alertId: string) => {
    setState(prev => ({
      ...prev,
      alerts: prev.alerts.filter(alert => alert.id !== alertId)
    }));
  }, []);

  // Dismiss insight
  const dismissInsight = useCallback((insightId: string) => {
    setState(prev => ({
      ...prev,
      insights: prev.insights.filter(insight => insight.id !== insightId)
    }));
  }, []);

  // Action handlers
  const handleAlertAction = useCallback((alert: Alert) => {
    // This could open modals, redirect to specific pages, etc.
    console.log('Alert action:', alert);
  }, []);

  const handleInsightAction = useCallback((insight: Insight) => {
    // This could open modals, redirect to specific pages, etc.
    console.log('Insight action:', insight);
  }, []);

  return {
    ...state,
    updateEngagement,
    dismissAchievementNotification,
    dismissAlert,
    dismissInsight,
    handleAlertAction,
    handleInsightAction
  };
}