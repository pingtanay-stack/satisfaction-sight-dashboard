import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StackedCategoryChartProps {
  data: Array<{
    month: string;
    instruments_actual: number;
    reagents_actual: number;
    service_actual: number;
    [key: string]: string | number;
  }>;
  title?: string;
}

export function StackedCategoryChart({ data, title }: StackedCategoryChartProps) {
  // Transform data to include readable values (in thousands)
  const transformedData = data.map(item => ({
    month: item.month,
    Instruments: Math.round(item.instruments_actual / 1000),
    Reagents: Math.round(item.reagents_actual / 1000),
    Service: Math.round(item.service_actual / 1000)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: $${entry.value}K`}
            </p>
          ))}
          <p className="text-sm text-muted-foreground mt-1">
            Total: ${payload.reduce((sum: number, entry: any) => sum + entry.value, 0)}K
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={transformedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="month" 
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            iconType="rect"
          />
          <Bar 
            dataKey="Instruments" 
            stackId="a" 
            fill="hsl(var(--chart-1))" 
            name="Instruments"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="Reagents" 
            stackId="a" 
            fill="hsl(var(--chart-2))" 
            name="Reagents"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="Service" 
            stackId="a" 
            fill="hsl(var(--chart-3))" 
            name="Service"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}