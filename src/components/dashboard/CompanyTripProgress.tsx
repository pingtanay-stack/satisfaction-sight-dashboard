import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, MapPin, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
interface CompanyTripProgressProps {
  currentProgress: number; // 0-100
  target: number; // Target amount needed
  achieved: number; // Current amount achieved
  requiredForTrip: number; // Amount required for trip
  className?: string;
}
export function CompanyTripProgress({
  currentProgress,
  target,
  achieved,
  requiredForTrip,
  className
}: CompanyTripProgressProps) {
  const isQualified = currentProgress >= 100;
  const progressCapped = Math.min(currentProgress, 100);
  return <Card className={cn("glass-card overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Company Trip Progress</h3>
            </div>
            
          </div>

          {/* Flight Path Visualization */}
          <div className="relative">
            {/* Flight Path Background */}
            <div className="h-20 bg-gradient-to-r from-sky-100 via-sky-50 to-sky-100 dark:from-sky-900/20 dark:via-sky-800/10 dark:to-sky-900/20 rounded-lg relative overflow-hidden">
              {/* Clouds */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-2 left-8 w-6 h-3 bg-white dark:bg-white/20 rounded-full"></div>
                <div className="absolute top-4 right-12 w-8 h-4 bg-white dark:bg-white/20 rounded-full"></div>
                <div className="absolute bottom-3 left-20 w-5 h-2 bg-white dark:bg-white/20 rounded-full"></div>
              </div>
              
              {/* Progress Track */}
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-300 dark:bg-gray-600 rounded-full transform -translate-y-1/2">
                <div className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out" style={{
                width: `${progressCapped}%`
              }}></div>
              </div>

              {/* Airplane */}
              <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-out" style={{
              left: `${Math.max(8, Math.min(92, 8 + progressCapped * 0.84))}%`
            }}>
                <div className={cn("relative p-2 rounded-full transition-colors duration-300", isQualified ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400" : "bg-primary/10 text-primary")}>
                  <Plane className={cn("h-6 w-6 transition-transform duration-300", isQualified && "animate-bounce")} />
                </div>
              </div>

              {/* Start Point */}
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <MapPin className="h-5 w-5 text-gray-500" />
              </div>

              {/* End Point (Destination) */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className={cn("p-1 rounded-full transition-colors duration-300", isQualified ? "bg-green-100 dark:bg-green-900/50" : "bg-orange-100 dark:bg-orange-900/50")}>
                  <Trophy className={cn("h-4 w-4 transition-colors duration-300", isQualified ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400")} />
                </div>
              </div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{progressCapped.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Progress</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                ${((requiredForTrip - achieved) / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-center">
            {isQualified ? <div className="text-green-600 dark:text-green-400 font-medium">
                ✈️ All aboard! Trip destination unlocked!
              </div> : <div className="text-muted-foreground">
                ${(achieved / 1000000).toFixed(1)}M of ${(requiredForTrip / 1000000).toFixed(1)}M required
              </div>}
          </div>
        </div>
      </CardContent>
    </Card>;
}