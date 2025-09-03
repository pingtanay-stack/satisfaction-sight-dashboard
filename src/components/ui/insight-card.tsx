import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Info,
  Zap,
  Target
} from "lucide-react";

export interface Insight {
  id: string;
  type: "trend" | "anomaly" | "achievement" | "recommendation" | "warning" | "opportunity";
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: "low" | "medium" | "high";
  metric?: string;
  value?: number;
  change?: number;
  actionable?: boolean;
  createdAt: Date;
}

interface InsightCardProps {
  insight: Insight;
  onDismiss?: (id: string) => void;
  onAction?: (insight: Insight) => void;
  className?: string;
  style?: React.CSSProperties;
}

const insightConfig = {
  trend: {
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/5",
    borderColor: "border-primary/20",
    emoji: "📈"
  },
  anomaly: {
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/5",
    borderColor: "border-warning/20",
    emoji: "⚠️"
  },
  achievement: {
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/5",
    borderColor: "border-success/20",
    emoji: "🎉"
  },
  recommendation: {
    icon: Lightbulb,
    color: "text-secondary",
    bgColor: "bg-secondary/5",
    borderColor: "border-secondary/20",
    emoji: "💡"
  },
  warning: {
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/5",
    borderColor: "border-destructive/20",
    emoji: "🚨"
  },
  opportunity: {
    icon: Zap,
    color: "text-accent-foreground",
    bgColor: "bg-accent/50",
    borderColor: "border-accent",
    emoji: "⚡"
  }
};

const impactConfig = {
  low: {
    label: "Low Impact",
    color: "bg-muted text-muted-foreground"
  },
  medium: {
    label: "Medium Impact", 
    color: "bg-warning/10 text-warning border-warning/20"
  },
  high: {
    label: "High Impact",
    color: "bg-destructive/10 text-destructive border-destructive/20"
  }
};

function getConfidenceColor(confidence: number) {
  if (confidence >= 80) return "text-success";
  if (confidence >= 60) return "text-warning";
  return "text-muted-foreground";
}

export function InsightCard({
  insight,
  onDismiss,
  onAction,
  className,
  style
}: InsightCardProps) {
  const config = insightConfig[insight.type];
  const impactStyle = impactConfig[insight.impact];
  const Icon = config.icon;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Card 
      className={cn(
        "border transition-all duration-300 hover:shadow-md animate-fade-in",
        config.bgColor,
        config.borderColor,
        className
      )}
      style={style}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-full",
                config.bgColor,
                config.borderColor,
                "border"
              )}>
                <Icon className={cn("h-4 w-4", config.color)} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-sm leading-tight">
                  {insight.title}
                </h4>
                {insight.metric && (
                  <p className="text-xs text-muted-foreground">
                    Related to: {insight.metric}
                  </p>
                )}
              </div>
            </div>
            
            {onDismiss && (
              <button 
                onClick={() => onDismiss(insight.id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ×
              </button>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <p className="text-sm text-foreground leading-relaxed">
              {insight.description}
            </p>

            {/* Metrics */}
            {(insight.value !== undefined || insight.change !== undefined) && (
              <div className="flex items-center gap-4 text-xs">
                {insight.value !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Value: </span>
                    <span className="font-medium text-foreground">
                      {insight.value.toFixed(1)}
                    </span>
                  </div>
                )}
                {insight.change !== undefined && (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Change: </span>
                    <span className={cn(
                      "font-medium flex items-center gap-0.5",
                      insight.change >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {insight.change >= 0 ? "+" : ""}{insight.change.toFixed(1)}%
                      {insight.change >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline"
                className={cn("text-xs border", impactStyle.color)}
              >
                {impactStyle.label}
              </Badge>
              
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">Confidence:</span>
                <span className={cn(
                  "text-xs font-medium",
                  getConfidenceColor(insight.confidence)
                )}>
                  {insight.confidence}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(insight.createdAt)}
              </span>
              
              {insight.actionable && onAction && (
                <button
                  onClick={() => onAction(insight)}
                  className={cn(
                    "text-xs px-2 py-1 rounded-md transition-colors font-medium",
                    "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  Take Action
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface InsightsSectionProps {
  insights: Insight[];
  onDismissInsight?: (id: string) => void;
  onActionInsight?: (insight: Insight) => void;
  maxVisible?: number;
  className?: string;
}

export function InsightsSection({
  insights,
  onDismissInsight,
  onActionInsight,
  maxVisible = 3,
  className
}: InsightsSectionProps) {
  const [showAll, setShowAll] = React.useState(false);
  const visibleInsights = showAll ? insights : insights.slice(0, maxVisible);
  const hasMore = insights.length > maxVisible;

  if (insights.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No insights available yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Insights will appear as your data is analyzed
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Smart Insights</h3>
        <Badge variant="secondary" className="text-xs">
          {insights.length} insight{insights.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {visibleInsights.map((insight, index) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            onDismiss={onDismissInsight}
            onAction={onActionInsight}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {showAll ? "Show Less" : `Show ${insights.length - maxVisible} More`}
          </button>
        </div>
      )}
    </div>
  );
}