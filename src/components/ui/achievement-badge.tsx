import * as React from "react";
import { cn } from "@/lib/utils";
import { Target, TrendingUp, Star, Award, Trophy, Zap } from "lucide-react";

export interface Achievement {
  id: string;
  type: "target" | "streak" | "excellence" | "improvement" | "milestone" | "consistency";
  title: string;
  description: string;
  earnedAt?: Date;
  progress?: number; // 0-100 for in-progress achievements
  value?: number;
  threshold?: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
  animate?: boolean;
  onClick?: () => void;
  className?: string;
}

const achievementConfig = {
  target: {
    icon: Target,
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/30",
    emoji: "🎯"
  },
  streak: {
    icon: Zap,
    color: "text-warning",
    bgColor: "bg-warning/10", 
    borderColor: "border-warning/30",
    emoji: "🔥"
  },
  excellence: {
    icon: Star,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    emoji: "⭐"
  },
  improvement: {
    icon: TrendingUp,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/30",
    emoji: "📈"
  },
  milestone: {
    icon: Trophy,
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
    emoji: "🏆"
  },
  consistency: {
    icon: Award,
    color: "text-accent-foreground",
    bgColor: "bg-accent",
    borderColor: "border-accent-foreground/30",
    emoji: "🏅"
  }
};

const sizeConfig = {
  sm: {
    container: "w-16 h-16",
    icon: "h-6 w-6",
    text: "text-xs",
    emoji: "text-lg"
  },
  md: {
    container: "w-20 h-20", 
    icon: "h-8 w-8",
    text: "text-sm",
    emoji: "text-xl"
  },
  lg: {
    container: "w-24 h-24",
    icon: "h-10 w-10",
    text: "text-base",
    emoji: "text-2xl"
  }
};

export function AchievementBadge({
  achievement,
  size = "md",
  showProgress = false,
  animate = false,
  onClick,
  className
}: AchievementBadgeProps) {
  const config = achievementConfig[achievement.type];
  const sizeStyles = sizeConfig[size];
  const isEarned = achievement.earnedAt !== undefined;
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        "relative flex flex-col items-center justify-center rounded-full border-2 cursor-pointer transition-all duration-300",
        sizeStyles.container,
        isEarned ? config.bgColor : "bg-muted/30",
        isEarned ? config.borderColor : "border-muted-foreground/20",
        isEarned && "hover:scale-110 hover:shadow-lg",
        animate && isEarned && "animate-badge-pop",
        !isEarned && "opacity-60 grayscale",
        className
      )}
      onClick={onClick}
      title={achievement.title}
    >
      {/* Background glow effect for earned badges */}
      {isEarned && (
        <div className={cn(
          "absolute inset-0 rounded-full blur-sm opacity-30 animate-pulse-glow",
          config.bgColor
        )} />
      )}

      {/* Badge content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Icon or Emoji */}
        <div className="mb-1">
          {size === "sm" ? (
            <span className={sizeStyles.emoji}>{config.emoji}</span>
          ) : (
            <Icon className={cn(
              sizeStyles.icon,
              isEarned ? config.color : "text-muted-foreground"
            )} />
          )}
        </div>
      </div>

      {/* Progress indicator for in-progress achievements */}
      {showProgress && achievement.progress !== undefined && !isEarned && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-500", config.bgColor)}
            style={{ width: `${achievement.progress}%` }}
          />
        </div>
      )}

      {/* Earned indicator */}
      {isEarned && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}
    </div>
  );
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  className?: string;
}

export function AchievementNotification({
  achievement,
  onClose,
  className
}: AchievementNotificationProps) {
  const config = achievementConfig[achievement.type];

  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 p-4 rounded-lg border bg-card shadow-lg animate-bounce-in",
      config.bgColor,
      config.borderColor,
      className
    )}>
      <div className="flex items-center gap-3">
        <AchievementBadge 
          achievement={achievement}
          size="sm"
          animate={true}
        />
        <div>
          <h4 className="font-semibold text-foreground">Achievement Unlocked!</h4>
          <p className="text-sm text-muted-foreground">{achievement.title}</p>
        </div>
        <button 
          onClick={onClose}
          className="ml-auto text-muted-foreground hover:text-foreground"
        >
          ×
        </button>
      </div>
    </div>
  );
}