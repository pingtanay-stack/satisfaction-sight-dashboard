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
  let iconColor: string;
  
  if (currentScore >= 70) {
    statusText = "Excellent";
    statusColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
    progressColor = "bg-emerald-500";
    iconColor = "text-emerald-600";
  } else if (currentScore >= 50) {
    statusText = "Great";
    statusColor = "bg-green-100 text-green-800 border-green-200";
    progressColor = "bg-green-500";
    iconColor = "text-green-600";
  } else if (currentScore >= 30) {
    statusText = "Good";
    statusColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
    progressColor = "bg-yellow-500";
    iconColor = "text-yellow-600";
  } else if (currentScore >= 0) {
    statusText = "Improving";
    statusColor = "bg-orange-100 text-orange-800 border-orange-200";
    progressColor = "bg-orange-500";
    iconColor = "text-orange-600";
  } else {
    statusText = "Needs Focus";
    statusColor = "bg-red-100 text-red-800 border-red-200";
    progressColor = "bg-red-500";
    iconColor = "text-red-600";
  }

  return (
    <Card 
      className={cn(
        "bg-white hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-lg bg-blue-50", iconColor)}>
              <Target className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">
                Net Promoter Score
              </CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Customer Satisfaction</p>
            </div>
          </div>
          <Badge className={cn("text-xs font-medium", statusColor)}>
            {statusText}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Score Display with Animation */}
        <div className="text-center space-y-3">
          <div className="relative">
            <div className={cn("text-6xl font-bold transition-colors duration-500", iconColor)}>
              {currentScore}
            </div>
            <div className="absolute -top-2 -right-2">
              {isTargetMet && (
                <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
              )}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-900 font-semibold">{target}</div>
              <div className="text-gray-500 text-xs">Target</div>
            </div>
            {respondents && (
              <div className="text-center">
                <div className="text-gray-900 font-semibold">{respondents.toLocaleString()}</div>
                <div className="text-gray-500 text-xs">Responses</div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Progress Bar Gauge */}
        <div className="space-y-4">
          <div className="flex justify-between text-xs text-gray-600 font-medium">
            <span>-100</span>
            <span>0</span>
            <span>+100</span>
          </div>
          
          <div className="relative">
            {/* Background track with gradient */}
            <div className="w-full h-6 bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 rounded-full overflow-hidden border border-gray-200">
              {/* Progress indicator with animation */}
              <div 
                className={`absolute top-0 left-0 h-full ${progressColor} transition-all duration-1000 ease-out rounded-full shadow-lg`}
                style={{ width: `${normalizedScore}%` }}
              />
              
              {/* Center line marker for 0 */}
              <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-400 transform -translate-x-0.5" />
            </div>
            
            {/* Target marker with enhanced design */}
            <div 
              className="absolute -top-1 w-3 h-8 bg-amber-500 rounded-sm shadow-md transform -translate-x-1.5 border-2 border-white"
              style={{ left: `${normalizedTarget}%` }}
              title={`Target: ${target}`}
            >
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-amber-700 font-medium whitespace-nowrap">
                Target
              </div>
            </div>
          </div>

          {/* Enhanced scale labels */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-red-600">Detractors</div>
              <div className="text-xs text-gray-500">-100 to 0</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-yellow-600">Passives</div>
              <div className="text-xs text-gray-500">0 to 50</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-green-600">Promoters</div>
              <div className="text-xs text-gray-500">50 to 100</div>
            </div>
          </div>
        </div>

        {/* Enhanced Trend Indicator */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-full",
              isPositiveTrend ? "bg-emerald-100" : "bg-red-100"
            )}>
              {isPositiveTrend ? (
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div>
              <div className={cn(
                "text-sm font-semibold",
                isPositiveTrend ? "text-emerald-600" : "text-red-600"
              )}>
                {isPositiveTrend ? "+" : ""}{trend.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">vs last month</div>
            </div>
          </div>
          
          {isTargetMet && (
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-700 font-medium">Target Achieved</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}