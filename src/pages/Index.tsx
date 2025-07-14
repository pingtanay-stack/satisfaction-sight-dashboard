import { MetricCard } from "@/components/dashboard/MetricCard";
import { TrafficLightIndicator } from "@/components/dashboard/TrafficLightIndicator";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { DataUploadSection } from "@/components/dashboard/DataUploadSection";
import { BarChart3, TrendingUp } from "lucide-react";

// Mock data for demonstration
const mockMetrics = {
  nps: { current: 45, target: 30 },
  jira: { current: 3.8, target: 3.5 },
  project: { current: 4.2, target: 3.5 },
  adhoc: { current: 3.2, target: 3.5 }
};

const npsData = [
  { month: "Jan", score: 25 },
  { month: "Feb", score: 32 },
  { month: "Mar", score: 38 },
  { month: "Apr", score: 42 },
  { month: "May", score: 45 },
  { month: "Jun", score: 48 }
];

const satisfactionData = [
  { month: "Jan", score: 3.1 },
  { month: "Feb", score: 3.3 },
  { month: "Mar", score: 3.6 },
  { month: "Apr", score: 3.8 },
  { month: "May", score: 3.9 },
  { month: "Jun", score: 4.2 }
];

const jiraData = [
  { month: "Jan", score: 3.2 },
  { month: "Feb", score: 3.4 },
  { month: "Mar", score: 3.6 },
  { month: "Apr", score: 3.7 },
  { month: "May", score: 3.8 },
  { month: "Jun", score: 3.8 }
];

const adhocData = [
  { month: "Jan", score: 3.5 },
  { month: "Feb", score: 3.3 },
  { month: "Mar", score: 3.1 },
  { month: "Apr", score: 3.0 },
  { month: "May", score: 3.1 },
  { month: "Jun", score: 3.2 }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 via-background to-secondary-light/20">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Customer Satisfaction Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track and monitor customer satisfaction metrics with real-time insights
          </p>
        </div>

        {/* Traffic Light Indicator */}
        <TrafficLightIndicator metrics={mockMetrics} />

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Net Promoter Score (NPS)"
            currentScore={mockMetrics.nps.current}
            target={mockMetrics.nps.target}
            maxScore={100}
            trend={12.5}
            className="animate-fade-in"
          />
          
          <MetricCard
            title="Jira Ticket Satisfaction"
            currentScore={mockMetrics.jira.current}
            target={mockMetrics.jira.target}
            maxScore={5}
            trend={5.6}
            className="animate-fade-in"
          />
          
          <MetricCard
            title="Project Satisfaction"
            currentScore={mockMetrics.project.current}
            target={mockMetrics.project.target}
            maxScore={5}
            trend={16.7}
            className="animate-fade-in"
          />
          
          <MetricCard
            title="Ad-hoc Feedback"
            currentScore={mockMetrics.adhoc.current}
            target={mockMetrics.adhoc.target}
            maxScore={5}
            trend={-8.6}
            className="animate-fade-in"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendChart
            title="Net Promoter Score"
            data={npsData}
            target={30}
            maxScore={100}
          />
          
          <TrendChart
            title="Project Satisfaction"
            data={satisfactionData}
            target={3.5}
            maxScore={5}
          />
          
          <TrendChart
            title="Jira Ticket Satisfaction"
            data={jiraData}
            target={3.5}
            maxScore={5}
          />
          
          <TrendChart
            title="Ad-hoc Customer Feedback"
            data={adhocData}
            target={3.5}
            maxScore={5}
          />
        </div>

        {/* Data Upload Section */}
        <DataUploadSection />

        {/* Footer */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm">Customer Satisfaction Analytics Platform</span>
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
