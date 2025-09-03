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
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Horizontal Traffic Light */}
            <div className="relative w-32 h-16 bg-gradient-to-r from-gray-900 to-black rounded-2xl shadow-xl border-2 border-gray-700">
              {/* Traffic Light Background */}
              <div className="absolute inset-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl">
                {/* Light Slots */}
                <div className="flex items-center justify-center h-full gap-2 px-2">
                  {/* Red Light */}
                  <div className={cn(
                    "w-8 h-8 rounded-full transition-all duration-500 border-2",
                    status === "danger" 
                      ? "bg-red-500 border-red-300 shadow-[0_0_20px_rgba(239,68,68,0.9),inset_0_2px_6px_rgba(255,255,255,0.3)] animate-pulse" 
                      : "bg-gray-700 border-gray-600 shadow-inner"
                  )} />
                  
                  {/* Yellow Light */}
                  <div className={cn(
                    "w-8 h-8 rounded-full transition-all duration-500 border-2",
                    status === "warning" 
                      ? "bg-yellow-400 border-yellow-200 shadow-[0_0_20px_rgba(234,179,8,0.9),inset_0_2px_6px_rgba(255,255,255,0.3)] animate-pulse" 
                      : "bg-gray-700 border-gray-600 shadow-inner"
                  )} />
                  
                  {/* Green Light */}
                  <div className={cn(
                    "w-8 h-8 rounded-full transition-all duration-500 border-2",
                    status === "success" 
                      ? "bg-green-500 border-green-300 shadow-[0_0_20px_rgba(34,197,94,0.9),inset_0_2px_6px_rgba(255,255,255,0.3)] animate-pulse" 
                      : "bg-gray-700 border-gray-600 shadow-inner"
                  )} />
                </div>
              </div>
            </div>
            
            {/* Status Content */}
            <div className="flex items-center gap-3">
              <div className="text-xl">{emoji}</div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{message}</h3>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "h-2.5 w-2.5 transition-all duration-300",
                        i < Math.ceil((percentage / 100) * 5) 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-muted-foreground/50"
                      )} 
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">
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
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* Modern Traffic Light */}
          <div className="relative mx-auto w-24 h-40 bg-gradient-to-b from-gray-900 to-black rounded-3xl shadow-2xl border-2 border-gray-700">
            {/* Traffic Light Background */}
            <div className="absolute inset-3 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl">
              {/* Light Slots */}
              <div className="flex flex-col items-center justify-center h-full gap-3 py-3">
                {/* Red Light */}
                <div className={cn(
                  "w-12 h-12 rounded-full transition-all duration-500 border-2",
                  status === "danger" 
                    ? "bg-red-500 border-red-300 shadow-[0_0_25px_rgba(239,68,68,0.9),inset_0_2px_8px_rgba(255,255,255,0.3)] animate-pulse" 
                    : "bg-gray-700 border-gray-600 shadow-inner"
                )} />
                
                {/* Yellow Light */}
                <div className={cn(
                  "w-12 h-12 rounded-full transition-all duration-500 border-2",
                  status === "warning" 
                    ? "bg-yellow-400 border-yellow-200 shadow-[0_0_25px_rgba(234,179,8,0.9),inset_0_2px_8px_rgba(255,255,255,0.3)] animate-pulse" 
                    : "bg-gray-700 border-gray-600 shadow-inner"
                )} />
                
                {/* Green Light */}
                <div className={cn(
                  "w-12 h-12 rounded-full transition-all duration-500 border-2",
                  status === "success" 
                    ? "bg-green-500 border-green-300 shadow-[0_0_25px_rgba(34,197,94,0.9),inset_0_2px_8px_rgba(255,255,255,0.3)] animate-pulse" 
                    : "bg-gray-700 border-gray-600 shadow-inner"
                )} />
              </div>
            </div>
            
            {/* Post */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-gray-700 to-black rounded-b-md"></div>
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