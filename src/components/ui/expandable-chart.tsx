import React, { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpandableChartProps {
  children: ReactNode;
  title: string;
  expandable?: boolean;
  className?: string;
}

export function ExpandableChart({ 
  children, 
  title, 
  expandable = true,
  className 
}: ExpandableChartProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const chartContent = React.cloneElement(children as React.ReactElement, {
    className: cn(
      (children as React.ReactElement).props.className,
      isExpanded ? "h-96" : "h-64"
    )
  });

  if (!expandable) {
    return <div className={className}>{children}</div>;
  }

  return (
    <>
      <div className={cn("relative group", className)}>
        {children}
        {/* Expand Button - appears on hover */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          onClick={() => setIsExpanded(true)}
        >
          <Maximize2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Expanded Modal */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-hidden">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="mt-4 overflow-auto">
            {chartContent}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}