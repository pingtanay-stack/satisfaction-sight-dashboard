import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X, Trophy, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import type { Achievement } from './achievement-badge';
import type { Alert } from './alert-notification';

interface NotificationQueueProps {
  achievement: Achievement | null;
  alerts: Alert[];
  onDismissAchievement?: () => void;
  onDismissAlert?: (id: string) => void;
  onActionAlert?: (alert: Alert) => void;
}

type QueuedNotification = {
  id: string;
  type: 'achievement' | 'alert';
  data: Achievement | Alert;
  timestamp: number;
};

export function NotificationQueue({
  achievement,
  alerts,
  onDismissAchievement,
  onDismissAlert,
  onActionAlert
}: NotificationQueueProps) {
  const [queue, setQueue] = useState<QueuedNotification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<QueuedNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Build notification queue
  useEffect(() => {
    const newQueue: QueuedNotification[] = [];
    
    // Add achievement to queue
    if (achievement) {
      newQueue.push({
        id: `achievement-${achievement.id}`,
        type: 'achievement',
        data: achievement,
        timestamp: Date.now()
      });
    }

    // Add alerts to queue
    alerts.forEach(alert => {
      newQueue.push({
        id: `alert-${alert.id}`,
        type: 'alert',
        data: alert,
        timestamp: alert.createdAt.getTime()
      });
    });

    // Sort by timestamp
    newQueue.sort((a, b) => a.timestamp - b.timestamp);
    setQueue(newQueue);
  }, [achievement, alerts]);

  // Show next notification in queue
  useEffect(() => {
    if (!currentNotification && queue.length > 0) {
      setCurrentNotification(queue[0]);
      setIsVisible(true);
    }
  }, [queue, currentNotification]);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (currentNotification) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentNotification]);

  const handleDismiss = () => {
    setIsVisible(false);
    
    setTimeout(() => {
      if (currentNotification) {
        // Remove from queue
        setQueue(prev => prev.filter(n => n.id !== currentNotification.id));
        
        // Call appropriate dismiss handler
        if (currentNotification.type === 'achievement') {
          onDismissAchievement?.();
        } else {
          onDismissAlert?.((currentNotification.data as Alert).id);
        }
        
        setCurrentNotification(null);
      }
    }, 300); // Wait for animation
  };

  const handleAction = () => {
    if (currentNotification?.type === 'alert') {
      onActionAlert?.(currentNotification.data as Alert);
      handleDismiss();
    }
  };

  if (!currentNotification) return null;

  const isAchievement = currentNotification.type === 'achievement';
  const data = currentNotification.data;

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 w-80 transition-all duration-300 ease-in-out",
      isVisible 
        ? "transform translate-y-0 opacity-100" 
        : "transform translate-y-4 opacity-0 pointer-events-none"
    )}>
      <div className={cn(
        "bg-card border rounded-lg shadow-lg p-4 space-y-3",
        isAchievement 
          ? "border-primary/20 bg-primary/5" 
          : getAlertStyle(data as Alert).bgColor
      )}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {isAchievement ? (
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-semibold text-foreground">Achievement Unlocked!</h4>
                  <p className="text-sm text-muted-foreground">{(data as Achievement).title}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {getAlertIcon(data as Alert)}
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{(data as Alert).title}</h4>
                  {(data as Alert).metric && (
                    <p className="text-xs text-muted-foreground">{(data as Alert).metric}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        {!isAchievement && (
          <div className="space-y-2">
            <p className="text-sm text-foreground">{(data as Alert).message}</p>
            
            {/* Metric Values */}
            {((data as Alert).currentValue !== undefined || (data as Alert).threshold !== undefined) && (
              <div className="flex items-center gap-4 text-xs p-2 rounded-md bg-muted/30">
                {(data as Alert).currentValue !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Current: </span>
                    <span className="font-medium">{(data as Alert).currentValue?.toFixed(1)}</span>
                  </div>
                )}
                {(data as Alert).threshold !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Threshold: </span>
                    <span className="font-medium">{(data as Alert).threshold?.toFixed(1)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {queue.length > 1 && (
              <span>{queue.length - 1} more notification{queue.length > 2 ? 's' : ''}</span>
            )}
          </div>
          
          {!isAchievement && (data as Alert).actionable && (
            <button
              onClick={handleAction}
              className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            >
              Take Action
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function getAlertIcon(alert: Alert) {
  const iconMap = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    success: CheckCircle
  };
  
  const colorMap = {
    info: "text-blue-500",
    warning: "text-yellow-500", 
    error: "text-red-500",
    success: "text-green-500"
  };
  
  const Icon = iconMap[alert.type];
  return <Icon className={cn("h-5 w-5", colorMap[alert.type])} />;
}

function getAlertStyle(alert: Alert) {
  const styleMap = {
    info: { bgColor: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800" },
    warning: { bgColor: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800" },
    error: { bgColor: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800" },
    success: { bgColor: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" }
  };
  
  return styleMap[alert.type];
}