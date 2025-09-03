import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface NPSGaugeProps {
  currentScore: number;
  target: number;
  trend: number;
  respondents?: number;
  className?: string;
  onClick?: () => void;
}

export function NPSGauge({ currentScore, target, trend, respondents, className, onClick }: NPSGaugeProps) {
  // Generate unique ID for this component instance to avoid gradient conflicts
  const uniqueId = `gaugeGradient-${Math.random().toString(36).substr(2, 9)}`;
  
  // NPS ranges from -100 to 100, so we need to normalize for display
  const normalizedScore = Math.max(0, Math.min(100, ((currentScore + 100) / 200) * 100));
  const normalizedTarget = Math.max(0, Math.min(100, ((target + 100) / 200) * 100));
  const isTargetMet = currentScore >= target;
  const isPositiveTrend = trend >= 0;
  
  // Determine status color and styling
  let statusColor: string;
  let statusText: string;
  let gaugeColor: string;
  
  if (currentScore >= 70) {
    statusColor = "text-green-600 bg-green-100";
    statusText = "Excellent";
    gaugeColor = "#22c55e";
  } else if (currentScore >= 50) {
    statusColor = "text-green-600 bg-green-100";
    statusText = "Great";
    gaugeColor = "#22c55e";
  } else if (currentScore >= 30) {
    statusColor = "text-yellow-600 bg-yellow-100";
    statusText = "Good";
    gaugeColor = "#eab308";
  } else if (currentScore >= 0) {
    statusColor = "text-yellow-600 bg-yellow-100";
    statusText = "Improving";
    gaugeColor = "#eab308";
  } else {
    statusColor = "text-red-600 bg-red-100";
    statusText = "Needs Attention";
    gaugeColor = "#ef4444";
  }

  // Calculate the percentage for the arc (0 to 1)
  const arcPercentage = normalizedScore / 100;
  const targetPercentage = normalizedTarget / 100;
  
  // SVG circle calculation: circumference of half circle (π * radius)
  const radius = 70;
  const circumference = Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - arcPercentage);
  
  return (
    <Card 
      className={cn(
        "hover-lift card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in cursor-pointer hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Promoter Score (NPS)
            </CardTitle>
          </div>
          <Badge 
            className={cn("text-xs", statusColor)}
          >
            {statusText}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="space-y-4">
          {/* Gauge Visualization */}
          <div className="relative flex items-center justify-center py-4">
            <div className="relative w-64 h-32">
              {/* Background arc */}
              <svg className="w-full h-full" viewBox="0 0 200 110" style={{ transform: 'rotate(0deg)' }}>
                {/* Background semicircle */}
                <path
                  d="M 30 85 A 70 70 0 0 1 170 85"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                
                {/* Progress arc */}
                <path
                  d="M 30 85 A 70 70 0 0 1 170 85"
                  fill="none"
                  stroke={gaugeColor}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                  style={{ transformOrigin: '100px 85px' }}
                />
                
                {/* Target indicator */}
                <circle
                  cx={30 + (170 - 30) * targetPercentage}
                  cy={85 - Math.sin(Math.PI * targetPercentage) * 70}
                  r="4"
                  fill="#f59e0b"
                  stroke="#fff"
                  strokeWidth="2"
                />
              </svg>
              
              {/* Center score display */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
                <span className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {currentScore}
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  Target: {target}
                </span>
                {respondents && (
                  <span className="text-sm text-muted-foreground mt-1">
                    {respondents} responses
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Score ranges */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <div className="text-xs font-medium text-destructive">Detractors</div>
              <div className="text-xs text-muted-foreground">-100 to 0</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-medium text-warning">Passives</div>
              <div className="text-xs text-muted-foreground">0 to 50</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-medium text-success">Promoters</div>
              <div className="text-xs text-muted-foreground">50 to 100</div>
            </div>
          </div>
          
          {/* Trend */}
          <div className="flex items-center justify-center gap-1">
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