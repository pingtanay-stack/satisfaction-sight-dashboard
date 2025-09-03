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
  
  // Normalize score to 0-100 range for display purposes
  const normalizedScore = ((currentScore + 100) / 200) * 100;
  const normalizedTarget = ((target + 100) / 200) * 100;
  
  // Determine status and styling
  let statusText: string;
  let statusColor: string;
  let progressColor: string;
  let backgroundColor: string;
  
  if (currentScore >= 70) {
    statusText = "Excellent";
    statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
    progressColor = "bg-emerald-500";
    backgroundColor = "from-emerald-50 to-emerald-100";
  } else if (currentScore >= 50) {
    statusText = "Great";
    statusColor = "bg-green-50 text-green-700 border-green-200";
    progressColor = "bg-green-500";
    backgroundColor = "from-green-50 to-green-100";
  } else if (currentScore >= 30) {
    statusText = "Good";
    statusColor = "bg-yellow-50 text-yellow-700 border-yellow-200";
    progressColor = "bg-yellow-500";
    backgroundColor = "from-yellow-50 to-yellow-100";
  } else if (currentScore >= 0) {
    statusText = "Improving";
    statusColor = "bg-orange-50 text-orange-700 border-orange-200";
    progressColor = "bg-orange-500";
    backgroundColor = "from-orange-50 to-orange-100";
  } else {
    statusText = "Needs Focus";
    statusColor = "bg-red-50 text-red-700 border-red-200";
    progressColor = "bg-red-500";
    backgroundColor = "from-red-50 to-red-100";
  }

  return (
    <Card 
      className={cn(
        "relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${backgroundColor} opacity-50`} />
      
      <CardHeader className="relative pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-slate-600" />
            <CardTitle className="text-base font-semibold text-slate-700">
              Net Promoter Score
            </CardTitle>
          </div>
          <Badge className={cn("text-xs font-medium", statusColor)}>
            {statusText}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-6">
        {/* Main Score Display */}
        <div className="text-center space-y-2">
          <div className="text-5xl font-bold text-slate-800">
            {currentScore}
          </div>
          <div className="text-sm text-slate-600">
            Target: <span className="font-semibold">{target}</span>
          </div>
          {respondents && (
            <div className="text-xs text-slate-500">
              Based on {respondents.toLocaleString()} responses
            </div>
          )}
        </div>

        {/* Progress Bar Gauge */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>-100</span>
            <span>0</span>
            <span>+100</span>
          </div>
          
          <div className="relative">
            {/* Background track */}
            <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
              {/* Colored sections */}
              <div className="absolute inset-0 flex">
                <div className="w-1/2 bg-red-200"></div>
                <div className="w-1/4 bg-yellow-200"></div>
                <div className="w-1/4 bg-green-200"></div>
              </div>
              
              {/* Progress indicator */}
              <div 
                className={`absolute top-0 left-0 h-full ${progressColor} transition-all duration-1000 ease-out rounded-full`}
                style={{ width: `${normalizedScore}%` }}
              />
            </div>
            
            {/* Target marker */}
            <div 
              className="absolute top-0 w-1 h-4 bg-amber-600 rounded-full transform -translate-x-0.5"
              style={{ left: `${normalizedTarget}%` }}
              title={`Target: ${target}`}
            />
          </div>

          {/* Scale labels */}
          <div className="flex justify-between text-xs text-slate-400">
            <span>Detractors</span>
            <span>Passives</span>
            <span>Promoters</span>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-1">
            {isPositiveTrend ? (
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={cn(
              "text-sm font-semibold",
              isPositiveTrend ? "text-emerald-600" : "text-red-600"
            )}>
              {isPositiveTrend ? "+" : ""}{trend.toFixed(1)}%
            </span>
          </div>
          <span className="text-xs text-slate-500">vs last month</span>
          
          {isTargetMet && (
            <div className="ml-2 flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-xs text-emerald-600 font-medium">Target Met</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}