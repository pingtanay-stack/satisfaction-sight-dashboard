import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompactMetricCardProps {
  title: string;
  currentScore: number;
  target: number;
  maxScore: number;
  trend: number;
  icon?: React.ReactNode;
  className?: string;
}

export function CompactMetricCard({
  title,
  currentScore,
  target,
  maxScore,
  trend,
  icon,
  className
}: CompactMetricCardProps) {
  const percentage = (currentScore / maxScore) * 100;
  const isTargetMet = currentScore >= target;
  const isExcellent = currentScore >= maxScore * 0.9;
  
  const getEmoji = () => {
    if (isExcellent) return "🌟";
    if (isTargetMet) return "😊";
    if (currentScore >= target * 0.8) return "😐";
    return "😞";
  };

  const getStatusColor = () => {
    if (isExcellent) return "text-success";
    if (isTargetMet) return "text-success";
    if (currentScore >= target * 0.8) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className={cn("hover-lift animate-fade-in card-shadow group hover:card-shadow-hover transition-all duration-300", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon && <div className="text-primary">{icon}</div>}
            <h3 className="text-sm font-semibold truncate">{title}</h3>
          </div>
          <div className="text-lg">{getEmoji()}</div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={cn("text-2xl font-bold", getStatusColor())}>
              {currentScore}
            </span>
            <div className="flex items-center gap-1">
              {isTargetMet && <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />}
              <Badge 
                variant={isTargetMet ? "default" : "secondary"} 
                className={cn(
                  "text-xs",
                  isTargetMet && "bg-success text-success-foreground"
                )}
              >
                Target: {target}
              </Badge>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "absolute top-0 left-0 h-full transition-all duration-1000 rounded-full",
                isExcellent && "bg-gradient-to-r from-success to-yellow-400",
                isTargetMet && !isExcellent && "bg-success",
                !isTargetMet && currentScore >= target * 0.8 && "bg-warning",
                !isTargetMet && currentScore < target * 0.8 && "bg-destructive"
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
            {/* Target marker */}
            <div 
              className="absolute top-0 w-0.5 h-full bg-border"
              style={{ left: `${(target / maxScore) * 100}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              {trend > 0 ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span className={cn(
                "font-medium",
                trend > 0 ? "text-success" : "text-destructive"
              )}>
                {trend > 0 ? "+" : ""}{trend.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-2.5 w-2.5 transition-all duration-300",
                    i < Math.ceil((currentScore / maxScore) * 5) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-muted-foreground/30"
                  )} 
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}