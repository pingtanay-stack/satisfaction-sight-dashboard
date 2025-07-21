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
    <Card className="animate-scale-in shadow-elegant bg-gradient-to-br from-card via-card/95 to-card/90 border border-border/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* Modern Traffic Light */}
          <div className="relative mx-auto w-20 h-32 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700">
            {/* Traffic Light Background */}
            <div className="absolute inset-2 bg-gradient-to-b from-slate-700 to-slate-800 rounded-xl">
              {/* Light Slots */}
              <div className="flex flex-col items-center justify-center h-full gap-2 py-2">
                {/* Red Light */}
                <div className={cn(
                  "w-10 h-10 rounded-full transition-all duration-700 shadow-inner",
                  "bg-gradient-radial from-center",
                  status === "danger" 
                    ? "from-red-400 to-red-600 shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse" 
                    : "from-slate-600 to-slate-700 shadow-slate-800"
                )} />
                
                {/* Yellow Light */}
                <div className={cn(
                  "w-10 h-10 rounded-full transition-all duration-700 shadow-inner",
                  "bg-gradient-radial from-center",
                  status === "warning" 
                    ? "from-yellow-300 to-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.8)] animate-pulse" 
                    : "from-slate-600 to-slate-700 shadow-slate-800"
                )} />
                
                {/* Green Light */}
                <div className={cn(
                  "w-10 h-10 rounded-full transition-all duration-700 shadow-inner",
                  "bg-gradient-radial from-center",
                  status === "success" 
                    ? "from-green-400 to-green-600 shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-pulse" 
                    : "from-slate-600 to-slate-700 shadow-slate-800"
                )} />
              </div>
            </div>
            
            {/* Post */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-gradient-to-b from-slate-700 to-slate-900 rounded-b"></div>
          </div>
          
          {/* Status Content */}
          <div className="space-y-2">
            <div className="text-2xl animate-bounce">{emoji}</div>
            <h3 className="text-lg font-bold text-foreground">{message}</h3>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-3 w-3 transition-all duration-300",
                    i < Math.ceil((percentage / 100) * 5) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-muted-foreground/50"
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