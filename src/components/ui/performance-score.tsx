import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Target } from "lucide-react";

interface PerformanceScoreProps {
  score: number; // 0-100
  previousScore?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  showTrend?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    container: "w-16 h-16",
    text: "text-sm",
    subText: "text-xs",
    strokeWidth: 6
  },
  md: {
    container: "w-24 h-24",
    text: "text-lg",
    subText: "text-sm", 
    strokeWidth: 8
  },
  lg: {
    container: "w-32 h-32",
    text: "text-2xl",
    subText: "text-base",
    strokeWidth: 10
  }
};

function getScoreColor(score: number) {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
}

function getScoreGradient(score: number) {
  if (score >= 80) return "from-success to-success-foreground";
  if (score >= 60) return "from-warning to-warning-foreground";
  return "from-destructive to-destructive-foreground";
}

function getScoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Poor";
  return "Critical";
}

export function PerformanceScore({
  score,
  previousScore,
  label = "Health Score",
  size = "md",
  showTrend = true,
  animated = true,
  className
}: PerformanceScoreProps) {
  const [animatedScore, setAnimatedScore] = React.useState(0);
  const config = sizeConfig[size];
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  
  const trend = previousScore ? score - previousScore : 0;
  const isPositiveTrend = trend >= 0;

  // Animate score on mount
  React.useEffect(() => {
    if (!animated) {
      setAnimatedScore(score);
      return;
    }

    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedScore(Math.min(increment * currentStep, score));
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animated]);

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-4",
      className
    )}>
      {/* Circular Progress */}
      <div className={cn("relative", config.container)}>
        <svg 
          className="transform -rotate-90 w-full h-full"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth={config.strokeWidth}
            fill="none"
            className="opacity-20"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth={config.strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn(
              "transition-all duration-1000 ease-out",
              animated && "animate-progress-fill"
            )}
            style={{
              "--progress-width": `${animatedScore}%`
            } as React.CSSProperties}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop 
                offset="0%" 
                stopColor={score >= 80 ? "hsl(var(--success))" : 
                          score >= 60 ? "hsl(var(--warning))" : 
                          "hsl(var(--destructive))"}
              />
              <stop 
                offset="100%" 
                stopColor={score >= 80 ? "hsl(var(--success-foreground))" : 
                          score >= 60 ? "hsl(var(--warning-foreground))" : 
                          "hsl(var(--destructive-foreground))"}
                stopOpacity="0.8"
              />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Score text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn(
            "font-bold tabular-nums",
            config.text,
            getScoreColor(score),
            animated && "animate-number-roll"
          )}>
            {Math.round(animatedScore)}
          </span>
          <span className={cn(
            "font-medium text-muted-foreground",
            config.subText
          )}>
            {getScoreLabel(score)}
          </span>
        </div>
      </div>

      {/* Label and Trend */}
      <div className="mt-3 text-center">
        <p className="font-medium text-foreground text-sm">{label}</p>
        
        {showTrend && previousScore && (
          <div className="flex items-center justify-center gap-1 mt-1">
            {isPositiveTrend ? (
              <TrendingUp className="h-3 w-3 text-success" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive" />
            )}
            <span className={cn(
              "text-xs font-medium",
              isPositiveTrend ? "text-success" : "text-destructive"
            )}>
              {isPositiveTrend ? "+" : ""}{trend.toFixed(1)} pts
            </span>
          </div>
        )}
      </div>
    </div>
  );
}