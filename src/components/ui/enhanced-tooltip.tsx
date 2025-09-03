import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Target, Info } from "lucide-react";

interface EnhancedTooltipProps {
  title: string;
  currentValue: number;
  target?: number;
  trend?: number;
  insight?: string;
  recommendation?: string;
  benchmark?: number;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function EnhancedTooltip({
  title,
  currentValue,
  target,
  trend,
  insight,
  recommendation,
  benchmark,
  children,
  side = "top",
  className
}: EnhancedTooltipProps) {
  const isTargetMet = target ? currentValue >= target : undefined;
  const isPositiveTrend = trend && trend >= 0;

  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          side={side}
          className={cn(
            "z-50 w-80 rounded-lg border bg-card p-4 text-card-foreground shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className
          )}
          sideOffset={5}
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground">{title}</h4>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Current Value & Target */}
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Current</p>
                <p className="text-lg font-bold text-foreground">
                  {currentValue.toFixed(1)}
                </p>
              </div>
              
              {target && (
                <>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <p className="text-xs text-muted-foreground">Target</p>
                    <div className="flex items-center gap-1">
                      <p className="text-lg font-bold text-foreground">
                        {target.toFixed(1)}
                      </p>
                      {isTargetMet !== undefined && (
                        <Target 
                          className={cn(
                            "h-4 w-4",
                            isTargetMet ? "text-success" : "text-destructive"
                          )} 
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Trend */}
            {trend !== undefined && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
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
            )}

            {/* Benchmark Comparison */}
            {benchmark && (
              <div className="p-2 rounded-md bg-accent/50">
                <p className="text-xs text-muted-foreground mb-1">Industry Benchmark</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{benchmark.toFixed(1)}</span>
                  <span className={cn(
                    "text-xs font-medium",
                    currentValue > benchmark ? "text-success" : "text-destructive"
                  )}>
                    ({currentValue > benchmark ? "+" : ""}{(currentValue - benchmark).toFixed(1)} vs benchmark)
                  </span>
                </div>
              </div>
            )}

            {/* Insight */}
            {insight && (
              <div className="p-2 rounded-md bg-primary/5 border border-primary/20">
                <p className="text-xs font-medium text-primary mb-1">💡 Insight</p>
                <p className="text-xs text-foreground">{insight}</p>
              </div>
            )}

            {/* Recommendation */}
            {recommendation && (
              <div className="p-2 rounded-md bg-secondary/5 border border-secondary/20">
                <p className="text-xs font-medium text-secondary mb-1">🎯 Recommendation</p>
                <p className="text-xs text-foreground">{recommendation}</p>
              </div>
            )}
          </div>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}