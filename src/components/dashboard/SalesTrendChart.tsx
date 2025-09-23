import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SalesTrendChartProps {
  data: Array<{
    month: string;
    [key: string]: string | number;
  }>;
  title?: string;
  showActualVsTarget?: boolean;
}

export function SalesTrendChart({ data, title = "Sales Trend", showActualVsTarget = false }: SalesTrendChartProps) {
  // Get all keys except 'month' for dynamic line rendering
  const dataKeys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'month') : [];
  
  // Determine the appropriate scale based on data values
  const getDataScale = () => {
    if (data.length === 0) return { divisor: 1, suffix: '' };
    
    const allValues = data.flatMap(item => 
      dataKeys.map(key => typeof item[key] === 'number' ? item[key] as number : 0)
    ).filter(val => val > 0);
    
    if (allValues.length === 0) return { divisor: 1, suffix: '' };
    
    const maxValue = Math.max(...allValues);
    
    if (maxValue >= 1000000000) {
      return { divisor: 1000000000, suffix: 'B' };
    } else if (maxValue >= 1000000) {
      return { divisor: 1000000, suffix: 'M' };
    } else if (maxValue >= 1000) {
      return { divisor: 1000, suffix: 'K' };
    }
    return { divisor: 1, suffix: '' };
  };

  const { divisor, suffix } = getDataScale();
  
  // Color palette for different products (hsl values for theming)
  const baseColors = [
    'hsl(262, 83%, 58%)', // Primary purple
    'hsl(142, 71%, 45%)', // Success green  
    'hsl(38, 92%, 50%)',  // Warning amber
    'hsl(0, 72%, 51%)',   // Destructive red
    'hsl(199, 89%, 48%)', // Info blue
    'hsl(262, 52%, 47%)'  // Muted purple
  ];

  // Process data keys for actual vs target visualization
  const processedKeys = showActualVsTarget 
    ? dataKeys.reduce((acc, key) => {
        if (key.includes('_actual') || key.includes('_target')) {
          acc.push(key);
        } else {
          // Legacy support for non-actual/target data
          acc.push(key);
        }
        return acc;
      }, [] as string[])
    : dataKeys;

  // Group keys by product for color consistency
  const getProductName = (key: string) => {
    return key.replace('_actual', '').replace('_target', '');
  };

  const productGroups = processedKeys.reduce((acc, key) => {
    const product = getProductName(key);
    if (!acc[product]) acc[product] = [];
    acc[product].push(key);
    return acc;
  }, {} as Record<string, string[]>);

  // Assign colors to product groups
  const productColors = Object.keys(productGroups).reduce((acc, product, index) => {
    acc[product] = baseColors[index % baseColors.length];
    return acc;
  }, {} as Record<string, string>);

  // Custom legend component
  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap gap-4 justify-center mt-4 text-xs">
        {payload.map((entry: any, index: number) => {
          const isTarget = entry.dataKey.includes('_target');
          const productName = getProductName(entry.dataKey);
          const displayName = productName.charAt(0).toUpperCase() + productName.slice(1);
          
          return (
            <div key={index} className="flex items-center gap-1">
              <div 
                className="w-3 h-0.5 rounded"
                style={{ 
                  backgroundColor: entry.color,
                  borderStyle: isTarget ? 'dashed' : 'solid',
                  borderWidth: isTarget ? '1px' : '0px',
                  borderColor: entry.color
                }}
              />
              <span className="text-muted-foreground">
                {displayName} {isTarget ? '(Target)' : '(Actual)'}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const InfoPopover = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Info className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 text-sm">
        <div className="space-y-2">
          <h4 className="font-semibold">Chart Legend</h4>
          <div className="space-y-1">
            <p><strong>Solid lines:</strong> Actual sales performance</p>
            <p><strong>Dashed lines:</strong> Target sales goals</p>
            <p><strong>Colors:</strong> Each product has a unique color</p>
            <p><strong>Tooltips:</strong> Hover over data points for detailed values</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <InfoPopover />
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => suffix ? `$${(value / divisor).toFixed(1)}${suffix}` : `$${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                const productName = getProductName(name);
                const isTarget = name.includes('_target');
                const displayName = `${productName.charAt(0).toUpperCase() + productName.slice(1)} ${isTarget ? '(Target)' : '(Actual)'}`;
                const formattedValue = suffix ? `$${(value / divisor).toFixed(2)}${suffix}` : `$${value.toLocaleString()}`;
                return [formattedValue, displayName];
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend content={<CustomLegend />} />
            
            {processedKeys.map((key) => {
              const productName = getProductName(key);
              const isTarget = key.includes('_target');
              const color = productColors[productName];
              
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2}
                  strokeDasharray={isTarget ? "5 5" : "0"}
                  dot={{ r: 4, fill: color }}
                  activeDot={{ r: 6, fill: color }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}