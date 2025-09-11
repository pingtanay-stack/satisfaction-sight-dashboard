import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, Target } from 'lucide-react';

interface MonthlyProgressChartProps {
  data: Array<{
    month: string;
    achieved: number;
    target: number;
    cumulative: number;
  }>;
  title?: string;
  showCumulative?: boolean;
}

export function MonthlyProgressChart({ 
  data, 
  title = "Monthly Progress Tracking",
  showCumulative = true 
}: MonthlyProgressChartProps) {
  const hasData = data && data.length > 0;
  
  if (!hasData) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No monthly data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate performance metrics
  const totalAchieved = data.reduce((sum, month) => sum + month.achieved, 0);
  const totalTarget = data.reduce((sum, month) => sum + month.target, 0);
  const overallProgress = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;
  
  // Calculate trend
  const recentMonths = data.slice(-3);
  const avgRecent = recentMonths.reduce((sum, month) => sum + month.achieved, 0) / recentMonths.length;
  const earlierMonths = data.slice(-6, -3);
  const avgEarlier = earlierMonths.length > 0 
    ? earlierMonths.reduce((sum, month) => sum + month.achieved, 0) / earlierMonths.length 
    : avgRecent;
  const trend = avgEarlier > 0 ? ((avgRecent - avgEarlier) / avgEarlier) * 100 : 0;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {title}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className={`h-4 w-4 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={trend >= 0 ? 'text-green-600' : 'text-red-600'}>
              {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="text-lg font-bold text-primary">
              ${(totalAchieved / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground">Total Achieved</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-foreground">
              {overallProgress.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Progress to Target</div>
          </div>
          <div className="text-center p-3 bg-secondary/5 rounded-lg border border-secondary/20">
            <div className="text-lg font-bold text-secondary">
              ${(totalTarget / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground">Total Target</div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {showCumulative ? (
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `$${(value / 1000000).toFixed(2)}M`, 
                    name === 'achieved' ? 'Achieved' : 
                    name === 'target' ? 'Target' : 
                    'Cumulative'
                  ]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  stroke="hsl(var(--primary))"
                  fill="url(#cumulativeGradient)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="achieved"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'hsl(var(--secondary))' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                />
                <defs>
                  <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `$${(value / 1000000).toFixed(2)}M`, 
                    name === 'achieved' ? 'Achieved' : 'Target'
                  ]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="achieved"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary"></div>
            <span className="text-xs text-muted-foreground">
              {showCumulative ? 'Cumulative' : 'Achieved'}
            </span>
          </div>
          {showCumulative && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-secondary"></div>
              <span className="text-xs text-muted-foreground">Monthly Achieved</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-muted-foreground"></div>
            <span className="text-xs text-muted-foreground">Target</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}