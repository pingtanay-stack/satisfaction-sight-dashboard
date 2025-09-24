import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SalesTrendChart } from './SalesTrendChart';
import { Wrench, Beaker, HeadphonesIcon, TrendingUp, DollarSign, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductBreakdown {
  instruments: { current: number; target: number; achieved: number };
  reagents: { current: number; target: number; achieved: number };
  service: { current: number; target: number; achieved: number };
}

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  productType: 'urinalysis' | 'fcm' | 'other';
  totalSales: number;
  target: number;
  breakdown: ProductBreakdown;
  monthlyData: Array<{
    month: string;
    instruments_actual: number;
    instruments_target: number;
    reagents_actual: number;
    reagents_target: number;
    service_actual: number;
    service_target: number;
    total_actual: number;
    total_target: number;
  }>;
  trend: number;
}

const getProductIcon = (type: 'urinalysis' | 'fcm' | 'other') => {
  switch (type) {
    case 'urinalysis':
      return '🔬';
    case 'fcm':
      return '🧪';
    default:
      return '📊';
  }
};

const getCategoryIcon = (category: 'instruments' | 'reagents' | 'service') => {
  switch (category) {
    case 'instruments':
      return <Wrench className="h-4 w-4" />;
    case 'reagents':
      return <Beaker className="h-4 w-4" />;
    case 'service':
      return <HeadphonesIcon className="h-4 w-4" />;
  }
};

const getCategoryColor = (category: 'instruments' | 'reagents' | 'service') => {
  switch (category) {
    case 'instruments':
      return 'from-blue-500 to-blue-600';
    case 'reagents':
      return 'from-green-500 to-green-600';
    case 'service':
      return 'from-purple-500 to-purple-600';
  }
};

export function ProductDetailModal({
  open,
  onOpenChange,
  productName,
  productType,
  totalSales,
  target,
  breakdown,
  monthlyData,
  trend
}: ProductDetailModalProps) {
  const progressToTarget = (totalSales / target) * 100;
  const remainingToTarget = Math.max(0, target - totalSales);

  // Calculate category percentages
  const categoryData = [
    { 
      name: 'Instruments', 
      current: breakdown.instruments.current, 
      target: breakdown.instruments.target,
      achieved: breakdown.instruments.achieved,
      icon: 'instruments' as const 
    },
    { 
      name: 'Reagents', 
      current: breakdown.reagents.current, 
      target: breakdown.reagents.target,
      achieved: breakdown.reagents.achieved,
      icon: 'reagents' as const 
    },
    { 
      name: 'Service', 
      current: breakdown.service.current, 
      target: breakdown.service.target,
      achieved: breakdown.service.achieved,
      icon: 'service' as const 
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <span className="text-2xl">{getProductIcon(productType)}</span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {productName} Sales Breakdown
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Total Sales</span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  ${(totalSales / 1000000).toFixed(2)}M
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className={cn("h-3 w-3", trend >= 0 ? "text-green-500" : "text-red-500")} />
                  <span className={cn("text-xs", trend >= 0 ? "text-green-600" : "text-red-600")}>
                    {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium text-muted-foreground">Target Progress</span>
                </div>
                <div className="text-2xl font-bold text-secondary">
                  {progressToTarget.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  ${(remainingToTarget / 1000000).toFixed(2)}M remaining
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={progressToTarget >= 100 ? "default" : progressToTarget >= 75 ? "secondary" : "outline"}>
                    {progressToTarget >= 100 ? "Target Achieved!" : progressToTarget >= 75 ? "Close to Target" : "In Progress"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Target: ${(target / 1000000).toFixed(2)}M
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-lg">📊 Revenue Breakdown by Category</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categoryData.map((category) => {
                  const percentage = totalSales > 0 ? (category.current / totalSales) * 100 : 0;
                  const targetProgress = category.target > 0 ? (category.current / category.target) * 100 : 0;
                  return (
                    <div key={category.name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category.icon)}
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            ${(category.current / 1000000).toFixed(2)}M
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Target: ${(category.target / 1000000).toFixed(2)}M
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{percentage.toFixed(1)}% of total</span>
                          <span className={cn(
                            "font-medium",
                            targetProgress >= 100 ? "text-success" : 
                            targetProgress >= 80 ? "text-warning" : "text-destructive"
                          )}>
                            {category.achieved.toFixed(1)}% achieved
                          </span>
                        </div>
                        
                        {/* Progress toward category target */}
                        <div className="space-y-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full bg-gradient-to-r transition-all duration-1000",
                                targetProgress >= 100 ? "from-success to-success-foreground" :
                                targetProgress >= 80 ? "from-warning to-warning-foreground" :
                                getCategoryColor(category.icon)
                              )}
                              style={{ width: `${Math.min(targetProgress, 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground text-center">
                            Progress to Target: {targetProgress.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actual vs Target Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Monthly Breakdown Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SalesTrendChart 
                  data={monthlyData} 
                  title={`${productName} Category Breakdown`}
                  showActualVsTarget={false}
                />
                <div className="mt-4 flex flex-wrap gap-4 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span className="text-xs text-muted-foreground">Instruments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span className="text-xs text-muted-foreground">Reagents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-purple-500"></div>
                    <span className="text-xs text-muted-foreground">Service</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-orange-500"></div>
                    <span className="text-xs text-muted-foreground">Total</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-secondary" />
                  <span>Actual vs Target</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SalesTrendChart 
                  data={monthlyData} 
                  title={`${productName} - Actual vs Target`}
                  showActualVsTarget={true}
                />
                <div className="mt-4 flex flex-wrap gap-4 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-blue-500"></div>
                    <span className="text-xs text-muted-foreground">Instruments (Actual)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-blue-300 border-dashed border border-blue-500"></div>
                    <span className="text-xs text-muted-foreground">Instruments (Target)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-green-500"></div>
                    <span className="text-xs text-muted-foreground">Reagents (Actual)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-green-300 border-dashed border border-green-500"></div>
                    <span className="text-xs text-muted-foreground">Reagents (Target)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-purple-500"></div>
                    <span className="text-xs text-muted-foreground">Service (Actual)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-purple-300 border-dashed border border-purple-500"></div>
                    <span className="text-xs text-muted-foreground">Service (Target)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}