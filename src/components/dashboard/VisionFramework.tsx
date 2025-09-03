import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Lightbulb, Shield, TrendingUp } from "lucide-react";
interface VisionFrameworkProps {
  className?: string;
}
export function VisionFramework({
  className
}: VisionFrameworkProps) {
  const pillars = [{
    title: "People",
    icon: Users,
    color: "bg-blue-500",
    description: "Customer Experience",
    metrics: ["NPS Score", "Customer Feedback"]
  }, {
    title: "Innovate",
    icon: Lightbulb,
    color: "bg-green-500",
    description: "Continuous Improvement",
    metrics: ["Project Satisfaction"]
  }, {
    title: "Protect",
    icon: Shield,
    color: "bg-orange-500",
    description: "Quality Assurance",
    metrics: ["Jira Tickets", "System Health"]
  }, {
    title: "Expand",
    icon: TrendingUp,
    color: "bg-purple-500",
    description: "Growth & Scale",
    metrics: ["Business Growth", "Market Reach"]
  }];
  return <Card className={`p-8 mb-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 ${className}`}>
      {/* House Structure */}
      <div className="relative max-w-4xl mx-auto">
        
        {/* Roof - Vision */}
        <div className="relative">
          <div className="w-0 h-0 border-l-[200px] border-r-[200px] border-b-[80px] border-l-transparent border-r-transparent border-b-primary/20 mx-auto"></div>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center z-10">
            <h1 className="text-2xl font-bold text-primary mb-1">Our Vision</h1>
            <p className="text-sm text-muted-foreground">Excellence Through Strategic Focus</p>
          </div>
        </div>

        {/* House Body */}
        <div className="bg-gradient-to-b from-background to-secondary/5 border-2 border-primary/20 rounded-b-lg relative">
          
          {/* Core Values - Second Floor */}
          <div className="text-center py-6 border-b border-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-4">Core Values</h2>
            <div className="flex justify-center gap-3 flex-wrap">
              <Badge variant="secondary" className="px-3 py-1 text-xs">Driving Innovation</Badge>
              <Badge variant="secondary" className="px-3 py-1 text-xs">Developing Trusted Relationship</Badge>
              <Badge variant="secondary" className="px-3 py-1 text-xs">Building Customer Confidence</Badge>
              <Badge variant="secondary" className="px-3 py-1 text-xs">Upholding Ethical Standards</Badge>
            </div>
          </div>

          {/* Four Pillars - Main Floor */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {pillars.map(pillar => <div key={pillar.title} className="text-center group bg-background/50 rounded-lg p-4 border border-border/30 hover:border-primary/30 transition-all duration-200">
                <div className="mb-3">
                  <div className={`w-12 h-12 rounded-full ${pillar.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform duration-200 shadow-lg`}>
                    <pillar.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{pillar.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{pillar.description}</p>
                </div>
                
                <div className="space-y-1">
                  {pillar.metrics.map(metric => {})}
                </div>
              </div>)}
          </div>

          {/* Foundation - Key Focus Areas */}
          <div className="text-center py-4 bg-secondary/10 rounded-b-lg border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Foundation:</strong> Customer Satisfaction • Innovation Excellence • Quality Protection • Strategic Growth
            </p>
          </div>

          {/* House Details */}
          <div className="absolute top-1/2 left-4 w-6 h-8 bg-primary/30 rounded border border-primary/40"></div>
          <div className="absolute top-1/2 right-4 w-6 h-8 bg-primary/30 rounded border border-primary/40"></div>
        </div>
      </div>
    </Card>;
}