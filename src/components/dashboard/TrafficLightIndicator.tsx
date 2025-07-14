import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TrafficLightIndicatorProps {
  metrics: {
    nps: { current: number; target: number };
    jira: { current: number; target: number };
    project: { current: number; target: number };
    adhoc: { current: number; target: number };
  };
}

export function TrafficLightIndicator({ metrics }: TrafficLightIndicatorProps) {
  // Calculate how many targets are met
  const targetsMetCount = Object.values(metrics).filter(
    metric => metric.current >= metric.target
  ).length;
  
  const totalTargets = Object.keys(metrics).length;
  const percentage = (targetsMetCount / totalTargets) * 100;
  
  // Determine overall status
  let status: "success" | "warning" | "danger";
  let icon: React.ReactNode;
  let message: string;
  
  if (percentage === 100) {
    status = "success";
    icon = <CheckCircle className="h-8 w-8 text-success" />;
    message = "All targets achieved! 🎉";
  } else if (percentage >= 75) {
    status = "warning";
    icon = <AlertCircle className="h-8 w-8 text-warning" />;
    message = "Most targets on track ⚡";
  } else {
    status = "danger";
    icon = <XCircle className="h-8 w-8 text-destructive" />;
    message = "Attention needed 🔴";
  }

  return (
    <Card className="animate-scale-in card-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-full",
            status === "success" && "bg-success/10",
            status === "warning" && "bg-warning/10", 
            status === "danger" && "bg-destructive/10"
          )}>
            {icon}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Overall Status</h3>
            <p className="text-muted-foreground">{message}</p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {targetsMetCount}/{totalTargets}
            </div>
            <p className="text-xs text-muted-foreground">targets met</p>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-1000",
                status === "success" && "bg-success",
                status === "warning" && "bg-warning",
                status === "danger" && "bg-destructive"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}