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
  // Dynamic scaling for sales - allow over-performance
  const dynamicMaxScore = Math.max(maxScore, target * 1.5, currentScore * 1.1);
  const percentage = Math.min((currentScore / dynamicMaxScore) * 100, 100);
  const overPerformanceRatio = currentScore / target;
  const isTargetMet = currentScore >= target;
  const isPositiveTrend = trend >= 0;
  const isOverPerforming = currentScore > target;
  
  // Calculate achievement level based on target performance
  const getPerformanceLevel = () => {
    if (overPerformanceRatio >= 1.5) return 5; // Max stars for exceptional performance
    if (overPerformanceRatio >= 1.25) return 5;
    if (overPerformanceRatio >= 1.1) return 4;
    if (overPerformanceRatio >= 1.0) return 4;
    if (overPerformanceRatio >= 0.9) return 3;
    if (overPerformanceRatio >= 0.8) return 2;
    return 1;
  };
  
  const stars = getPerformanceLevel();
  
  // Sales-specific achievement titles
  const getSalesTitle = () => {
    if (overPerformanceRatio >= 1.5) return "Sales Champion";
    if (overPerformanceRatio >= 1.25) return "Top Performer";
    if (overPerformanceRatio >= 1.1) return "Revenue Leader";
    if (isTargetMet) return "Target Achiever";
    if (overPerformanceRatio >= 0.9) return "Close to Target";
    if (overPerformanceRatio >= 0.8) return "Needs Push";
    return "Requires Focus";
  };
  
  const getSalesColor = () => {
    if (overPerformanceRatio >= 1.25) return "text-yellow-500";
    if (overPerformanceRatio >= 1.1) return "text-blue-500";
    if (isTargetMet) return "text-green-500";
    if (overPerformanceRatio >= 0.8) return "text-orange-500";
    return "text-gray-400";
  };
  
  const getSalesStatus = () => {
    if (overPerformanceRatio >= 1.5) return { label: "Record Breaking", color: "success", glow: true };
    if (overPerformanceRatio >= 1.25) return { label: "Bonus Territory", color: "success", glow: true };
    if (overPerformanceRatio >= 1.1) return { label: "Exceeded Target", color: "success", glow: false };
    if (isTargetMet) return { label: "Target Met", color: "success", glow: false };
    if (overPerformanceRatio >= 0.8) return { label: "Approaching Target", color: "warning", glow: false };
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
          "hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden",
          className
        )}
        onClick={onClick}
      >
        {/* Sales achievement glow effect */}
        {salesStatus.glow && (
          <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-transparent to-primary/10 animate-pulse" />
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
        
        <CardContent className="pt-2 relative z-10">
          <div className="space-y-4">
            {/* Sales Performance Level */}
            <div className="text-center space-y-2">
              <div className={cn("text-lg font-bold", getSalesColor())}>
                {getSalesTitle()}
              </div>
              
              {/* Star Rating based on performance */}
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      star <= stars
                        ? salesStatus.glow 
                          ? "text-yellow-400 fill-yellow-400 animate-pulse" 
                          : "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
            </div>
            
            {/* Score Display */}
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className={cn(
                  "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent group-hover:animate-number-roll",
                  salesStatus.glow 
                    ? "from-success to-success-foreground animate-bounce-in" 
                    : "from-primary to-secondary"
                )}>
                  {currentScore.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {isOverPerforming ? `(${(overPerformanceRatio * 100).toFixed(0)}%)` : `/ ${target}`}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isOverPerforming 
                  ? `${((overPerformanceRatio - 1) * 100).toFixed(1)}% above target (${target.toFixed(1)})`
                  : `Target: ${target.toFixed(1)}`
                }
              </p>
            </div>
            
            {/* Sales Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Sales Progress</span>
                <span>{isOverPerforming ? `${(overPerformanceRatio * 100).toFixed(0)}%` : `${((currentScore / target) * 100).toFixed(1)}%`}</span>
              </div>
              
              <div className="h-3 bg-muted rounded-full overflow-hidden border border-border relative">
                {/* Target marker */}
                <div 
                  className="absolute top-0 w-0.5 h-full bg-foreground/40 z-10"
                  style={{ left: `${Math.min((target / dynamicMaxScore) * 100, 100)}%` }}
                />
                <div 
                  className={cn(
                    "h-full transition-all duration-700 relative",
                    salesStatus.glow && "animate-progress-fill",
                    overPerformanceRatio >= 1.25 && "bg-gradient-to-r from-success to-success-foreground",
                    overPerformanceRatio >= 1.1 && overPerformanceRatio < 1.25 && "bg-gradient-to-r from-primary to-secondary",
                    isTargetMet && overPerformanceRatio < 1.1 && "bg-gradient-to-r from-blue-500 to-green-500",
                    !isTargetMet && overPerformanceRatio >= 0.8 && "bg-gradient-to-r from-orange-500 to-yellow-400",
                    overPerformanceRatio < 0.8 && "bg-gradient-to-r from-red-500 to-red-400"
                  )}
                  style={{ 
                    width: `${Math.min((currentScore / dynamicMaxScore) * 100, 100)}%`,
                    boxShadow: salesStatus.glow ? "0 0 15px rgba(34, 197, 94, 0.6)" : "none"
                  }}
                >
                  {/* Sparkle effects for exceptional performance */}
                  {salesStatus.glow && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
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
            
            {/* Sales achievement badges */}
            {overPerformanceRatio >= 1.5 && (
              <div className="flex items-center justify-center gap-1 text-success animate-bounce-in">
                <Zap className="h-4 w-4 fill-current animate-pulse" />
                <span className="text-xs font-bold">SALES CHAMPION!</span>
              </div>
            )}
            
            {overPerformanceRatio >= 1.25 && overPerformanceRatio < 1.5 && (
              <div className="flex items-center justify-center gap-1 text-primary animate-bounce-in">
                <Award className="h-4 w-4" />
                <span className="text-xs font-medium">Top Performer!</span>
              </div>
            )}
            
            {isTargetMet && overPerformanceRatio < 1.25 && (
              <div className="flex items-center justify-center gap-1 text-success animate-bounce-in">
                <Award className="h-4 w-4" />
                <span className="text-xs font-medium">Target Achieved!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </EnhancedTooltip>
  );
}