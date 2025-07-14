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
}

export function OverallTrafficLight({ metrics }: OverallTrafficLightProps) {
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

  return (
    <Card className="animate-scale-in card-shadow bg-gradient-primary border-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-4">
          {/* Traffic Light Circles */}
          <div className="flex flex-col gap-2">
            <div className={cn(
              "w-6 h-6 rounded-full transition-all duration-500 border-2",
              status === "success" ? "bg-success border-success shadow-lg shadow-success/50" : "bg-muted border-muted-foreground/20"
            )} />
            <div className={cn(
              "w-6 h-6 rounded-full transition-all duration-500 border-2",
              status === "warning" ? "bg-warning border-warning shadow-lg shadow-warning/50" : "bg-muted border-muted-foreground/20"
            )} />
            <div className={cn(
              "w-6 h-6 rounded-full transition-all duration-500 border-2",
              status === "danger" ? "bg-destructive border-destructive shadow-lg shadow-destructive/50" : "bg-muted border-muted-foreground/20"
            )} />
          </div>
          
          {/* Status Content */}
          <div className="text-center text-white">
            <div className="text-3xl mb-1 animate-bounce">{emoji}</div>
            <h3 className="text-lg font-bold">{message}</h3>
            <div className="flex items-center justify-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-3 w-3 transition-all duration-300",
                    i < Math.ceil((percentage / 100) * 5) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-white/30"
                  )} 
                />
              ))}
            </div>
            <p className="text-sm text-white/80 mt-1">
              {targetsMetCount}/{totalTargets} targets achieved
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}