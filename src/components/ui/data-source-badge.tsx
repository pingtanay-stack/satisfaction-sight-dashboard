import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, Database, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataSourceBadgeProps {
  source: 'excel' | 'default';
  isReal: boolean;
  lastUpdated?: Date;
  className?: string;
}

export function DataSourceBadge({ source, isReal, lastUpdated, className }: DataSourceBadgeProps) {
  const getSourceInfo = () => {
    if (source === 'excel' && isReal) {
      return {
        icon: FileSpreadsheet,
        label: "Excel Data",
        variant: "default" as const,
        color: "bg-green-100 text-green-800 border-green-200"
      };
    }
    
    return {
      icon: Database,
      label: "Default Data",
      variant: "secondary" as const,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
  };

  const { icon: Icon, label, color } = getSourceInfo();
  
  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Badge className={cn("text-xs font-medium border", color)}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
      {lastUpdated && source === 'excel' && (
        <Badge variant="outline" className="text-xs">
          <Clock className="h-3 w-3 mr-1" />
          {formatLastUpdated(lastUpdated)}
        </Badge>
      )}
      {source === 'default' && (
        <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Upload Excel for real data
        </Badge>
      )}
    </div>
  );
}