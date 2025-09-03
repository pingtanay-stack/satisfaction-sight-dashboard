import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Lightbulb, Shield, TrendingUp } from "lucide-react";

interface VisionFrameworkProps {
  className?: string;
}

export function VisionFramework({ className }: VisionFrameworkProps) {
  const pillars = [
    {
      title: "People",
      icon: Users,
      color: "bg-blue-500",
      description: "Customer Experience",
      metrics: ["NPS Score", "Customer Feedback"]
    },
    {
      title: "Innovate",
      icon: Lightbulb,
      color: "bg-green-500",
      description: "Continuous Improvement",
      metrics: ["Project Satisfaction"]
    },
    {
      title: "Protect",
      icon: Shield,
      color: "bg-orange-500", 
      description: "Quality Assurance",
      metrics: ["Jira Tickets", "System Health"]
    },
    {
      title: "Expand",
      icon: TrendingUp,
      color: "bg-purple-500",
      description: "Growth & Scale",
      metrics: ["Business Growth", "Market Reach"]
    }
  ];

  return (
    <Card className={`p-8 mb-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 ${className}`}>
      {/* Vision Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Our Vision</h1>
        <p className="text-lg text-muted-foreground">Driving Excellence Through Strategic Focus</p>
      </div>

      {/* Core Values */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Core Values</h2>
        <div className="flex justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="px-4 py-2">Excellence</Badge>
          <Badge variant="secondary" className="px-4 py-2">Innovation</Badge>
          <Badge variant="secondary" className="px-4 py-2">Integrity</Badge>
          <Badge variant="secondary" className="px-4 py-2">Collaboration</Badge>
        </div>
      </div>

      {/* Four Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="text-center group">
            <div className="mb-4">
              <div className={`w-16 h-16 rounded-full ${pillar.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <pillar.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{pillar.description}</p>
            </div>
            
            <div className="space-y-1">
              {pillar.metrics.map((metric) => (
                <div key={metric} className="text-xs bg-secondary/50 rounded px-2 py-1">
                  {metric}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Key Focus Areas Footer */}
      <div className="text-center mt-8 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground">
          <strong>Key Focus Areas:</strong> Customer Satisfaction • Innovation Excellence • Quality Protection • Strategic Growth
        </p>
      </div>
    </Card>
  );
}