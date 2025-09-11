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
  insights
}: RadialMetricCardProps) {
  const percentage = (currentScore / maxScore) * 100;
  const targetPercentage = (target / maxScore) * 100;
  const isTargetMet = currentScore >= target;
  const isPositiveTrend = trend >= 0;
  
  // Calculate circle properties
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const progressOffset = circumference - (percentage / 100) * circumference;
  const targetOffset = circumference - (targetPercentage / 100) * circumference;
  
  const statusColor = isTargetMet 
    ? "success" 
    : percentage >= 80 
      ? "warning" 
      : "destructive";

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
              variant={statusColor === "success" ? "default" : "secondary"}
              className={cn(
                "text-xs",
                statusColor === "success" && "bg-success text-success-foreground",
                statusColor === "warning" && "bg-warning text-warning-foreground",
                statusColor === "destructive" && "bg-destructive text-destructive-foreground"
              )}
            >
              {isTargetMet ? "Target Met" : "Below Target"}
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
                  
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={
                      percentage < 50 
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
                    className="transition-all duration-1000 group-hover:animate-pulse"
                    style={{
                      filter: `drop-shadow(0 0 8px ${
                        percentage >= 80 
                          ? 'hsl(var(--primary) / 0.4)'
                          : 'transparent'
                      })`
                    }}
                  />
                </svg>
                
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {currentScore.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">/ {maxScore}</span>
                </div>
              </div>
            </div>
            
            {/* Target line indicator */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">
                Target: {target.toFixed(1)} ({targetPercentage.toFixed(1)}%)
              </p>
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
            
            {/* Achievement indicator */}
            {isTargetMet && (
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