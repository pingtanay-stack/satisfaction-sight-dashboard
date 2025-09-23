import { TrendingUp, TrendingDown, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EnhancedTooltip } from "@/components/ui/enhanced-tooltip";

interface RadialMetricCardProps {
  title: string;
  currentScore: number;
  target: number;
  maxScore: number;
  trend: number;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  benchmark?: number;
  insights?: {
    current: string;
    recommendation?: string;
  };
  // Sales-specific fields
  actualValue?: number;
  targetValue?: number;
  showActualValues?: boolean;
}

export function RadialMetricCard({
  title,
  currentScore,
  target,
  maxScore,
  trend,
  icon,
  className,
  onClick,
  benchmark,
  insights,
  actualValue,
  targetValue,
  showActualValues = false
}: RadialMetricCardProps) {
  // Dynamic scaling for sales - allow over-performance
  const dynamicMaxScore = Math.max(maxScore, target * 1.5, currentScore * 1.1);
  const percentage = (currentScore / dynamicMaxScore) * 100;
  const targetPercentage = (target / dynamicMaxScore) * 100;
  const overPerformanceRatio = currentScore / target;
  const isTargetMet = currentScore >= target;
  const isPositiveTrend = trend >= 0;
  const isOverPerforming = currentScore > target;
  
  // Calculate circle properties
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const progressOffset = circumference - (percentage / 100) * circumference;
  const targetOffset = circumference - (targetPercentage / 100) * circumference;
  
  // Sales-specific performance levels
  const getSalesStatus = () => {
    if (overPerformanceRatio >= 1.5) return { label: "Record Breaking", color: "success", glow: true };
    if (overPerformanceRatio >= 1.25) return { label: "Bonus Territory", color: "success", glow: true };
    if (overPerformanceRatio >= 1.1) return { label: "Exceeded Target", color: "success", glow: false };
    if (isTargetMet) return { label: "Target Met", color: "success", glow: false };
    if (percentage >= 80) return { label: "Approaching Target", color: "warning", glow: false };
    return { label: "Below Target", color: "destructive", glow: false };
  };
  
  const salesStatus = getSalesStatus();

  return (
    <EnhancedTooltip
      title={title}
      currentValue={currentScore}
      target={target}
      trend={trend}
      benchmark={benchmark}
      insight={insights?.current}
      recommendation={insights?.recommendation}
    >
      <Card 
        className={cn(
          "hover-lift card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in cursor-pointer group",
          "hover:scale-[1.02] hover:-translate-y-1",
          className
        )}
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon && <div className="text-primary">{icon}</div>}
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
            </div>
            <Badge
              variant={salesStatus.color === "success" ? "default" : "secondary"}
              className={cn(
                "text-xs animate-fade-in",
                salesStatus.color === "success" && "bg-success text-success-foreground",
                salesStatus.color === "warning" && "bg-warning text-warning-foreground",
                salesStatus.color === "destructive" && "bg-destructive text-destructive-foreground",
                salesStatus.glow && "animate-pulse shadow-lg shadow-success/50"
              )}
            >
              {salesStatus.label}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-2">
          <div className="space-y-4">
            {/* Radial Progress */}
            <div className="flex items-center justify-center relative">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="hsl(var(--muted))"
                    strokeWidth="4"
                    fill="transparent"
                    className="opacity-20"
                  />
                  
                  {/* Target indicator circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="hsl(var(--foreground))"
                    strokeWidth="2"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={targetOffset}
                    className="opacity-40"
                    strokeLinecap="round"
                  />
                  
                  {/* Progress circle - can exceed 100% */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={
                      overPerformanceRatio >= 1.5
                        ? "hsl(var(--success))"
                        : overPerformanceRatio >= 1.25
                          ? "hsl(var(--primary))"
                          : overPerformanceRatio >= 1.1
                            ? "hsl(var(--secondary))"
                            : percentage < 50 
                              ? "hsl(var(--destructive))"
                              : percentage < 80 
                                ? "hsl(var(--warning))"
                                : "hsl(var(--primary))"
                    }
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                    className={cn(
                      "transition-all duration-1000",
                      salesStatus.glow && "animate-pulse",
                      !salesStatus.glow && "group-hover:animate-pulse"
                    )}
                    style={{
                      filter: `drop-shadow(0 0 8px ${
                        salesStatus.glow
                          ? 'hsl(var(--success) / 0.6)'
                          : percentage >= 80 
                            ? 'hsl(var(--primary) / 0.4)'
                            : 'transparent'
                      })`
                    }}
                  />
                </svg>
                
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {showActualValues && actualValue ? (
                    <>
                      <span className={cn(
                        "text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent",
                        salesStatus.glow 
                          ? "from-success to-success-foreground animate-bounce-in" 
                          : "from-primary to-secondary"
                      )}>
                        ${(actualValue / 1000000).toFixed(1)}M
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {currentScore.toFixed(1)}% achieved
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={cn(
                        "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                        salesStatus.glow 
                          ? "from-success to-success-foreground animate-bounce-in" 
                          : "from-primary to-secondary"
                      )}>
                        {currentScore.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isOverPerforming ? `${(overPerformanceRatio * 100).toFixed(0)}% of target` : `/ ${target} target`}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Performance indicator */}
            <div className="text-center">
              {showActualValues && targetValue ? (
                <p className="text-xs text-muted-foreground mb-2">
                  Target: ${(targetValue / 1000000).toFixed(1)}M
                  {isOverPerforming 
                    ? ` (${((overPerformanceRatio - 1) * 100).toFixed(1)}% above)`
                    : ` (${((actualValue || 0) / targetValue * 100).toFixed(1)}%)`
                  }
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mb-2">
                  {isOverPerforming 
                    ? `${((overPerformanceRatio - 1) * 100).toFixed(1)}% above target (${target.toFixed(1)})`
                    : `Target: ${target.toFixed(1)} (${((currentScore / target) * 100).toFixed(1)}%)`
                  }
                </p>
              )}
            </div>
            
            {/* Trend */}
            <div className="flex items-center justify-center gap-1 group-hover:animate-celebrate">
              {isPositiveTrend ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={cn(
                "text-sm font-medium",
                isPositiveTrend ? "text-success" : "text-destructive"
              )}>
                {isPositiveTrend ? "+" : ""}{trend.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
            
            {/* Sales achievement indicators */}
            {overPerformanceRatio >= 1.5 && (
              <div className="flex items-center justify-center gap-1 text-success animate-bounce-in">
                <Target className="h-3 w-3 animate-spin" />
                <span className="text-xs font-bold">RECORD BREAKING!</span>
              </div>
            )}
            {overPerformanceRatio >= 1.25 && overPerformanceRatio < 1.5 && (
              <div className="flex items-center justify-center gap-1 text-success animate-bounce-in">
                <Target className="h-3 w-3" />
                <span className="text-xs font-medium">Bonus Territory!</span>
              </div>
            )}
            {isTargetMet && overPerformanceRatio < 1.25 && (
              <div className="flex items-center justify-center gap-1 text-success animate-bounce-in">
                <Target className="h-3 w-3" />
                <span className="text-xs font-medium">Target Achieved!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </EnhancedTooltip>
  );
}