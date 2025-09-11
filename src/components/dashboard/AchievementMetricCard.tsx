import { TrendingUp, TrendingDown, Target, Star, Award, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EnhancedTooltip } from "@/components/ui/enhanced-tooltip";

interface AchievementMetricCardProps {
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

export function AchievementMetricCard({
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
}: AchievementMetricCardProps) {
  const percentage = (currentScore / maxScore) * 100;
  const isTargetMet = currentScore >= target;
  const isPositiveTrend = trend >= 0;
  
  // Calculate achievement level (1-5 stars)
  const achievementLevel = Math.floor((percentage / 100) * 5) + 1;
  const stars = Math.min(Math.max(achievementLevel, 1), 5);
  
  // Get achievement title based on performance
  const getAchievementTitle = () => {
    if (percentage >= 95) return "Legendary";
    if (percentage >= 90) return "Epic";
    if (percentage >= 80) return "Excellent";
    if (percentage >= 70) return "Good";
    if (percentage >= 60) return "Fair";
    return "Needs Focus";
  };
  
  const getAchievementColor = () => {
    if (percentage >= 90) return "text-yellow-500";
    if (percentage >= 80) return "text-blue-500";
    if (percentage >= 70) return "text-green-500";
    if (percentage >= 60) return "text-orange-500";
    return "text-gray-400";
  };
  
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
          "hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden",
          className
        )}
        onClick={onClick}
      >
        {/* Achievement glow effect */}
        {percentage >= 90 && (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-orange-400/10 animate-pulse" />
        )}
        
        <CardHeader className="pb-2 relative z-10">
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
        
        <CardContent className="pt-2 relative z-10">
          <div className="space-y-4">
            {/* Achievement Level */}
            <div className="text-center space-y-2">
              <div className={cn("text-lg font-bold", getAchievementColor())}>
                {getAchievementTitle()}
              </div>
              
              {/* Star Rating */}
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      star <= Math.floor((percentage / 100) * 5) + 1
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
            </div>
            
            {/* Score Display */}
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:animate-number-roll">
                  {currentScore.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {maxScore}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Target: {target.toFixed(1)}
              </p>
            </div>
            
            {/* Progress Bar with XP style */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{percentage.toFixed(1)}% XP</span>
              </div>
              
              <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
                <div 
                  className={cn(
                    "h-full transition-all duration-700 group-hover:animate-progress-fill relative",
                    percentage < 50 && "bg-gradient-to-r from-red-500 to-red-400",
                    percentage >= 50 && percentage < 80 && "bg-gradient-to-r from-orange-500 to-yellow-400",
                    percentage >= 80 && percentage < 90 && "bg-gradient-to-r from-blue-500 to-green-400",
                    percentage >= 90 && "bg-gradient-to-r from-yellow-400 to-orange-500"
                  )}
                  style={{ 
                    width: `${Math.min(percentage, 100)}%`,
                    boxShadow: percentage >= 90 ? "0 0 10px rgba(251, 191, 36, 0.5)" : "none"
                  }}
                >
                  {/* Sparkle effects for high performance */}
                  {percentage >= 90 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Trend with achievement context */}
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
              <span className="text-xs text-muted-foreground">momentum</span>
            </div>
            
            {/* Achievement badges */}
            {isTargetMet && (
              <div className="flex items-center justify-center gap-1 text-success animate-bounce-in">
                <Award className="h-4 w-4" />
                <span className="text-xs font-medium">Achievement Unlocked!</span>
              </div>
            )}
            
            {percentage >= 95 && (
              <div className="flex items-center justify-center gap-1 text-yellow-500 animate-bounce-in">
                <Zap className="h-4 w-4 fill-current" />
                <span className="text-xs font-bold">LEGENDARY PERFORMANCE!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </EnhancedTooltip>
  );
}