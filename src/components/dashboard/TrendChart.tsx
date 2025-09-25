import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrendChartProps {
  title: string;
  data: Array<{
    month: string;
    score: number;
  }>;
  target: number;
  maxScore: number;
}

export function TrendChart({ title, data, target, maxScore }: TrendChartProps) {
  return (
    <div className="animate-slide-up">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title} - Monthly Trend</h3>
      </div>
      <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, maxScore]}
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [value.toFixed(1), 'Score']}
              />
              
              {/* Target line */}
              <ReferenceLine 
                y={target} 
                stroke="hsl(var(--warning))" 
                strokeDasharray="5 5"
                label={{ value: "Target", position: "top" }}
              />
              
              {/* Score line */}
              <Line
                type="monotone"
                dataKey="score"
                stroke="url(#gradient)"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(var(--secondary))' }}
              />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
    </div>
  );
}