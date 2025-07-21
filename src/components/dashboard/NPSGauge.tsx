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
  // NPS ranges from -100 to 100, so we need to normalize for display
  const normalizedScore = ((currentScore + 100) / 200) * 100; // Convert to 0-100 percentage
  const normalizedTarget = ((target + 100) / 200) * 100;
  const isTargetMet = currentScore >= target;
  const isPositiveTrend = trend >= 0;
  
  // Determine status color based on NPS ranges
  let statusColor: "success" | "warning" | "destructive";
  let statusText: string;
  
  if (currentScore >= 70) {
    statusColor = "success";
    statusText = "Excellent";
  } else if (currentScore >= 50) {
    statusColor = "success";
    statusText = "Great";
  } else if (currentScore >= 30) {
    statusColor = "warning";
    statusText = "Good";
  } else if (currentScore >= 0) {
    statusColor = "warning";
    statusText = "Improving";
  } else {
    statusColor = "destructive";
    statusText = "Needs Attention";
  }

  // Calculate the angle for the gauge (180 degrees total)
  const gaugeAngle = (normalizedScore / 100) * 180;
  const targetAngle = (normalizedTarget / 100) * 180;
  
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
            variant={statusColor === "success" ? "default" : "secondary"}
            className={cn(
              "text-xs",
              statusColor === "success" && "bg-success text-success-foreground",
              statusColor === "warning" && "bg-warning text-warning-foreground",
              statusColor === "destructive" && "bg-destructive text-destructive-foreground"
            )}
          >
            {statusText}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="space-y-4">
          {/* Gauge Visualization */}
          <div className="relative flex items-center justify-center py-4">
            <div className="relative w-48 h-28">
              {/* Background arc */}
              <svg className="w-full h-full" viewBox="0 0 200 110">
                <path
                  d="M 20 85 A 80 80 0 0 1 180 85"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                
                {/* Progress arc */}
                <path
                  d="M 20 85 A 80 80 0 0 1 180 85"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(gaugeAngle / 180) * 251.33} 251.33`}
                  className="transition-all duration-1000 ease-out"
                />
                
                {/* Target indicator */}
                <line
                  x1={100 + 70 * Math.cos((Math.PI * (180 - targetAngle)) / 180)}
                  y1={85 - 70 * Math.sin((Math.PI * (180 - targetAngle)) / 180)}
                  x2={100 + 85 * Math.cos((Math.PI * (180 - targetAngle)) / 180)}
                  y2={85 - 85 * Math.sin((Math.PI * (180 - targetAngle)) / 180)}
                  stroke="hsl(var(--warning))"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--destructive))" />
                    <stop offset="50%" stopColor="hsl(var(--warning))" />
                    <stop offset="100%" stopColor="hsl(var(--success))" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center score display */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {currentScore}
                </span>
                <span className="text-xs text-muted-foreground">
                  Target: {target}
                </span>
                {respondents && (
                  <span className="text-xs text-muted-foreground mt-1">
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