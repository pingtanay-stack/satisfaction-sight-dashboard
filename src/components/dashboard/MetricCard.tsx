import { TrendingUp, TrendingDown, Target, Users, Ticket, FolderOpen, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  currentScore: number;
  target: number;
  maxScore: number;
  trend: number; // percentage change
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  currentScore,
  target,
  maxScore,
  trend,
  icon,
  className
}: MetricCardProps) {
  const percentage = (currentScore / maxScore) * 100;
  const isTargetMet = currentScore >= target;
  const isPositiveTrend = trend >= 0;
  
  // Determine status color
  const statusColor = isTargetMet 
    ? "success" 
    : percentage >= 80 
      ? "warning" 
      : "destructive";

  return (
    <Card className={cn(
      "hover-lift card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in",
      className
    )}>
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
          {/* Score Display */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-700 gradient-blue-green",
                  percentage < 50 && "bg-destructive",
                  percentage >= 50 && percentage < 80 && "bg-warning",
                  percentage >= 80 && "gradient-blue-green"
                )}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            
            {/* Target indicator */}
            <div className="relative">
              <div 
                className="absolute w-0.5 h-3 bg-foreground/40 -top-5"
                style={{ left: `${(target / maxScore) * 100}%` }}
              />
              <div 
                className="absolute text-xs text-muted-foreground -top-1 transform -translate-x-1/2"
                style={{ left: `${(target / maxScore) * 100}%` }}
              >
                Target
              </div>
            </div>
          </div>
          
          {/* Trend */}
          <div className="flex items-center gap-1">
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
        </div>
      </CardContent>
    </Card>
  );
}