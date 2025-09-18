import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Car, Train, Ship, Plane, Rocket, Trophy, Star, Sparkles, Mountain, Trees, Waves, Cloud, Sun, Flag, MapPin, Users, Gift, Medal, Crown, Heart, ChevronDown, Plus, Vote, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTripDestinations } from '@/hooks/useTripDestinations';
import { supabase } from '@/integrations/supabase/client';
interface IsometricAdventureProgressProps {
  currentProgress: number; // 0-100
  target: number;
  achieved: number;
  requiredForTrip: number;
  className?: string;
}
export function IsometricAdventureProgress({
  currentProgress,
  target,
  achieved,
  requiredForTrip,
  className
}: IsometricAdventureProgressProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [particleCount, setParticleCount] = useState(0);
  const [destinationInput, setDestinationInput] = useState('');
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const [viewAllDestinations, setViewAllDestinations] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const { destinations, allDestinations, loading, submitting, createDestination, deleteDestination, toggleVote } = useTripDestinations();
  
  const isQualified = currentProgress >= 100;
  const progressCapped = Math.min(currentProgress, 100);
  useEffect(() => {
    if (isQualified) {
      setShowCelebration(true);
      setParticleCount(20);
      const timer = setTimeout(() => {
        setShowCelebration(false);
        setParticleCount(0);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isQualified]);

  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  // Journey stages with vehicles and terrain
  const getJourneyStage = (progress: number) => {
    if (progress >= 95) return {
      stage: 'space',
      vehicle: Rocket,
      terrain: 'space',
      weather: 'stars'
    };
    if (progress >= 80) return {
      stage: 'sky',
      vehicle: Plane,
      terrain: 'clouds',
      weather: 'clear'
    };
    if (progress >= 60) return {
      stage: 'ocean',
      vehicle: Ship,
      terrain: 'water',
      weather: 'wind'
    };
    if (progress >= 40) return {
      stage: 'rails',
      vehicle: Train,
      terrain: 'mountain',
      weather: 'sunny'
    };
    if (progress >= 20) return {
      stage: 'forest',
      vehicle: Car,
      terrain: 'forest',
      weather: 'partly-cloudy'
    };
    return {
      stage: 'start',
      vehicle: Car,
      terrain: 'grass',
      weather: 'morning'
    };
  };
  const journeyInfo = getJourneyStage(progressCapped);
  const VehicleIcon = journeyInfo.vehicle;

  // Waypoint markers with rewards
  const waypoints = [{
    progress: 20,
    icon: Trees,
    reward: 'Forest Base',
    color: 'text-green-500'
  }, {
    progress: 40,
    icon: Mountain,
    reward: 'Mountain Station',
    color: 'text-orange-500'
  }, {
    progress: 60,
    icon: Waves,
    reward: 'Ocean Port',
    color: 'text-blue-500'
  }, {
    progress: 80,
    icon: Cloud,
    reward: 'Sky Terminal',
    color: 'text-sky-500'
  }, {
    progress: 100,
    icon: Crown,
    reward: 'Trip Destination',
    color: 'text-yellow-500'
  }];

  // Terrain background based on current stage
  const getTerrainBackground = () => {
    switch (journeyInfo.terrain) {
      case 'space':
        return 'bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900';
      case 'clouds':
        return 'bg-gradient-to-r from-sky-200 via-blue-100 to-sky-200 dark:from-sky-800 dark:via-blue-900 dark:to-sky-800';
      case 'water':
        return 'bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300 dark:from-blue-700 dark:via-cyan-800 dark:to-blue-700';
      case 'mountain':
        return 'bg-gradient-to-r from-stone-300 via-gray-200 to-stone-300 dark:from-stone-700 dark:via-gray-800 dark:to-stone-700';
      case 'forest':
        return 'bg-gradient-to-r from-green-300 via-emerald-200 to-green-300 dark:from-green-700 dark:via-emerald-800 dark:to-green-700';
      default:
        return 'bg-gradient-to-r from-lime-200 via-green-100 to-lime-200 dark:from-lime-800 dark:via-green-900 dark:to-lime-800';
    }
  };

  // Weather effects
  const renderWeatherEffects = () => {
    const effects = [];
    switch (journeyInfo.weather) {
      case 'stars':
        for (let i = 0; i < 8; i++) {
          effects.push(<div key={`star-${i}`} className="absolute animate-twinkle" style={{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 60 + 10}%`,
            animationDelay: `${Math.random() * 2}s`
          }}>
              <Star className="h-2 w-2 text-yellow-300" />
            </div>);
        }
        break;
      case 'clear':
        effects.push(<div key="sun" className="absolute top-2 right-4 animate-pulse">
            <Sun className="h-6 w-6 text-yellow-400" />
          </div>);
        break;
      case 'wind':
        for (let i = 0; i < 4; i++) {
          effects.push(<div key={`wave-${i}`} className="absolute animate-wave opacity-30" style={{
            left: `${i * 25 + 10}%`,
            bottom: '10%',
            animationDelay: `${i * 0.3}s`
          }}>
              <div className="w-8 h-2 bg-white dark:bg-white/20 rounded-full transform rotate-12"></div>
            </div>);
        }
        break;
      case 'partly-cloudy':
        effects.push(<div key="cloud1" className="absolute top-3 left-1/4 animate-float">
            <div className="w-8 h-4 bg-white dark:bg-white/30 rounded-full"></div>
          </div>, <div key="cloud2" className="absolute top-5 right-1/3 animate-float" style={{
          animationDelay: '1s'
        }}>
            <div className="w-6 h-3 bg-white dark:bg-white/30 rounded-full"></div>
          </div>);
        break;
    }
    return effects;
  };

  // Dynamic particle trail
  const renderParticleTrail = () => {
    if (particleCount === 0) return null;
    return [...Array(particleCount)].map((_, i) => <div key={`particle-${i}`} className="absolute animate-bounce" style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 1}s`,
      animationDuration: `${1 + Math.random() * 0.5}s`
    }}>
        <Sparkles className="h-3 w-3 text-yellow-400" />
      </div>);
  };
  return <Card className={cn("glass-card overflow-hidden relative", className)}>
      {/* Celebration particles */}
      {showCelebration && <div className="absolute inset-0 pointer-events-none z-20">
          {renderParticleTrail()}
        </div>}

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Enhanced Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
      <Trophy className="h-6 w-6 text-primary animate-pulse" />
      <h3 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">Colin
      </h3>
      <Trophy className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className={cn("px-3 py-1 rounded-full text-sm font-medium", isQualified ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" : "bg-muted text-muted-foreground")}>
                {journeyInfo.stage.charAt(0).toUpperCase() + journeyInfo.stage.slice(1)} Phase
              </div>
              {isQualified && <div className="animate-bounce">
                  <Crown className="h-5 w-5 text-yellow-500" />
                </div>}
            </div>
          </div>

          {/* 3D Isometric Journey Path */}
          <div className="relative">
            <div className={cn("h-32 rounded-xl relative overflow-hidden transition-all duration-1000 border-2", getTerrainBackground(), isQualified ? "border-green-400 shadow-green-400/50 shadow-lg" : "border-border")}>
              {/* Weather effects layer */}
              <div className="absolute inset-0 z-10">
                {renderWeatherEffects()}
              </div>

              {/* Isometric path with 3D effect */}
              <div className="absolute inset-4">
                {/* Path segments with depth */}
                <div className="relative h-full">
                  {/* Base path */}
                  <div className="absolute top-1/2 left-0 right-0 h-4 bg-gradient-to-r from-stone-400 via-stone-300 to-stone-400 rounded-full transform -translate-y-1/2 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-b from-stone-200 to-stone-500 rounded-full opacity-50"></div>
                  </div>
                  
                  {/* Progress overlay with 3D effect */}
                  <div className="absolute top-1/2 left-0 h-4 bg-gradient-to-r from-primary via-secondary to-primary rounded-full transform -translate-y-1/2 transition-all duration-1000 shadow-xl" style={{
                  width: `${progressCapped}%`
                }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-shimmer"></div>
                  </div>
                </div>

                {/* Vehicle convoy with 3D positioning */}
                <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-out z-20" style={{
                left: `${Math.max(8, Math.min(92, progressCapped))}%`
              }}>
                  <div className="relative">
                    {/* Vehicle shadow */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-black/20 rounded-full blur-sm"></div>
                    
                    {/* Main vehicle */}
                    <div className={cn("relative p-4 rounded-xl transition-all duration-500 transform", isQualified ? "bg-gradient-to-br from-green-200 to-green-400 text-green-800 animate-celebrate shadow-2xl shadow-green-400/50 scale-110" : "bg-gradient-to-br from-primary/20 to-secondary/20 text-primary hover:scale-105 shadow-xl")}>
                      <VehicleIcon className={cn("h-10 w-10 transition-transform duration-300", isQualified && "animate-bounce", journeyInfo.stage === 'space' && "text-purple-600", journeyInfo.stage === 'sky' && "text-blue-600", journeyInfo.stage === 'ocean' && "text-cyan-600")} />
                      
                      {/* Progress trail */}
                      <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-12 h-2 bg-gradient-to-r from-primary/60 via-secondary/40 to-transparent rounded opacity-80"></div>
                      
                      {/* Team indicator */}
                      {progressCapped > 10 && <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1 animate-pulse">
                          <Users className="h-3 w-3 text-white" />
                        </div>}
                    </div>
                  </div>
                </div>

                {/* Start point with 3D effect */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-15">
                  <div className="relative">
                    <div className="w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full shadow-lg border-2 border-gray-400">
                      <MapPin className="h-4 w-4 text-gray-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">Start</div>
                  </div>
                </div>

                {/* Waypoints with 3D landmarks */}
                {waypoints.map((waypoint, index) => {
                const WaypointIcon = waypoint.icon;
                const reached = progressCapped >= waypoint.progress;
                const isDestination = waypoint.progress === 100;
                // Adjust positioning so 100% waypoint is visible (map 0-100% to 8-92% of container)
                const position = 8 + waypoint.progress / 100 * 84;
                return <div key={waypoint.progress} className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-15 transition-all duration-500" style={{
                  left: `${position}%`
                }}>
                      <div className={cn("relative transition-all duration-300", reached ? "scale-100 opacity-100" : "scale-75 opacity-50")}>
                        {/* Waypoint marker */}
                        <div className={cn("w-8 h-8 rounded-xl shadow-lg border-2 transition-all duration-300 flex items-center justify-center", reached ? isDestination && isQualified ? "bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-400 animate-pulse-glow" : "bg-gradient-to-br from-green-300 to-green-500 border-green-400" : "bg-gradient-to-br from-gray-200 to-gray-400 border-gray-300")}>
                          <WaypointIcon className={cn("h-4 w-4 transition-colors duration-300", reached ? waypoint.color : "text-gray-600")} />
                        </div>
                        
                        {/* Reward tooltip */}
                        <div className={cn("absolute top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap transition-all duration-300", reached ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400")}>
                          {waypoint.reward}
                        </div>

                        {/* Achievement badge for reached waypoints */}
                        {reached && <div className="absolute -top-2 -right-2 animate-bounce">
                            <Medal className="h-4 w-4 text-yellow-500" />
                          </div>}
                      </div>
                    </div>;
              })}
              </div>
            </div>
          </div>

          {/* Enhanced stats with 3D cards */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 shadow-lg">
              <div className="text-lg font-bold text-primary">{progressCapped.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl border border-secondary/20 shadow-lg">
              <div className="text-lg font-bold text-secondary">${(achieved / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-muted-foreground">Achieved</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl shadow-lg">
              <div className="text-lg font-bold text-foreground">${((requiredForTrip - achieved) / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-800/10 rounded-xl border border-yellow-200 dark:border-yellow-700 shadow-lg">
              <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                {Math.max(0, waypoints.filter(w => progressCapped >= w.progress).length)}
              </div>
              <div className="text-xs text-muted-foreground">Checkpoints</div>
            </div>
          </div>

          {/* Top 3 Dream Destinations - Always Visible */}
          <div className="space-y-4 p-4 rounded-xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="font-medium text-lg">🏆 Top Dream Destinations</span>
                <Badge variant="secondary" className="ml-2">
                  {Math.min(3, destinations.length)} of {destinations.length}
                </Badge>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Loading destinations...</div>
            ) : destinations.length > 0 ? (
              <div className="space-y-2">
                {destinations.slice(0, 3).map((destination, index) => (
                  <div
                    key={destination.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02]",
                      index === 0 && "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-300 dark:border-yellow-700 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/20",
                      index === 1 && "bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/30 dark:to-gray-900/30 border-slate-300 dark:border-slate-700 shadow-md shadow-slate-200/50 dark:shadow-slate-900/20",
                      index === 2 && "bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border-orange-300 dark:border-orange-700 shadow-md shadow-orange-200/50 dark:shadow-orange-900/20"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold shadow-lg",
                        index === 0 && "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white",
                        index === 1 && "bg-gradient-to-br from-slate-400 to-slate-600 text-white", 
                        index === 2 && "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                      )}>
                        {index === 0 && "🥇"}
                        {index === 1 && "🥈"}
                        {index === 2 && "🥉"}
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{destination.destination_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {destination.vote_count} {destination.vote_count === 1 ? 'vote' : 'votes'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={destination.user_voted ? "default" : "outline"}
                        size="lg"
                        onClick={() => toggleVote(destination.id)}
                        className={cn(
                          "shrink-0 transition-all duration-300",
                          destination.user_voted && "scale-105 shadow-lg"
                        )}
                      >
                        <Heart className={cn("h-5 w-5 mr-2", destination.user_voted && "fill-current")} />
                        {destination.vote_count}
                      </Button>
                      {currentUserId === destination.suggested_by_user_id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteDestination(destination.id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <div>No destinations yet</div>
                <div className="text-xs">Be the first to suggest a dream destination!</div>
              </div>
            )}
          </div>

          {/* Dream Destinations Section - Collapsible */}
          <Collapsible open={destinationsOpen} onOpenChange={setDestinationsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between hover:bg-primary/5">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Manage Dream Destinations
                <Badge variant="outline" className="ml-2">
                  {allDestinations.length} total
                </Badge>
                </div>
                <ChevronDown className={cn("h-4 w-4 transition-transform", destinationsOpen && "transform rotate-180")} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              {/* Add New Destination */}
              <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-dashed border-muted-foreground/30">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Suggest Your Dream Destination</h4>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Where should we go? (e.g., Bali, Tokyo, Paris...)"
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    maxLength={50}
                    onKeyPress={async (e) => {
                      if (e.key === 'Enter' && destinationInput.trim()) {
                        const success = await createDestination(destinationInput);
                        if (success) {
                          setDestinationInput('');
                        }
                      }
                    }}
                  />
                  <Button 
                    onClick={async () => {
                      if (destinationInput.trim()) {
                        const success = await createDestination(destinationInput);
                        if (success) {
                          setDestinationInput('');
                        }
                      }
                    }}
                    disabled={!destinationInput.trim() || submitting}
                    className="shrink-0"
                  >
                    {submitting ? '...' : 'Add'}
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  {destinationInput.length}/50 characters
                </div>
              </div>

              {/* All Destinations */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Vote className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">All Dream Destinations</h4>
                  </div>
                  {allDestinations.length > 3 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setViewAllDestinations(!viewAllDestinations)}
                    >
                      {viewAllDestinations ? 'Show Top 3' : `View All ${allDestinations.length}`}
                    </Button>
                  )}
                </div>
                
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground">Loading destinations...</div>
                ) : allDestinations.length > 0 ? (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {(viewAllDestinations ? allDestinations : allDestinations.slice(0, 3)).map((destination, index) => (
                      <div
                        key={destination.id}
                        className="flex items-center justify-between p-3 rounded-lg border transition-all duration-300 hover:shadow-md hover:border-primary/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{destination.destination_name}</div>
                            <div className="text-xs text-muted-foreground">
                              {destination.vote_count} {destination.vote_count === 1 ? 'vote' : 'votes'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={destination.user_voted ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleVote(destination.id)}
                            className="shrink-0"
                          >
                            <Heart className={cn("h-4 w-4 mr-1", destination.user_voted && "fill-current")} />
                            {destination.vote_count}
                          </Button>
                          {currentUserId === destination.suggested_by_user_id && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteDestination(destination.id)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300 shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <div>No destinations yet</div>
                    <div className="text-xs">Be the first to suggest a dream destination!</div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Status message with adventure theme */}
          <div className="text-center p-4 rounded-xl bg-gradient-to-r from-background/50 via-muted/20 to-background/50 border shadow-inner">
            {isQualified ? <div className="space-y-2">
                <div className="text-lg font-bold text-green-600 dark:text-green-400 animate-bounce-in">
                  🎉 🚀 Adventure Complete! Trip Unlocked! 🏆 🎉
                </div>
                <div className="text-sm text-muted-foreground">
                  Your team has conquered all terrains and reached the ultimate destination!
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Gift className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Time to vote on your dream destination!</span>
                  <Gift className="h-4 w-4 text-primary" />
                </div>
              </div> : <div className="space-y-2">
                <div className="text-foreground font-medium">
                  Next milestone: {waypoints.find(w => progressCapped < w.progress)?.reward || 'Destination'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Keep pushing forward on your epic journey! 🗺️✨
                </div>
              </div>}
          </div>
        </div>
      </CardContent>
    </Card>;

  async function handleAddDestination() {
    if (!destinationInput.trim()) return;
    
    const success = await createDestination(destinationInput.trim());
    if (success) {
      setDestinationInput('');
    }
  }
}