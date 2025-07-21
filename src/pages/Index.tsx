import { NPSGauge } from "@/components/dashboard/NPSGauge";
import { OverallTrafficLight } from "@/components/dashboard/OverallTrafficLight";
import { CompactMetricCard } from "@/components/dashboard/CompactMetricCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { DataUploadSection } from "@/components/dashboard/DataUploadSection";
import { BarChart3, TrendingUp, Ticket, FolderOpen, MessageSquare, Star, Sparkles } from "lucide-react";
import { useState } from "react";

// Default mock data
const defaultMetrics = {
  nps: { current: 45, target: 30, respondents: 156 },
  jira: { current: 3.8, target: 3.5, respondents: 89 },
  project: { current: 4.2, target: 3.5, respondents: 45 },
  adhoc: { current: 3.2, target: 3.5, respondents: 23 }
};

const defaultNpsData = [
  { month: "Jan", score: 25 },
  { month: "Feb", score: 32 },
  { month: "Mar", score: 38 },
  { month: "Apr", score: 42 },
  { month: "May", score: 45 },
  { month: "Jun", score: 48 }
];

const defaultSatisfactionData = [
  { month: "Jan", score: 3.1 },
  { month: "Feb", score: 3.3 },
  { month: "Mar", score: 3.6 },
  { month: "Apr", score: 3.8 },
  { month: "May", score: 3.9 },
  { month: "Jun", score: 4.2 }
];

const defaultJiraData = [
  { month: "Jan", score: 3.2 },
  { month: "Feb", score: 3.4 },
  { month: "Mar", score: 3.6 },
  { month: "Apr", score: 3.7 },
  { month: "May", score: 3.8 },
  { month: "Jun", score: 3.8 }
];

const defaultAdhocData = [
  { month: "Jan", score: 3.5 },
  { month: "Feb", score: 3.3 },
  { month: "Mar", score: 3.1 },
  { month: "Apr", score: 3.0 },
  { month: "May", score: 3.1 },
  { month: "Jun", score: 3.2 }
];

const Index = () => {
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [npsData, setNpsData] = useState(defaultNpsData);
  const [satisfactionData, setSatisfactionData] = useState(defaultSatisfactionData);
  const [jiraData, setJiraData] = useState(defaultJiraData);
  const [adhocData, setAdhocData] = useState(defaultAdhocData);

  const processUploadedData = (data: any[][]) => {
    // Skip header row
    const dataRows = data.slice(1).filter(row => row.length >= 8 && row[0] && row[1] !== "");
    
    const newNpsData: { month: string; score: number }[] = [];
    const newJiraData: { month: string; score: number }[] = [];
    const newSatisfactionData: { month: string; score: number }[] = [];
    const newAdhocData: { month: string; score: number }[] = [];
    
    dataRows.forEach(row => {
      if (row[0] && row[1] !== undefined) {
        const month = row[0].toString();
        const npsScore = parseFloat(row[1]) || 0;
        const jiraScore = parseFloat(row[2]) || 0;
        const projectScore = parseFloat(row[3]) || 0;
        const adhocScore = parseFloat(row[4]) || 0;
        
        if (npsScore > 0) newNpsData.push({ month, score: npsScore });
        if (jiraScore > 0) newJiraData.push({ month, score: jiraScore });
        if (projectScore > 0) newSatisfactionData.push({ month, score: projectScore });
        if (adhocScore > 0) newAdhocData.push({ month, score: adhocScore });
      }
    });
    
    // Update current metrics with latest values and respondents
    const latestNps = newNpsData.length > 0 ? newNpsData[newNpsData.length - 1].score : defaultMetrics.nps.current;
    const latestJira = newJiraData.length > 0 ? newJiraData[newJiraData.length - 1].score : defaultMetrics.jira.current;
    const latestProject = newSatisfactionData.length > 0 ? newSatisfactionData[newSatisfactionData.length - 1].score : defaultMetrics.project.current;
    const latestAdhoc = newAdhocData.length > 0 ? newAdhocData[newAdhocData.length - 1].score : defaultMetrics.adhoc.current;
    
    // Extract respondents from last row if available
    const lastRow = dataRows[dataRows.length - 1];
    const npsRespondents = lastRow && lastRow[5] ? parseInt(lastRow[5]) : defaultMetrics.nps.respondents;
    const jiraRespondents = lastRow && lastRow[6] ? parseInt(lastRow[6]) : defaultMetrics.jira.respondents;
    const projectRespondents = lastRow && lastRow[7] ? parseInt(lastRow[7]) : defaultMetrics.project.respondents;
    const adhocRespondents = lastRow && lastRow[8] ? parseInt(lastRow[8]) : defaultMetrics.adhoc.respondents;
    
    setMetrics({
      nps: { current: latestNps, target: 30, respondents: npsRespondents },
      jira: { current: latestJira, target: 3.5, respondents: jiraRespondents },
      project: { current: latestProject, target: 3.5, respondents: projectRespondents },
      adhoc: { current: latestAdhoc, target: 3.5, respondents: adhocRespondents }
    });
    
    if (newNpsData.length > 0) setNpsData(newNpsData);
    if (newJiraData.length > 0) setJiraData(newJiraData);
    if (newSatisfactionData.length > 0) setSatisfactionData(newSatisfactionData);
    if (newAdhocData.length > 0) setAdhocData(newAdhocData);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 via-background to-secondary-light/20">
      <div className="container mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Customer Satisfaction
          </h1>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-sm text-muted-foreground">Real-time insights</p>
          </div>
        </div>

        {/* Main Dashboard Layout - Traffic Light & NPS Side by Side */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Left Side - Traffic Light & NPS */}
          <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Traffic Light - Much Bigger */}
            <div className="flex items-start justify-center">
              <div className="w-full max-w-lg transform scale-110">
                <OverallTrafficLight metrics={metrics} />
              </div>
            </div>
            
            {/* NPS Gauge - Bigger to match right side height */}
            <div className="flex items-start justify-center">
              <div className="w-full max-w-lg">
                <NPSGauge
                  currentScore={metrics.nps.current}
                  target={metrics.nps.target}
                  trend={12.5}
                  respondents={metrics.nps.respondents}
                  className="animate-fade-in w-full transform scale-105"
                />
              </div>
            </div>
          </div>

          {/* Right Side - All Other Surveys */}
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-1">Survey Metrics</h3>
              <p className="text-sm text-muted-foreground">Performance across all channels</p>
            </div>
            
            <div className="space-y-4">
              <CompactMetricCard
                title="Jira Tickets"
                currentScore={metrics.jira.current}
                target={metrics.jira.target}
                maxScore={5}
                trend={5.6}
                respondents={metrics.jira.respondents}
                icon={<Ticket className="h-4 w-4" />}
              />
              
              <CompactMetricCard
                title="Project Satisfaction"
                currentScore={metrics.project.current}
                target={metrics.project.target}
                maxScore={5}
                trend={16.7}
                respondents={metrics.project.respondents}
                icon={<FolderOpen className="h-4 w-4" />}
              />
              
              <CompactMetricCard
                title="Ad-hoc Feedback"
                currentScore={metrics.adhoc.current}
                target={metrics.adhoc.target}
                maxScore={5}
                trend={-8.6}
                respondents={metrics.adhoc.respondents}
                icon={<MessageSquare className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>

        {/* Charts Section - Compact Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <TrendChart
            title="Net Promoter Score Trend"
            data={npsData}
            target={30}
            maxScore={100}
          />
          
          <TrendChart
            title="Project Satisfaction Trend"
            data={satisfactionData}
            target={3.5}
            maxScore={5}
          />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
        <DataUploadSection onDataUpdate={processUploadedData} />

        {/* Interactive Footer */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">Customer Satisfaction Analytics Platform</span>
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
