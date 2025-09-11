import { TrendingUp, TrendingDown, Target, Gauge, ThermometerSun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EnhancedTooltip } from "@/components/ui/enhanced-tooltip";

interface GaugeMetricCardProps {
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

export function GaugeMetricCard({
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
}: GaugeMetricCardProps) {
  const percentage = (currentScore / maxScore) * 100;
  const targetPercentage = (target / maxScore) * 100;
  const isTargetMet = currentScore >= target;
  const isPositiveTrend = trend >= 0;
  
  // Gauge calculations (semicircle)
  const radius = 40;
  const circumference = Math.PI * radius; // Half circle
  const strokeDasharray = circumference;
  const progressOffset = circumference - (percentage / 100) * circumference;
  const targetOffset = circumference - (targetPercentage / 100) * circumference;
  
  // Calculate needle angle (-90 to 90 degrees for semicircle)
  const needleAngle = -90 + (percentage / 100) * 180;
  
  const statusColor = isTargetMet 
    ? "success" 
    : percentage >= 80 
      ? "warning" 
      : "destructive";

  const getGaugeColor = () => {
    if (percentage >= 90) return "hsl(var(--primary))";
    if (percentage >= 80) return "hsl(var(--warning))";
    if (percentage >= 60) return "hsl(var(--secondary))";
    return "hsl(var(--destructive))";
  };

  const getPerformanceZone = () => {
    if (percentage >= 90) return "Optimal";
    if (percentage >= 80) return "Good";
    if (percentage >= 60) return "Fair";
    return "Critical";
  };

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
            {/* Gauge Display */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-20 mb-2">
                <svg className="w-full h-full" viewBox="0 0 100 60">
                  {/* Background arc */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                    fill="none"
                    className="opacity-20"
                  />
                  
                  {/* Colored segments */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 30 20"
                    stroke="hsl(var(--destructive))"
                    strokeWidth="6"
                    fill="none"
                    className="opacity-60"
                  />
                  <path
                    d="M 30 20 A 40 40 0 0 1 50 10"
                    stroke="hsl(var(--warning))"
                    strokeWidth="6"
                    fill="none"
                    className="opacity-60"
                  />
                  <path
                    d="M 50 10 A 40 40 0 0 1 70 20"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="6"
                    fill="none"
                    className="opacity-60"
                  />
                  <path
                    d="M 70 20 A 40 40 0 0 1 90 50"
                    stroke="hsl(var(--primary))"
                    strokeWidth="6"
                    fill="none"
                    className="opacity-60"
                  />
                  
                  {/* Target marker */}
                  <line
                    x1="50"
                    y1="50"
                    x2={50 + 35 * Math.cos(((-90 + (targetPercentage / 100) * 180) * Math.PI) / 180)}
                    y2={50 + 35 * Math.sin(((-90 + (targetPercentage / 100) * 180) * Math.PI) / 180)}
                    stroke="hsl(var(--foreground))"
                    strokeWidth="2"
                    className="opacity-50"
                    strokeDasharray="2,2"
                  />
                  
                  {/* Needle */}
                  <line
                    x1="50"
                    y1="50"
                    x2={50 + 30 * Math.cos((needleAngle * Math.PI) / 180)}
                    y2={50 + 30 * Math.sin((needleAngle * Math.PI) / 180)}
                    stroke={getGaugeColor()}
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="transition-all duration-700 group-hover:animate-pulse"
                    style={{
                      filter: `drop-shadow(0 0 4px ${getGaugeColor()}40)`
                    }}
                  />
                  
                  {/* Center dot */}
                  <circle
                    cx="50"
                    cy="50"
                    r="3"
                    fill={getGaugeColor()}
                    className="transition-all duration-300"
                  />
                  
                  {/* Performance zone labels */}
                  <text x="15" y="58" fontSize="6" fill="hsl(var(--muted-foreground))" textAnchor="middle">0</text>
                  <text x="50" y="15" fontSize="6" fill="hsl(var(--muted-foreground))" textAnchor="middle">50</text>
                  <text x="85" y="58" fontSize="6" fill="hsl(var(--muted-foreground))" textAnchor="middle">100</text>
                </svg>
              </div>
              
              {/* Performance Zone */}
              <div className="text-center">
                <div className={cn(
                  "text-sm font-medium mb-1",
                  percentage >= 80 ? "text-primary" : "text-muted-foreground"
                )}>
                  {getPerformanceZone()} Zone
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {currentScore.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">
                  / {maxScore} (Target: {target.toFixed(1)})
                </div>
              </div>
            </div>
            
            {/* Thermometer-style indicator */}
            <div className="flex items-center justify-center gap-2">
              <ThermometerSun className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-24">
                <div 
                  className="h-full transition-all duration-700 rounded-full"
                  style={{ 
                    width: `${Math.min(percentage, 100)}%`,
                    background: `linear-gradient(90deg, ${
                      percentage < 25 ? '#ef4444' :
                      percentage < 50 ? '#f59e0b' :
                      percentage < 75 ? '#3b82f6' :
                      '#22c55e'
                    } 0%, ${
                      percentage < 25 ? '#dc2626' :
                      percentage < 50 ? '#d97706' :
                      percentage < 75 ? '#2563eb' :
                      '#16a34a'
                    } 100%)`
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground min-w-[3rem]">
                {percentage.toFixed(0)}%
              </span>
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