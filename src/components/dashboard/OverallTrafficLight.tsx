import { CheckCircle, AlertCircle, XCircle, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OverallTrafficLightProps {
  metrics: {
    nps: { current: number; target: number };
    jira: { current: number; target: number };
    project: { current: number; target: number };
    adhoc: { current: number; target: number };
  };
  variant?: "vertical" | "horizontal";
}

export function OverallTrafficLight({ metrics, variant = "vertical" }: OverallTrafficLightProps) {
  // Calculate how many targets are met
  const targetsMetCount = Object.values(metrics).filter(
    metric => metric.current >= metric.target
  ).length;
  
  const totalTargets = Object.keys(metrics).length;
  const percentage = (targetsMetCount / totalTargets) * 100;
  
  // Determine overall status
  let status: "success" | "warning" | "danger";
  let emoji: string;
  let message: string;
  
  if (percentage === 100) {
    status = "success";
    emoji = "😍";
    message = "Excellent Performance!";
  } else if (percentage >= 75) {
    status = "warning";
    emoji = "😊";
    message = "Good Progress";
  } else if (percentage >= 50) {
    status = "warning";
    emoji = "😐";
    message = "Needs Attention";
  } else {
    status = "danger";
    emoji = "😞";
    message = "Critical Issues";
  }

  if (variant === "horizontal") {
    return (
      <Card className="animate-scale-in shadow-elegant bg-gradient-to-br from-card via-card/95 to-card/90 border border-border/50 backdrop-blur-sm">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {/* Horizontal Traffic Light */}
            <div className="relative w-24 h-12 bg-gradient-to-r from-muted to-muted-foreground/20 rounded-xl shadow-lg border border-border">
              {/* Traffic Light Background */}
              <div className="absolute inset-1.5 bg-gradient-to-r from-background to-muted/50 rounded-lg">
                {/* Light Slots */}
                <div className="flex items-center justify-center h-full gap-1.5 px-1.5">
                  {/* Red Light */}
                  <div className={cn(
                    "w-6 h-6 rounded-full transition-all duration-500 border",
                    status === "danger" 
                      ? "bg-destructive border-destructive/50 shadow-lg shadow-destructive/50" 
                      : "bg-muted border-border"
                  )} />
                  
                  {/* Yellow Light */}
                  <div className={cn(
                    "w-6 h-6 rounded-full transition-all duration-500 border",
                    status === "warning" 
                      ? "bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-500/50" 
                      : "bg-muted border-border"
                  )} />
                  
                  {/* Green Light */}
                  <div className={cn(
                    "w-6 h-6 rounded-full transition-all duration-500 border",
                    status === "success" 
                      ? "bg-green-500 border-green-400 shadow-lg shadow-green-500/50" 
                      : "bg-muted border-border"
                  )} />
                </div>
              </div>
            </div>
            
            {/* Status Content */}
            <div className="flex items-center gap-2">
              <div className="text-lg">{emoji}</div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{message}</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "h-2.5 w-2.5 transition-all duration-300",
                        i < Math.ceil((percentage / 100) * 5) 
                          ? "text-yellow-500 fill-yellow-500" 
                          : "text-muted-foreground/40"
                      )} 
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1.5">
                    {targetsMetCount}/{totalTargets}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-scale-in shadow-elegant bg-gradient-to-br from-card via-card/95 to-card/90 border border-border/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          {/* Modern Traffic Light */}
          <div className="relative mx-auto w-16 h-28 bg-gradient-to-b from-muted to-muted-foreground/20 rounded-2xl shadow-lg border border-border">
            {/* Traffic Light Background */}
            <div className="absolute inset-2 bg-gradient-to-b from-background to-muted/50 rounded-xl">
              {/* Light Slots */}
              <div className="flex flex-col items-center justify-center h-full gap-2 py-2">
                {/* Red Light */}
                <div className={cn(
                  "w-8 h-8 rounded-full transition-all duration-500 border",
                  status === "danger" 
                    ? "bg-destructive border-destructive/50 shadow-lg shadow-destructive/50" 
                    : "bg-muted border-border"
                )} />
                
                {/* Yellow Light */}
                <div className={cn(
                  "w-8 h-8 rounded-full transition-all duration-500 border",
                  status === "warning" 
                    ? "bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-500/50" 
                    : "bg-muted border-border"
                )} />
                
                {/* Green Light */}
                <div className={cn(
                  "w-8 h-8 rounded-full transition-all duration-500 border",
                  status === "success" 
                    ? "bg-green-500 border-green-400 shadow-lg shadow-green-500/50" 
                    : "bg-muted border-border"
                )} />
              </div>
            </div>
            
            {/* Post */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-gradient-to-b from-muted to-muted-foreground/40 rounded-b-md border-x border-border"></div>
          </div>
          
          {/* Status Content */}
          <div className="space-y-1.5">
            <div className="text-xl">{emoji}</div>
            <h3 className="text-sm font-semibold text-foreground">{message}</h3>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-2.5 w-2.5 transition-all duration-300",
                    i < Math.ceil((percentage / 100) * 5) 
                      ? "text-yellow-500 fill-yellow-500" 
                      : "text-muted-foreground/40"
                  )} 
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {targetsMetCount}/{totalTargets} targets achieved
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}