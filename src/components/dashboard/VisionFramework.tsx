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
      
    </Card>;
}