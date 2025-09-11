import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, MapPin, Trophy, Star, Sparkles, Users, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedCompanyTripProgressProps {
  currentProgress: number; // 0-100
  target: number; // Target amount needed
  achieved: number; // Current amount achieved
  requiredForTrip: number; // Amount required for trip
  className?: string;
}

export function EnhancedCompanyTripProgress({
  currentProgress,
  target,
  achieved,
  requiredForTrip,
  className
}: EnhancedCompanyTripProgressProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const isQualified = currentProgress >= 100;
  const progressCapped = Math.min(currentProgress, 100);
  
  // Trigger celebration when qualified
  useEffect(() => {
    if (isQualified) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isQualified]);

  // Get milestone stage
  const getMilestoneStage = (progress: number) => {
    if (progress >= 100) return 'destination';
    if (progress >= 75) return 'descent';
    if (progress >= 50) return 'cruising';
    if (progress >= 25) return 'climbing';
    return 'takeoff';
  };

  const stage = getMilestoneStage(progressCapped);

  // Background effects based on stage
  const getStageBackground = () => {
    switch (stage) {
      case 'takeoff':
        return 'bg-gradient-to-r from-orange-100 via-yellow-50 to-orange-100 dark:from-orange-900/20 dark:via-yellow-800/10 dark:to-orange-900/20';
      case 'climbing':
        return 'bg-gradient-to-r from-blue-100 via-sky-50 to-blue-100 dark:from-blue-900/20 dark:via-sky-800/10 dark:to-blue-900/20';
      case 'cruising':
        return 'bg-gradient-to-r from-sky-100 via-sky-50 to-sky-100 dark:from-sky-900/20 dark:via-sky-800/10 dark:to-sky-900/20';
      case 'descent':
        return 'bg-gradient-to-r from-green-100 via-emerald-50 to-green-100 dark:from-green-900/20 dark:via-emerald-800/10 dark:to-green-900/20';
      case 'destination':
        return 'bg-gradient-to-r from-emerald-100 via-green-50 to-emerald-100 dark:from-emerald-900/20 dark:via-green-800/10 dark:to-emerald-900/20';
      default:
        return 'bg-gradient-to-r from-sky-100 via-sky-50 to-sky-100 dark:from-sky-900/20 dark:via-sky-800/10 dark:to-sky-900/20';
    }
  };

  const getPilotCharacter = () => {
    if (isQualified) {
      return (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="relative bg-green-100 dark:bg-green-900/50 rounded-full p-2">
            <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
              <Star className="h-3 w-3 text-yellow-800" />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("glass-card overflow-hidden relative", className)}>
      {/* Celebration Confetti Effect */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.8 + Math.random() * 0.4}s`
              }}
            >
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </div>
          ))}
        </div>
      )}

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header with Enhanced Title */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-primary animate-pulse" />
              <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                🌟 Company Trip Adventure
              </h3>
              <Trophy className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">
              {stage === 'destination' ? '🎉 All aboard! Adventure complete!' : `${stage.charAt(0).toUpperCase() + stage.slice(1)} phase`}
            </p>
          </div>

          {/* Enhanced Flight Path Visualization */}
          <div className="relative">
            {/* Flight Path Background with Stage Effects */}
            <div className={cn("h-24 rounded-lg relative overflow-hidden transition-all duration-1000", getStageBackground())}>
              {/* Dynamic Clouds based on stage */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute top-2 left-8 w-6 h-3 bg-white dark:bg-white/20 rounded-full animate-float"></div>
                <div className="absolute top-4 right-12 w-8 h-4 bg-white dark:bg-white/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-3 left-20 w-5 h-2 bg-white dark:bg-white/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                {stage === 'destination' && (
                  <div className="absolute top-1 right-8 w-4 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                )}
              </div>
              
              {/* Progress Track with Gradient */}
              <div className="absolute top-1/2 left-4 right-4 h-2 bg-gray-300 dark:bg-gray-600 rounded-full transform -translate-y-1/2 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-primary/90 to-secondary rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${progressCapped}%` }}
                >
                  {/* Shimmer effect on progress bar */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>

              {/* Enhanced Airplane with Character */}
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-out"
                style={{ left: `${Math.max(8, Math.min(92, 8 + progressCapped * 0.84))}%` }}
              >
                <div className="relative">
                  {getPilotCharacter()}
                  <div className={cn(
                    "relative p-3 rounded-full transition-all duration-500 shadow-lg",
                    isQualified 
                      ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 animate-celebrate" 
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  )}>
                    <Plane className={cn(
                      "h-8 w-8 transition-transform duration-300",
                      isQualified && "animate-bounce",
                      progressCapped > 75 && "rotate-12",
                      progressCapped < 25 && "-rotate-12"
                    )} />
                    {/* Trail effect */}
                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-8 h-1 bg-gradient-to-r from-primary/60 to-transparent rounded opacity-70"></div>
                  </div>
                </div>
              </div>

              {/* Start Point (Enhanced) */}
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <div className="relative">
                  <MapPin className="h-6 w-6 text-gray-500" />
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-3 h-3 animate-pulse"></div>
                </div>
              </div>

              {/* End Point (Enhanced Destination) */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className={cn(
                  "relative p-2 rounded-full transition-all duration-500",
                  isQualified ? "bg-green-100 dark:bg-green-900/50 animate-pulse-glow" : "bg-orange-100 dark:bg-orange-900/50"
                )}>
                  {isQualified ? (
                    <Flag className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Trophy className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  )}
                  {isQualified && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 animate-bounce">
                      <Star className="h-2 w-2 text-yellow-800" />
                    </div>
                  )}
                </div>
              </div>

              {/* Milestone Markers */}
              {[25, 50, 75].map((milestone) => (
                <div
                  key={milestone}
                  className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-300",
                    progressCapped >= milestone ? "opacity-100 scale-100" : "opacity-40 scale-75"
                  )}
                  style={{ left: `${8 + milestone * 0.84}%` }}
                >
                  <div className={cn(
                    "w-3 h-3 rounded-full border-2 transition-colors duration-300",
                    progressCapped >= milestone 
                      ? "bg-primary border-primary shadow-lg" 
                      : "bg-gray-200 border-gray-300"
                  )}>
                    {progressCapped >= milestone && (
                      <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Progress Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
              <div className="text-xl font-bold text-primary animate-number-roll">{progressCapped.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Progress</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg">
              <div className="text-xl font-bold text-foreground">
                ${((requiredForTrip - achieved) / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-lg border border-secondary/20">
              <div className="text-xl font-bold text-secondary">
                ${(achieved / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-muted-foreground">Achieved</div>
            </div>
          </div>

          {/* Enhanced Status Message */}
          <div className="text-center p-4 rounded-lg bg-gradient-to-r from-background/50 to-muted/20">
            {isQualified ? (
              <div className="space-y-2">
                <div className="text-green-600 dark:text-green-400 font-semibold text-lg animate-bounce-in">
                  ✈️ 🎉 All aboard! Trip destination unlocked! 🎉 ✈️
                </div>
                <div className="text-sm text-muted-foreground">
                  Congratulations! Your team has earned the company trip adventure!
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-foreground font-medium">
                  ${(achieved / 1000000).toFixed(1)}M of ${(requiredForTrip / 1000000).toFixed(1)}M required
                </div>
                <div className="text-sm text-muted-foreground">
                  Keep flying towards your destination! 🛫
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}