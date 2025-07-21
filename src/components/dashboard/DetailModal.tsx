import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Users, Calendar, MessageSquare, Star, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentScore: number;
  target: number;
  maxScore: number;
  trend: number;
  respondents?: number;
  type: 'nps' | 'jira' | 'project' | 'adhoc';
}

const mockDetailData = {
  nps: {
    breakdown: [
      { name: 'Promoters', value: 45, color: 'hsl(var(--success))' },
      { name: 'Passives', value: 35, color: 'hsl(var(--warning))' },
      { name: 'Detractors', value: 20, color: 'hsl(var(--destructive))' }
    ],
    comments: [
      { rating: 9, comment: "Excellent service, very satisfied!", date: "2024-01-15" },
      { rating: 8, comment: "Good experience overall", date: "2024-01-14" },
      { rating: 6, comment: "Could be better, needs improvement", date: "2024-01-13" }
    ],
    demographics: [
      { segment: 'New Users', score: 7.2, responses: 45 },
      { segment: 'Returning Users', score: 8.5, responses: 89 },
      { segment: 'Enterprise', score: 9.1, responses: 22 }
    ]
  },
  jira: {
    breakdown: [
      { name: 'Resolved', value: 65, color: 'hsl(var(--success))' },
      { name: 'In Progress', value: 25, color: 'hsl(var(--warning))' },
      { name: 'Unresolved', value: 10, color: 'hsl(var(--destructive))' }
    ],
    categories: [
      { category: 'Bug Reports', satisfaction: 4.1, count: 34 },
      { category: 'Feature Requests', satisfaction: 3.8, count: 28 },
      { category: 'Support Issues', satisfaction: 3.6, count: 27 }
    ]
  },
  project: {
    breakdown: [
      { name: 'Delivered On Time', value: 78, color: 'hsl(var(--success))' },
      { name: 'Delayed', value: 15, color: 'hsl(var(--warning))' },
      { name: 'Over Budget', value: 7, color: 'hsl(var(--destructive))' }
    ],
    phases: [
      { phase: 'Planning', satisfaction: 4.5, completion: 95 },
      { phase: 'Development', satisfaction: 4.2, completion: 82 },
      { phase: 'Testing', satisfaction: 3.9, completion: 88 },
      { phase: 'Deployment', satisfaction: 4.1, completion: 91 }
    ]
  },
  adhoc: {
    breakdown: [
      { name: 'Positive', value: 42, color: 'hsl(var(--success))' },
      { name: 'Neutral', value: 38, color: 'hsl(var(--warning))' },
      { name: 'Negative', value: 20, color: 'hsl(var(--destructive))' }
    ],
    channels: [
      { channel: 'Email', responses: 45, avgRating: 3.4 },
      { channel: 'Chat', responses: 32, avgRating: 3.1 },
      { channel: 'Phone', responses: 28, avgRating: 2.9 }
    ]
  }
};

export function DetailModal({ isOpen, onClose, title, currentScore, target, maxScore, trend, respondents, type }: DetailModalProps) {
  const data = mockDetailData[type];
  const isTargetMet = currentScore >= target;
  const percentage = (currentScore / maxScore) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {title} - Detailed Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{currentScore}</div>
                  <div className="text-sm text-muted-foreground">Current Score</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">{target}</div>
                  <div className="text-sm text-muted-foreground">Target</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className={cn("text-2xl font-bold flex items-center justify-center gap-1", trend >= 0 ? "text-success" : "text-destructive")}>
                    {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {trend >= 0 ? "+" : ""}{trend.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Trend</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{respondents || 0}</div>
                  <div className="text-sm text-muted-foreground">Responses</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Target</span>
                  <span className={cn(isTargetMet ? "text-success" : "text-muted-foreground")}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={percentage} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>Target: {target}</span>
                  <span>{maxScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.breakdown}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category/Segment Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {type === 'nps' ? 'User Segments' : 
                   type === 'jira' ? 'Categories' : 
                   type === 'project' ? 'Project Phases' : 'Feedback Channels'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={
                      type === 'nps' ? (data as any).demographics :
                      type === 'jira' ? (data as any).categories :
                      type === 'project' ? (data as any).phases :
                      (data as any).channels
                    }>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey={type === 'nps' ? 'segment' : 
                               type === 'jira' ? 'category' : 
                               type === 'project' ? 'phase' : 'channel'} 
                        className="text-xs"
                        tick={{ fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis className="text-xs" tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar 
                        dataKey={type === 'nps' ? 'score' : 
                               type === 'jira' ? 'satisfaction' : 
                               type === 'project' ? 'satisfaction' : 'avgRating'} 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Comments (for NPS) */}
          {type === 'nps' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Recent Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDetailData.nps.comments.map((comment, index) => (
                    <div key={index} className="border-l-4 border-primary/20 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={cn(
                                "h-3 w-3",
                                i < comment.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"
                              )} 
                            />
                          ))}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {comment.rating}/10
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {comment.date}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {isTargetMet ? (
                  <>
                    <div className="flex items-center gap-2 text-success">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm">Target achieved! Continue current strategies.</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Consider raising targets for next quarter.</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-warning">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="text-sm">Focus on improving low-performing areas.</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Increase engagement and follow-up processes.</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}