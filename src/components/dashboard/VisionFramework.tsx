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
        <div className="relative mb-0">
          <div className="w-0 h-0 border-l-[300px] border-r-[300px] border-b-[120px] border-l-transparent border-r-transparent border-b-primary/30 mx-auto"></div>
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-10">
            <h1 className="text-2xl font-bold text-primary mb-1">Our Vision</h1>
          </div>
          {/* Roof ridge line */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-primary/40"></div>
        </div>

        {/* House Body */}
        <div className="bg-gradient-to-b from-background to-secondary/5 border-2 border-primary/20 rounded-none relative" style={{marginTop: '-2px'}}>
          
          {/* Core Values - Second Floor */}
          <div className="text-center py-6 border-b border-border/50 bg-secondary/5">
            <h2 className="text-lg font-semibold text-foreground mb-4">Core Values</h2>
            <div className="flex justify-center gap-3 flex-wrap">
              <Badge variant="secondary" className="px-3 py-1 text-xs">Driving Innovation</Badge>
              <Badge variant="secondary" className="px-3 py-1 text-xs">Ignite purpose in our work</Badge>
              <Badge variant="secondary" className="px-3 py-1 text-xs">Developing Trusted Relationship</Badge>
              <Badge variant="secondary" className="px-3 py-1 text-xs">Building Customer Confidence</Badge>
              <Badge variant="secondary" className="px-3 py-1 text-xs">Upholding Ethical Standards</Badge>
            </div>
          </div>

          {/* Four Pillars - Main Floor */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-background/80">
            {pillars.map(pillar => <div key={pillar.title} className="text-center group bg-background/70 rounded-lg p-4 border border-border/30 hover:border-primary/30 transition-all duration-200 shadow-sm">
                <div className="mb-3">
                  <div className={`w-12 h-12 rounded-full ${pillar.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform duration-200 shadow-lg`}>
                    <pillar.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{pillar.title}</h3>
                  <p className="text-xs text-muted-foreground">{pillar.description}</p>
                </div>
              </div>)}
          </div>

          {/* Windows */}
          <div className="absolute top-1/2 left-4 w-6 h-8 bg-primary/20 rounded border border-primary/30 shadow-inner"></div>
          <div className="absolute top-1/2 right-4 w-6 h-8 bg-primary/20 rounded border border-primary/30 shadow-inner"></div>
          
          {/* Door */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-12 bg-primary/25 rounded-t border-t border-l border-r border-primary/40"></div>
        </div>

        {/* Foundation */}
        <div className="text-center py-4 bg-secondary/20 border-2 border-t-0 border-primary/20 rounded-b-lg">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Foundation:</strong> Customer Satisfaction • Innovation Excellence • Quality Protection • Strategic Growth
          </p>
        </div>
      </div>
    </Card>;
}