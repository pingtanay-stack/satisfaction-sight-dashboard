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
      
      <CardContent className="pt-4">
        <div className="space-y-6">
          {/* Gauge Visualization */}
          <div className="relative flex items-center justify-center py-8">
            <div className="relative w-80 h-48">
              {/* Background arc */}
              <svg className="w-full h-full" viewBox="0 0 240 140">
                <path
                  d="M 30 110 A 100 100 0 0 1 210 110"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                
                {/* Progress arc */}
                <path
                  d="M 30 110 A 100 100 0 0 1 210 110"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(gaugeAngle / 180) * 314.16} 314.16`}
                  className="transition-all duration-1000 ease-out"
                />
                
                {/* Target indicator */}
                <line
                  x1={120 + 85 * Math.cos((Math.PI * (180 - targetAngle)) / 180)}
                  y1={110 - 85 * Math.sin((Math.PI * (180 - targetAngle)) / 180)}
                  x2={120 + 105 * Math.cos((Math.PI * (180 - targetAngle)) / 180)}
                  y2={110 - 105 * Math.sin((Math.PI * (180 - targetAngle)) / 180)}
                  stroke="hsl(var(--warning))"
                  strokeWidth="4"
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
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
                <span className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {currentScore}
                </span>
                <span className="text-base text-muted-foreground font-medium">
                  Target: {target}
                </span>
                {respondents && (
                  <span className="text-base text-muted-foreground mt-2">
                    {respondents} responses
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Score ranges */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-destructive">Detractors</div>
              <div className="text-sm text-muted-foreground">-100 to 0</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-warning">Passives</div>
              <div className="text-sm text-muted-foreground">0 to 50</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-success">Promoters</div>
              <div className="text-sm text-muted-foreground">50 to 100</div>
            </div>
          </div>
          
          {/* Trend */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {isPositiveTrend ? (
              <TrendingUp className="h-5 w-5 text-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive" />
            )}
            <span className={cn(
              "text-base font-semibold",
              isPositiveTrend ? "text-success" : "text-destructive"
            )}>
              {isPositiveTrend ? "+" : ""}{trend.toFixed(1)}%
            </span>
            <span className="text-sm text-muted-foreground">vs last month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}