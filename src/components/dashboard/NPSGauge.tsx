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
  const isTargetMet = currentScore >= target;
  const isPositiveTrend = trend >= 0;
  
  // Normalize NPS score from -100/100 to 0-100 for display
  const normalizedScore = Math.max(0, Math.min(100, ((currentScore + 100) / 200) * 100));
  const normalizedTarget = Math.max(0, Math.min(100, ((target + 100) / 200) * 100));
  
  // Determine status and colors
  let statusText: string;
  let statusBadgeClass: string;
  let progressColor: string;
  
  if (currentScore >= 70) {
    statusText = "Excellent";
    statusBadgeClass = "bg-green-100 text-green-800 border-green-200";
    progressColor = "#22c55e";
  } else if (currentScore >= 50) {
    statusText = "Great";
    statusBadgeClass = "bg-green-100 text-green-800 border-green-200";
    progressColor = "#22c55e";
  } else if (currentScore >= 30) {
    statusText = "Good";
    statusBadgeClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
    progressColor = "#eab308";
  } else if (currentScore >= 0) {
    statusText = "Improving";
    statusBadgeClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
    progressColor = "#eab308";
  } else {
    statusText = "Needs Attention";
    statusBadgeClass = "bg-red-100 text-red-800 border-red-200";
    progressColor = "#ef4444";
  }
  
  // Calculate circular progress (0 to 75% of full circle)
  const progressPercentage = normalizedScore * 0.75; // Max 75% of circle
  const targetPercentage = normalizedTarget * 0.75;
  
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;
  
  return (
    <Card 
      className={cn(
        "hover:shadow-lg transition-all duration-300 cursor-pointer border",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-medium text-gray-700">
              Net Promoter Score
            </CardTitle>
          </div>
          <Badge 
            variant="outline"
            className={cn("text-xs font-medium", statusBadgeClass)}
          >
            {statusText}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-6">
          {/* Circular Progress Gauge */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="6"
                />
                
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={progressColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
                
                {/* Target marker */}
                {target !== currentScore && (
                  <circle
                    cx={50 + radius * Math.cos((targetPercentage / 100) * 2 * Math.PI - Math.PI / 2)}
                    cy={50 + radius * Math.sin((targetPercentage / 100) * 2 * Math.PI - Math.PI / 2)}
                    r="3"
                    fill="#f59e0b"
                    stroke="white"
                    strokeWidth="2"
                  />
                )}
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: progressColor }}>
                    {currentScore}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Target: {target}
                  </div>
                  {respondents && (
                    <div className="text-xs text-gray-400 mt-1">
                      {respondents.toLocaleString()} responses
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Score interpretation */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="space-y-1">
              <div className="font-medium text-red-600">Detractors</div>
              <div className="text-gray-500">-100 to 0</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-yellow-600">Passives</div>
              <div className="text-gray-500">0 to 50</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-green-600">Promoters</div>
              <div className="text-gray-500">50 to 100</div>
            </div>
          </div>
          
          {/* Trend indicator */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t">
            <div className="flex items-center gap-1">
              {isPositiveTrend ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={cn(
                "text-sm font-medium",
                isPositiveTrend ? "text-green-600" : "text-red-600"
              )}>
                {isPositiveTrend ? "+" : ""}{Math.abs(trend).toFixed(1)}%
              </span>
            </div>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}