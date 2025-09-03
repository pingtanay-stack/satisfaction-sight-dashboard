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
  
  // Determine status and colors based on NPS score
  let statusText: string;
  let statusBadgeClass: string;
  let needleColor: string;
  
  if (currentScore >= 70) {
    statusText = "Excellent";
    statusBadgeClass = "bg-green-100 text-green-800 border-green-200";
    needleColor = "#22c55e";
  } else if (currentScore >= 50) {
    statusText = "Great";
    statusBadgeClass = "bg-green-100 text-green-800 border-green-200";
    needleColor = "#22c55e";
  } else if (currentScore >= 30) {
    statusText = "Good";
    statusBadgeClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
    needleColor = "#eab308";
  } else if (currentScore >= 0) {
    statusText = "Improving";
    statusBadgeClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
    needleColor = "#eab308";
  } else {
    statusText = "Needs Attention";
    statusBadgeClass = "bg-red-100 text-red-800 border-red-200";
    needleColor = "#ef4444";
  }
  
  // Calculate angles for the semicircular gauge (180 degrees total)
  // -100 = 0°, 0 = 90°, +100 = 180°
  const scoreAngle = ((currentScore + 100) / 200) * 180;
  const targetAngle = ((target + 100) / 200) * 180;
  
  // Convert angles to radians for trigonometry
  const scoreRadians = (scoreAngle - 90) * (Math.PI / 180);
  const targetRadians = (targetAngle - 90) * (Math.PI / 180);
  
  const gaugeRadius = 60;
  const centerX = 100;
  const centerY = 100;
  
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
          {/* Semicircular Gauge */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-48 h-32">
              <svg className="w-full h-full" viewBox="0 0 200 120">
                {/* Background arc from -100 to 100 */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                
                {/* Colored sections */}
                {/* Detractors section: -100 to 0 (red) */}
                <path
                  d="M 20 100 A 80 80 0 0 1 100 20"
                  fill="none"
                  stroke="#fca5a5"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                
                {/* Passives section: 0 to 50 (yellow) */}
                <path
                  d="M 100 20 A 80 80 0 0 1 140 40"
                  fill="none"
                  stroke="#fcd34d"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                
                {/* Promoters section: 50 to 100 (green) */}
                <path
                  d="M 140 40 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#86efac"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                
                {/* Score needle */}
                <g transform={`rotate(${scoreAngle - 90}, ${centerX}, ${centerY})`}>
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={centerX}
                    y2={centerY - gaugeRadius + 10}
                    stroke={needleColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r="4"
                    fill={needleColor}
                  />
                </g>
                
                {/* Target indicator */}
                {target !== currentScore && (
                  <g transform={`rotate(${targetAngle - 90}, ${centerX}, ${centerY})`}>
                    <polygon
                      points={`${centerX},${centerY - gaugeRadius + 15} ${centerX - 4},${centerY - gaugeRadius + 25} ${centerX + 4},${centerY - gaugeRadius + 25}`}
                      fill="#f59e0b"
                      stroke="white"
                      strokeWidth="1"
                    />
                  </g>
                )}
                
                {/* Scale markings */}
                {[-100, -50, 0, 50, 100].map((value) => {
                  const angle = ((value + 100) / 200) * 180 - 90;
                  const markRadius = gaugeRadius - 15;
                  const x1 = centerX + markRadius * Math.cos(angle * Math.PI / 180);
                  const y1 = centerY + markRadius * Math.sin(angle * Math.PI / 180);
                  const x2 = centerX + (markRadius + 8) * Math.cos(angle * Math.PI / 180);
                  const y2 = centerY + (markRadius + 8) * Math.sin(angle * Math.PI / 180);
                  
                  return (
                    <g key={value}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#6b7280"
                        strokeWidth="2"
                      />
                      <text
                        x={centerX + (markRadius + 18) * Math.cos(angle * Math.PI / 180)}
                        y={centerY + (markRadius + 18) * Math.sin(angle * Math.PI / 180) + 3}
                        textAnchor="middle"
                        className="text-xs fill-gray-600"
                        fontSize="10"
                      >
                        {value}
                      </text>
                    </g>
                  );
                })}
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: needleColor }}>
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