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
  // Sales-specific fields
  actualValue?: number;
  targetValue?: number;
  showActualValues?: boolean;
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
  insights,
  actualValue,
  targetValue,
  showActualValues = false
}: GaugeMetricCardProps) {
  // Dynamic scaling for sales - allow over-performance
  const dynamicMaxScore = Math.max(maxScore, target * 1.5, currentScore * 1.1);
  const percentage = (currentScore / dynamicMaxScore) * 100;
  const targetPercentage = (target / dynamicMaxScore) * 100;
  const overPerformanceRatio = currentScore / target;
  const isTargetMet = currentScore >= target;
  const isPositiveTrend = trend >= 0;
  const isOverPerforming = currentScore > target;
  
  // Gauge calculations - allow needle to go beyond normal range for over-performance
  const radius = 40;
  const circumference = Math.PI * radius; // Half circle
  const strokeDasharray = circumference;
  
  // Extend gauge range for over-performance (can go up to 140% of semicircle for visual effect)
  const extendedPercentage = Math.min((currentScore / target) * 100, 140);
  const needleAngle = -90 + (extendedPercentage / 100) * 180 * 1.4; // Extended range
  const progressOffset = circumference - (percentage / 100) * circumference;
  const targetOffset = circumference - (targetPercentage / 100) * circumference;
  
  // Sales-specific performance levels
  const getSalesStatus = () => {
    if (overPerformanceRatio >= 1.5) return { label: "Record Breaking", color: "success", zone: "Legendary", glow: true };
    if (overPerformanceRatio >= 1.25) return { label: "Bonus Territory", color: "success", zone: "Exceptional", glow: true };
    if (overPerformanceRatio >= 1.1) return { label: "Exceeded Target", color: "success", zone: "Excellent", glow: false };
    if (isTargetMet) return { label: "Target Met", color: "success", zone: "Optimal", glow: false };
    if (overPerformanceRatio >= 0.9) return { label: "Approaching Target", color: "warning", zone: "Good", glow: false };
    if (overPerformanceRatio >= 0.8) return { label: "Needs Push", color: "warning", zone: "Fair", glow: false };
    return { label: "Below Target", color: "destructive", zone: "Critical", glow: false };
  };

  const salesStatus = getSalesStatus();

  const getGaugeColor = () => {
    if (overPerformanceRatio >= 1.5) return ["hsl(var(--success))", "hsl(var(--success-foreground))"];
    if (overPerformanceRatio >= 1.25) return ["hsl(var(--primary))", "hsl(var(--primary-foreground))"];
    if (overPerformanceRatio >= 1.1) return ["hsl(var(--secondary))", "hsl(var(--secondary-foreground))"];
    if (percentage >= 80) return ["hsl(var(--primary))", "hsl(var(--primary-foreground))"];
    if (percentage >= 60) return ["hsl(var(--warning))", "hsl(var(--warning-foreground))"];
    return ["hsl(var(--destructive))", "hsl(var(--destructive-foreground))"];
  };

  const [gaugeColor] = getGaugeColor();

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
                  
                  {/* Needle - can extend beyond normal range for over-performance */}
                  <line
                    x1="50"
                    y1="50"
                    x2={50 + 30 * Math.cos((Math.min(needleAngle, 90) * Math.PI) / 180)}
                    y2={50 + 30 * Math.sin((Math.min(needleAngle, 90) * Math.PI) / 180)}
                    stroke={gaugeColor}
                    strokeWidth={salesStatus.glow ? "4" : "3"}
                    strokeLinecap="round"
                    className={cn(
                      "transition-all duration-700",
                      salesStatus.glow ? "animate-pulse" : "group-hover:animate-pulse"
                    )}
                    style={{
                      filter: `drop-shadow(0 0 ${salesStatus.glow ? '8px' : '4px'} ${gaugeColor}${salesStatus.glow ? '80' : '40'})`
                    }}
                  />
                  
                  {/* Center dot */}
                  <circle
                    cx="50"
                    cy="50"
                    r={salesStatus.glow ? "4" : "3"}
                    fill={gaugeColor}
                    className={cn(
                      "transition-all duration-300",
                      salesStatus.glow && "animate-pulse"
                    )}
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
                  salesStatus.glow ? "text-success animate-pulse" : 
                  salesStatus.color === "success" ? "text-primary" : "text-muted-foreground"
                )}>
                  {salesStatus.zone} Zone
                </div>
                <div className={cn(
                  "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                  salesStatus.glow 
                    ? "from-success to-success-foreground animate-bounce-in" 
                    : "from-primary to-secondary"
                )}>
                  {showActualValues && actualValue ? `$${(actualValue / 1000000).toFixed(1)}M` : currentScore.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {showActualValues && targetValue ? (
                    `Target: $${(targetValue / 1000000).toFixed(1)}M (${currentScore.toFixed(1)}%)`
                  ) : (
                    isOverPerforming 
                      ? `${(overPerformanceRatio * 100).toFixed(0)}% of target (${target.toFixed(1)})`
                      : `Target: ${target.toFixed(1)} (${((currentScore / target) * 100).toFixed(0)}%)`
                  )}
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