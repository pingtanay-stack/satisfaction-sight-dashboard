import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, BarChart, Bar, ComposedChart, Line
} from "recharts";
import { TrendingUp, Activity, Target, BarChart3 } from "lucide-react";

interface AdvancedChartsProps {
  npsData: Array<{ month: string; score: number }>;
  satisfactionData: Array<{ month: string; score: number }>;
  jiraData: Array<{ month: string; score: number }>;
  adhocData: Array<{ month: string; score: number }>;
}

// All data is now generated from real user data - no more hardcoded values!

export function AdvancedCharts({ npsData, satisfactionData, jiraData, adhocData }: AdvancedChartsProps) {
  // Combine all data for comprehensive analysis
  const combinedData = npsData.map((item, index) => ({
    month: item.month,
    nps: item.score,
    satisfaction: satisfactionData[index]?.score || 0,
    jira: jiraData[index]?.score || 0,
    adhoc: adhocData[index]?.score || 0
  }));

  // Generate real radar data from actual metrics
  const latestData = combinedData[combinedData.length - 1] || { nps: 0, satisfaction: 0, jira: 0, adhoc: 0 };
  const realRadarData = [
    { metric: 'NPS', score: latestData.nps > 0 ? ((latestData.nps + 100) / 200) * 100 : 0, fullMark: 100 },
    { metric: 'Jira', score: (latestData.jira / 5) * 100, fullMark: 100 },
    { metric: 'Project Satisfaction', score: (latestData.satisfaction / 5) * 100, fullMark: 100 },
    { metric: 'Ad-hoc Feedback', score: (latestData.adhoc / 5) * 100, fullMark: 100 }
  ];

  // Generate real correlation data from actual data
  const realCorrelationData = combinedData.map(item => ({
    nps: item.nps,
    satisfaction: item.satisfaction,
    month: item.month
  }));

  // Calculate real correlation coefficient
  const calculateCorrelation = (data: typeof realCorrelationData) => {
    if (data.length < 2) return 0;
    
    const n = data.length;
    const sumX = data.reduce((sum, item) => sum + item.nps, 0);
    const sumY = data.reduce((sum, item) => sum + item.satisfaction, 0);
    const sumXY = data.reduce((sum, item) => sum + item.nps * item.satisfaction, 0);
    const sumX2 = data.reduce((sum, item) => sum + item.nps * item.nps, 0);
    const sumY2 = data.reduce((sum, item) => sum + item.satisfaction * item.satisfaction, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  };

  const correlationCoefficient = calculateCorrelation(realCorrelationData);
  const rSquared = correlationCoefficient * correlationCoefficient;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Performance Radar */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Performance Radar
            </CardTitle>
            <Badge variant="outline">360° View</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={realRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10 }}
                  tickCount={5}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* NPS vs Satisfaction Correlation */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-secondary" />
              NPS-Satisfaction Correlation
            </CardTitle>
            <Badge variant="outline">R² = {rSquared.toFixed(2)}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={realCorrelationData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  type="number" 
                  dataKey="nps" 
                  name="NPS Score"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="satisfaction" 
                  name="Satisfaction"
                  tick={{ fontSize: 12 }}
                  domain={[0, 5]}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toFixed(1) : value,
                    name === 'nps' ? 'NPS Score' : 'Satisfaction'
                  ]}
                />
                <Scatter 
                  dataKey="satisfaction" 
                  fill="hsl(var(--secondary))"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Multi-Metric Area Chart */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Multi-Metric Trends
            </CardTitle>
            <Badge variant="outline">All Metrics</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    value.toFixed(1),
                    name.toUpperCase()
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="nps"
                  stackId="1"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="satisfaction"
                  stackId="2"
                  stroke="hsl(var(--secondary))"
                  fill="hsl(var(--secondary))"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="jira"
                  stackId="3"
                  stroke="hsl(var(--success))"
                  fill="hsl(var(--success))"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="adhoc"
                  stackId="4"
                  stroke="hsl(var(--warning))"
                  fill="hsl(var(--warning))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Data Availability Notice */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-warning" />
              Weekly Performance
            </CardTitle>
            <Badge variant="secondary">Monthly Data Only</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-80 text-center space-y-4">
            <div className="text-muted-foreground">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Weekly Data Not Available</h3>
              <p className="text-sm max-w-md">
                Your Excel template contains monthly data. To see weekly performance trends, 
                include weekly breakdown data in your Excel sheet.
              </p>
            </div>
            <Badge variant="outline" className="mt-4">
              Currently showing: Monthly aggregated data
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}