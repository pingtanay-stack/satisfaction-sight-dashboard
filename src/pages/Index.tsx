import { NPSGauge } from "@/components/dashboard/NPSGauge";
import { OverallTrafficLight } from "@/components/dashboard/OverallTrafficLight";
import { CompactMetricCard } from "@/components/dashboard/CompactMetricCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { DataUploadSection } from "@/components/dashboard/DataUploadSection";
import { DetailModal } from "@/components/dashboard/DetailModal";
import { AdvancedCharts } from "@/components/dashboard/AdvancedCharts";
import { BarChart3, TrendingUp, Ticket, FolderOpen, MessageSquare, Star, Sparkles, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

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
  const [selectedCard, setSelectedCard] = useState<{
    type: 'nps' | 'jira' | 'project' | 'adhoc';
    title: string;
    currentScore: number;
    target: number;
    maxScore: number;
    trend: number;
    respondents?: number;
  } | null>(null);
  const [focusedCard, setFocusedCard] = useState<string>('nps');
  const [showAdvancedCharts, setShowAdvancedCharts] = useState(false);

  const processUploadedData = (data: any[][]) => {
    // Skip header row and filter valid rows
    // Template structure: ['Month', 'NPS Score', 'NPS Respondents', 'Jira Score', 'Jira Respondents', 'Project Satisfaction Score', 'Project Respondents', 'Ad-hoc Score', 'Ad-hoc Respondents', 'NPS Comments']
    const dataRows = data.slice(1).filter(row => row.length >= 9 && row[0] && row[1] !== "");
    
    const newNpsData: { month: string; score: number }[] = [];
    const newJiraData: { month: string; score: number }[] = [];
    const newSatisfactionData: { month: string; score: number }[] = [];
    const newAdhocData: { month: string; score: number }[] = [];
    
    dataRows.forEach(row => {
      if (row[0] && row[1] !== undefined) {
        const month = row[0].toString();
        const npsScore = parseFloat(row[1]) || 0;
        const jiraScore = parseFloat(row[3]) || 0;
        const projectScore = parseFloat(row[5]) || 0;
        const adhocScore = parseFloat(row[7]) || 0;
        
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
    
    // Calculate total respondents from all months
    const npsRespondents = dataRows.reduce((sum, row) => sum + (parseInt(row[2]) || 0), 0);
    const jiraRespondents = dataRows.reduce((sum, row) => sum + (parseInt(row[4]) || 0), 0);
    const projectRespondents = dataRows.reduce((sum, row) => sum + (parseInt(row[6]) || 0), 0);
    const adhocRespondents = dataRows.reduce((sum, row) => sum + (parseInt(row[8]) || 0), 0);
    
    setMetrics({
      nps: { current: latestNps, target: 30, respondents: npsRespondents || defaultMetrics.nps.respondents },
      jira: { current: latestJira, target: 3.5, respondents: jiraRespondents || defaultMetrics.jira.respondents },
      project: { current: latestProject, target: 3.5, respondents: projectRespondents || defaultMetrics.project.respondents },
      adhoc: { current: latestAdhoc, target: 3.5, respondents: adhocRespondents || defaultMetrics.adhoc.respondents }
    });
    
    if (newNpsData.length > 0) setNpsData(newNpsData);
    if (newJiraData.length > 0) setJiraData(newJiraData);
    if (newSatisfactionData.length > 0) setSatisfactionData(newSatisfactionData);
    if (newAdhocData.length > 0) setAdhocData(newAdhocData);
  };

  // Dynamic rotation effect
  useEffect(() => {
    const cards = ['nps', 'jira', 'project', 'adhoc'];
    const interval = setInterval(() => {
      setFocusedCard(prev => {
        const currentIndex = cards.indexOf(prev);
        return cards[(currentIndex + 1) % cards.length];
      });
    }, 60000); // Change every 1 minute

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (type: 'nps' | 'jira' | 'project' | 'adhoc', title: string, currentScore: number, target: number, maxScore: number, trend: number, respondents?: number) => {
    setSelectedCard({ type, title, currentScore, target, maxScore, trend, respondents });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 via-background to-secondary-light/20">
      <div className="container mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Customer Satisfaction Dashboard
          </h1>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">Real-time insights</p>
            </div>
            <Badge 
              variant="outline" 
              className={`animate-pulse ${focusedCard === 'nps' ? 'border-primary text-primary' : ''}`}
            >
              <Eye className="h-3 w-3 mr-1" />
              Focus: {focusedCard.toUpperCase()}
            </Badge>
            <button
              onClick={() => setShowAdvancedCharts(!showAdvancedCharts)}
              className="text-xs px-3 py-1 bg-secondary/20 hover:bg-secondary/40 rounded-full transition-colors"
            >
              {showAdvancedCharts ? 'Simple View' : 'Advanced Analytics'}
            </button>
          </div>
        </div>

        {/* Main Dashboard Layout - Perfectly Aligned */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
          {/* Traffic Light - Left Aligned */}
          <div className="xl:col-span-3 flex items-center justify-center">
            <div className={`w-full max-w-xs transform transition-all duration-500 ${focusedCard === 'traffic' ? 'scale-110 ring-2 ring-primary/20' : 'scale-100'}`}>
              <OverallTrafficLight metrics={metrics} />
            </div>
          </div>
          
          {/* NPS Gauge - Center Aligned */}
          <div className="xl:col-span-3 flex items-center justify-center">
            <div className={`w-full max-w-xs transform transition-all duration-500 ${focusedCard === 'nps' ? 'scale-110 ring-2 ring-primary/20' : 'scale-105'}`}>
              <NPSGauge
                currentScore={metrics.nps.current}
                target={metrics.nps.target}
                trend={12.5}
                respondents={metrics.nps.respondents}
                className="animate-fade-in w-full"
                onClick={() => handleCardClick('nps', 'Net Promoter Score', metrics.nps.current, metrics.nps.target, 100, 12.5, metrics.nps.respondents)}
              />
            </div>
          </div>

          {/* Survey Metrics - Right Aligned */}
          <div className="xl:col-span-6 space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-1">Survey Metrics</h3>
              <p className="text-sm text-muted-foreground">Click cards for detailed insights</p>
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
                className={`transition-all duration-500 ${focusedCard === 'jira' ? 'ring-2 ring-primary/20 scale-105' : ''}`}
                onClick={() => handleCardClick('jira', 'Jira Tickets', metrics.jira.current, metrics.jira.target, 5, 5.6, metrics.jira.respondents)}
              />
              
              <CompactMetricCard
                title="Project Satisfaction"
                currentScore={metrics.project.current}
                target={metrics.project.target}
                maxScore={5}
                trend={16.7}
                respondents={metrics.project.respondents}
                icon={<FolderOpen className="h-4 w-4" />}
                className={`transition-all duration-500 ${focusedCard === 'project' ? 'ring-2 ring-primary/20 scale-105' : ''}`}
                onClick={() => handleCardClick('project', 'Project Satisfaction', metrics.project.current, metrics.project.target, 5, 16.7, metrics.project.respondents)}
              />
              
              <CompactMetricCard
                title="Ad-hoc Feedback"
                currentScore={metrics.adhoc.current}
                target={metrics.adhoc.target}
                maxScore={5}
                trend={-8.6}
                respondents={metrics.adhoc.respondents}
                icon={<MessageSquare className="h-4 w-4" />}
                className={`transition-all duration-500 ${focusedCard === 'adhoc' ? 'ring-2 ring-primary/20 scale-105' : ''}`}
                onClick={() => handleCardClick('adhoc', 'Ad-hoc Feedback', metrics.adhoc.current, metrics.adhoc.target, 5, -8.6, metrics.adhoc.respondents)}
              />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {showAdvancedCharts ? (
          <AdvancedCharts 
            npsData={npsData}
            satisfactionData={satisfactionData}
            jiraData={jiraData}
            adhocData={adhocData}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
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
          </>
        )}

        {/* Data Upload Section */}
        <DataUploadSection onDataUpdate={processUploadedData} />

        {/* Interactive Footer */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">Customer Satisfaction Analytics Platform</span>
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Dashboard auto-rotates focus every minute • Click cards for detailed insights
          </p>
        </div>

        {/* Detail Modal */}
        {selectedCard && (
          <DetailModal
            isOpen={!!selectedCard}
            onClose={() => setSelectedCard(null)}
            title={selectedCard.title}
            currentScore={selectedCard.currentScore}
            target={selectedCard.target}
            maxScore={selectedCard.maxScore}
            trend={selectedCard.trend}
            respondents={selectedCard.respondents}
            type={selectedCard.type}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
