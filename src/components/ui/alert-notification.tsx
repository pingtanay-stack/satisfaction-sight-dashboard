import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle,
  X,
  Bell
} from "lucide-react";

export interface Alert {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  metric?: string;
  currentValue?: number;
  threshold?: number;
  actionable?: boolean;
  autodismiss?: boolean;
  dismissAfter?: number; // milliseconds
  createdAt: Date;
}

interface AlertNotificationProps {
  alert: Alert;
  onDismiss?: (id: string) => void;
  onAction?: (alert: Alert) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
  style?: React.CSSProperties;
}

const alertConfig = {
  info: {
    icon: Info,
    color: "text-primary",
    bgColor: "bg-primary/5",
    borderColor: "border-primary/20"
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/5", 
    borderColor: "border-warning/20"
  },
  error: {
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/5",
    borderColor: "border-destructive/20"
  },
  success: {
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/5",
    borderColor: "border-success/20"
  }
};

const severityConfig = {
  low: {
    label: "Low Priority",
    color: "bg-muted text-muted-foreground"
  },
  medium: {
    label: "Medium Priority",
    color: "bg-primary/10 text-primary border-primary/20"
  },
  high: {
    label: "High Priority", 
    color: "bg-warning/10 text-warning border-warning/20"
  },
  critical: {
    label: "Critical",
    color: "bg-destructive/10 text-destructive border-destructive/20"
  }
};

const positionConfig = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4"
};

export function AlertNotification({
  alert,
  onDismiss,
  onAction,
  position = "top-right",
  className,
  style
}: AlertNotificationProps) {
  const config = alertConfig[alert.type];
  const severityStyle = severityConfig[alert.severity];
  const Icon = config.icon;

  React.useEffect(() => {
    if (alert.autodismiss && alert.dismissAfter && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss(alert.id);
      }, alert.dismissAfter);

      return () => clearTimeout(timer);
    }
  }, [alert, onDismiss]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div 
      className={cn(
        "fixed z-50 w-80 animate-bounce-in",
        positionConfig[position],
        className
      )}
      style={style}
    >
      <Card className={cn(
        "border shadow-lg",
        config.bgColor,
        config.borderColor
      )}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Icon className={cn("h-5 w-5 flex-shrink-0", config.color)} />
                <div>
                  <h4 className="font-semibold text-foreground text-sm leading-tight">
                    {alert.title}
                  </h4>
                  {alert.metric && (
                    <p className="text-xs text-muted-foreground">
                      {alert.metric}
                    </p>
                  )}
                </div>
              </div>
              
              {onDismiss && (
                <button 
                  onClick={() => onDismiss(alert.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Message */}
            <p className="text-sm text-foreground leading-relaxed">
              {alert.message}
            </p>

            {/* Metric Values */}
            {(alert.currentValue !== undefined || alert.threshold !== undefined) && (
              <div className="flex items-center gap-4 text-xs p-2 rounded-md bg-muted/30">
                {alert.currentValue !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Current: </span>
                    <span className="font-medium text-foreground">
                      {alert.currentValue.toFixed(1)}
                    </span>
                  </div>
                )}
                {alert.threshold !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Threshold: </span>
                    <span className="font-medium text-foreground">
                      {alert.threshold.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline"
                  className={cn("text-xs border", severityStyle.color)}
                >
                  {severityStyle.label}
                </Badge>
                
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(alert.createdAt)}
                </span>
              </div>

              {alert.actionable && onAction && (
                <button
                  onClick={() => onAction(alert)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-md transition-colors font-medium",
                    config.bgColor,
                    config.color,
                    "hover:opacity-80"
                  )}
                >
                  Take Action
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AlertManagerProps {
  alerts: Alert[];
  onDismissAlert?: (id: string) => void;
  onActionAlert?: (alert: Alert) => void;
  maxVisible?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
}

export function AlertManager({
  alerts,
  onDismissAlert,
  onActionAlert,
  maxVisible = 3,
  position = "top-right",
  className
}: AlertManagerProps) {
  const visibleAlerts = alerts.slice(0, maxVisible);

  return (
    <div className={className}>
      {visibleAlerts.map((alert, index) => (
        <AlertNotification
          key={alert.id}
          alert={alert}
          onDismiss={onDismissAlert}
          onAction={onActionAlert}
          position={position}
          style={{ 
            marginTop: `${index * 90}px`,
            animationDelay: `${index * 100}ms`
          }}
        />
      ))}
    </div>
  );
}

interface AlertBellProps {
  alertCount: number;
  hasUnread?: boolean;
  onClick?: () => void;
  className?: string;
}

export function AlertBell({
  alertCount,
  hasUnread = false,
  onClick,
  className
}: AlertBellProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-2 rounded-full transition-colors",
        "hover:bg-accent",
        hasUnread && "animate-pulse-glow",
        className
      )}
    >
      <Bell className={cn(
        "h-5 w-5",
        hasUnread ? "text-warning" : "text-muted-foreground"
      )} />
      
      {alertCount > 0 && (
        <div className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-medium">
          {alertCount > 9 ? "9+" : alertCount}
        </div>
      )}
    </button>
  );
}