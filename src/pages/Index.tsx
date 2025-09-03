import { NPSGauge } from "@/components/dashboard/NPSGauge";
import { OverallTrafficLight } from "@/components/dashboard/OverallTrafficLight";
import { CompactMetricCard } from "@/components/dashboard/CompactMetricCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { DataUploadSection } from "@/components/dashboard/DataUploadSection";
import { DetailModal } from "@/components/dashboard/DetailModal";
import { AdvancedCharts } from "@/components/dashboard/AdvancedCharts";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VisionFramework } from "@/components/dashboard/VisionFramework";
import { BarChart3, TrendingUp, Ticket, FolderOpen, MessageSquare, Star, Sparkles, RotateCcw, LogOut, Building } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { 
  saveDashboardDataToSupabase, 
  loadDashboardDataFromSupabase, 
  clearDashboardDataFromSupabase, 
  hasSavedDataInSupabase,
  type DashboardData 
} from "@/lib/supabaseStorage";

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Default data structure
  const defaultData: DashboardData = {
    metrics: defaultMetrics,
    npsData: defaultNpsData,
    satisfactionData: defaultSatisfactionData,
    jiraData: defaultJiraData,
    adhocData: defaultAdhocData,
  };

  const [metrics, setMetrics] = useState(defaultData.metrics);
  const [npsData, setNpsData] = useState(defaultData.npsData);
  const [satisfactionData, setSatisfactionData] = useState(defaultData.satisfactionData);
  const [jiraData, setJiraData] = useState(defaultData.jiraData);
  const [adhocData, setAdhocData] = useState(defaultData.adhocData);
  const [hasUploadedData, setHasUploadedData] = useState(false);
  const [selectedCard, setSelectedCard] = useState<{
    type: 'nps' | 'jira' | 'project' | 'adhoc';
    title: string;
    currentScore: number;
    target: number;
    maxScore: number;
    trend: number;
    respondents?: number;
  } | null>(null);
  const [showAdvancedCharts, setShowAdvancedCharts] = useState(false);
  const [showVisionMode, setShowVisionMode] = useState(false);

  // Authentication effect
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // User logged in, load their data
          setTimeout(() => {
            loadUserData();
          }, 0);
        } else {
          // User logged out, redirect to auth
          navigate('/auth');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserData();
      } else {
        navigate('/auth');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load user data from Supabase
  const loadUserData = async () => {
    try {
      const userData = await loadDashboardDataFromSupabase(defaultData);
      const hasData = await hasSavedDataInSupabase();
      
      setMetrics(userData.metrics);
      setNpsData(userData.npsData);
      setSatisfactionData(userData.satisfactionData);
      setJiraData(userData.jiraData);
      setAdhocData(userData.adhocData);
      setHasUploadedData(hasData);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error loading data",
        description: "Using default values. Your data will be saved when you upload new data.",
        variant: "destructive",
      });
    }
  };

  // Save data to Supabase
  const saveUserData = async (data: DashboardData) => {
    try {
      await saveDashboardDataToSupabase(data);
      toast({
        title: "Data saved",
        description: "Your dashboard data has been saved to the cloud.",
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error saving data", 
        description: "There was a problem saving your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const processUploadedData = (data: any[][]) => {
    console.log("processUploadedData called with:", data);
    // Skip header row and filter valid rows
    // Template structure: ['Month', 'NPS Score', 'NPS Respondents', 'Jira Score', 'Jira Respondents', 'Project Satisfaction Score', 'Project Respondents', 'Ad-hoc Score', 'Ad-hoc Respondents', 'NPS Comments']
    const dataRows = data.slice(1).filter(row => row.length >= 8 && row[0] && row[1] !== "");
    console.log("Filtered data rows:", dataRows);
    
    const newNpsData: { month: string; score: number }[] = [];
    const newJiraData: { month: string; score: number }[] = [];
    const newSatisfactionData: { month: string; score: number }[] = [];
    const newAdhocData: { month: string; score: number }[] = [];
    
    dataRows.forEach(row => {
      if (row[0] && row[1] !== undefined && row[1] !== '') {
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
    
    const newMetrics = {
      nps: { current: latestNps, target: 30, respondents: npsRespondents || defaultMetrics.nps.respondents },
      jira: { current: latestJira, target: 3.5, respondents: jiraRespondents || defaultMetrics.jira.respondents },
      project: { current: latestProject, target: 3.5, respondents: projectRespondents || defaultMetrics.project.respondents },
      adhoc: { current: latestAdhoc, target: 3.5, respondents: adhocRespondents || defaultMetrics.adhoc.respondents }
    };
    
    console.log("Updating metrics to:", newMetrics);
    setMetrics(newMetrics);
    
    if (newNpsData.length > 0) setNpsData(newNpsData);
    if (newJiraData.length > 0) setJiraData(newJiraData);
    if (newSatisfactionData.length > 0) setSatisfactionData(newSatisfactionData);
    if (newAdhocData.length > 0) setAdhocData(newAdhocData);

    // Save all data to Supabase
    const dataToSave: DashboardData = {
      metrics: newMetrics,
      npsData: newNpsData.length > 0 ? newNpsData : npsData,
      jiraData: newJiraData.length > 0 ? newJiraData : jiraData,
      satisfactionData: newSatisfactionData.length > 0 ? newSatisfactionData : satisfactionData,
      adhocData: newAdhocData.length > 0 ? newAdhocData : adhocData,
    };

    saveUserData(dataToSave);
    setHasUploadedData(true);
    console.log("Dashboard data saved to Supabase");
  };


  const handleCardClick = (type: 'nps' | 'jira' | 'project' | 'adhoc', title: string, currentScore: number, target: number, maxScore: number, trend: number, respondents?: number) => {
    setSelectedCard({ type, title, currentScore, target, maxScore, trend, respondents });
  };

  const handleResetData = async () => {
    try {
      await clearDashboardDataFromSupabase();
      setMetrics(defaultMetrics);
      setNpsData(defaultNpsData);
      setSatisfactionData(defaultSatisfactionData);
      setJiraData(defaultJiraData);
      setAdhocData(defaultAdhocData);
      setHasUploadedData(false);
      toast({
        title: "Data reset",
        description: "Dashboard has been reset to default values.",
      });
      console.log("Dashboard data reset to defaults");
    } catch (error) {
      console.error('Error resetting data:', error);
      toast({
        title: "Error resetting data",
        description: "There was a problem resetting your data.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out.",
        variant: "destructive",
      });
    }
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light/20 via-background to-secondary-light/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <BarChart3 className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header with Traffic Light */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Customer Satisfaction Dashboard
            </h1>
            <div className="flex-1 flex justify-end">
              <div className="w-fit">
                <OverallTrafficLight metrics={metrics} variant="horizontal" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">Real-time insights</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant={showVisionMode ? "default" : "outline"}
                size="sm"
                onClick={() => setShowVisionMode(!showVisionMode)}
                className="text-xs px-3 py-2 h-auto"
              >
                <Building className="h-3 w-3 mr-1" />
                Vision Mode
              </Button>
              <button
                onClick={() => setShowAdvancedCharts(!showAdvancedCharts)}
                className="text-xs px-3 py-2 bg-secondary/20 hover:bg-secondary/40 rounded-full transition-colors"
              >
                {showAdvancedCharts ? 'Simple View' : 'Advanced Analytics'}
              </button>
              {hasUploadedData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetData}
                  className="text-xs px-3 py-2 h-auto"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset to Defaults
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-xs px-3 py-2 h-auto"
              >
                <LogOut className="h-3 w-3 mr-1" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Vision Framework */}
        {showVisionMode && (
          <VisionFramework className="animate-fade-in" />
        )}

        {/* Main Dashboard Layout */}
        <div className={`grid gap-6 mb-8 transition-all duration-300 ${
          showVisionMode 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
            : 'grid-cols-1 xl:grid-cols-12'
        }`}>
          {showVisionMode ? (
            // Vision Mode Layout - Organized by Pillars
            <>
              {/* People Pillar */}
              <div className="space-y-4">
                <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300">People</h3>
                </div>
                <NPSGauge
                  currentScore={metrics.nps.current}
                  target={metrics.nps.target}
                  trend={12.5}
                  respondents={metrics.nps.respondents}
                  className="w-full h-48"
                  onClick={() => handleCardClick('nps', 'Net Promoter Score', metrics.nps.current, metrics.nps.target, 100, 12.5, metrics.nps.respondents)}
                />
              </div>

              {/* Innovate Pillar */}
              <div className="space-y-4">
                <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <h3 className="font-semibold text-green-700 dark:text-green-300">Innovate</h3>
                </div>
                <CompactMetricCard
                  title="Project Satisfaction"
                  currentScore={metrics.project.current}
                  target={metrics.project.target}
                  maxScore={5}
                  trend={16.7}
                  respondents={metrics.project.respondents}
                  icon={<FolderOpen className="h-4 w-4" />}
                  onClick={() => handleCardClick('project', 'Project Satisfaction', metrics.project.current, metrics.project.target, 5, 16.7, metrics.project.respondents)}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                />
              </div>

              {/* Protect Pillar */}
              <div className="space-y-4">
                <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <h3 className="font-semibold text-orange-700 dark:text-orange-300">Protect</h3>
                </div>
                <CompactMetricCard
                  title="Jira Tickets"
                  currentScore={metrics.jira.current}
                  target={metrics.jira.target}
                  maxScore={5}
                  trend={5.6}
                  respondents={metrics.jira.respondents}
                  icon={<Ticket className="h-4 w-4" />}
                  onClick={() => handleCardClick('jira', 'Jira Tickets', metrics.jira.current, metrics.jira.target, 5, 5.6, metrics.jira.respondents)}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                />
              </div>

              {/* Expand Pillar */}
              <div className="space-y-4">
                <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <h3 className="font-semibold text-purple-700 dark:text-purple-300">Expand</h3>
                </div>
                <CompactMetricCard
                  title="Ad-hoc Feedback"
                  currentScore={metrics.adhoc.current}
                  target={metrics.adhoc.target}
                  maxScore={5}
                  trend={-8.6}
                  respondents={metrics.adhoc.respondents}
                  icon={<MessageSquare className="h-4 w-4" />}
                  onClick={() => handleCardClick('adhoc', 'Ad-hoc Feedback', metrics.adhoc.current, metrics.adhoc.target, 5, -8.6, metrics.adhoc.respondents)}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                />
              </div>
            </>
          ) : (
            // Normal Layout
            <>
              {/* NPS Gauge - Aligned with metrics */}
              <div className="xl:col-span-6 flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-1">Net Promoter Score</h3>
                  <p className="text-sm text-muted-foreground">Click for detailed insights</p>
                </div>
                
                <div className="flex-1 flex items-stretch">
                  <NPSGauge
                    currentScore={metrics.nps.current}
                    target={metrics.nps.target}
                    trend={12.5}
                    respondents={metrics.nps.respondents}
                    className="w-full h-full flex-1"
                    onClick={() => handleCardClick('nps', 'Net Promoter Score', metrics.nps.current, metrics.nps.target, 100, 12.5, metrics.nps.respondents)}
                  />
                </div>
              </div>

              {/* Survey Metrics */}
              <div className="xl:col-span-6 flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-1">Survey Metrics</h3>
                  <p className="text-sm text-muted-foreground">Click cards for detailed insights</p>
                </div>
                
                <div className="flex-1 grid grid-rows-3 gap-4">
                  <CompactMetricCard
                    title="Jira Tickets"
                    currentScore={metrics.jira.current}
                    target={metrics.jira.target}
                    maxScore={5}
                    trend={5.6}
                    respondents={metrics.jira.respondents}
                    icon={<Ticket className="h-4 w-4" />}
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
                    onClick={() => handleCardClick('adhoc', 'Ad-hoc Feedback', metrics.adhoc.current, metrics.adhoc.target, 5, -8.6, metrics.adhoc.respondents)}
                  />
                </div>
              </div>
            </>
          )}
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
