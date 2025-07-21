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

const radarData = [
  { metric: 'NPS', score: 45, fullMark: 100 },
  { metric: 'Jira', score: 76, fullMark: 100 },
  { metric: 'Projects', score: 84, fullMark: 100 },
  { metric: 'Ad-hoc', score: 64, fullMark: 100 },
  { metric: 'Support', score: 72, fullMark: 100 },
  { metric: 'Quality', score: 88, fullMark: 100 }
];

const correlationData = [
  { nps: 25, satisfaction: 3.1, month: 'Jan' },
  { nps: 32, satisfaction: 3.3, month: 'Feb' },
  { nps: 38, satisfaction: 3.6, month: 'Mar' },
  { nps: 42, satisfaction: 3.8, month: 'Apr' },
  { nps: 45, satisfaction: 3.9, month: 'May' },
  { nps: 48, satisfaction: 4.2, month: 'Jun' }
];

const weeklyTrendData = [
  { week: 'W1', nps: 42, jira: 3.6, project: 4.0, adhoc: 3.1 },
  { week: 'W2', nps: 44, jira: 3.7, project: 4.1, adhoc: 3.2 },
  { week: 'W3', nps: 43, jira: 3.8, project: 4.2, adhoc: 3.0 },
  { week: 'W4', nps: 47, jira: 3.9, project: 4.3, adhoc: 3.3 }
];

export function AdvancedCharts({ npsData, satisfactionData, jiraData, adhocData }: AdvancedChartsProps) {
  // Combine all data for comprehensive analysis
  const combinedData = npsData.map((item, index) => ({
    month: item.month,
    nps: item.score,
    satisfaction: satisfactionData[index]?.score || 0,
    jira: jiraData[index]?.score || 0,
    adhoc: adhocData[index]?.score || 0
  }));

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
              <RadarChart data={radarData}>
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
            <Badge variant="outline">R² = 0.89</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={correlationData}>
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

      {/* Weekly Performance */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-warning" />
              Weekly Performance
            </CardTitle>
            <Badge variant="outline">Last 4 Weeks</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="nps" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                <Bar dataKey="jira" fill="hsl(var(--secondary))" radius={[2, 2, 0, 0]} />
                <Bar dataKey="project" fill="hsl(var(--success))" radius={[2, 2, 0, 0]} />
                <Bar dataKey="adhoc" fill="hsl(var(--warning))" radius={[2, 2, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}