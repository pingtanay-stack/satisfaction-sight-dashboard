import { NPSGauge } from "@/components/dashboard/NPSGauge";
import { OverallTrafficLight } from "@/components/dashboard/OverallTrafficLight";
import { CompactMetricCard } from "@/components/dashboard/CompactMetricCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { DataUploadSection } from "@/components/dashboard/DataUploadSection";
import { DetailModal } from "@/components/dashboard/DetailModal";
import { AdvancedCharts } from "@/components/dashboard/AdvancedCharts";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VisionFramework } from "@/components/dashboard/VisionFramework";
import { BarChart3, TrendingUp, Ticket, FolderOpen, MessageSquare, Star, Sparkles, RotateCcw, LogOut, Building, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEngagement } from "@/hooks/useEngagement";
import { NotificationQueue } from "@/components/ui/notification-queue";
import { InsightsSection } from "@/components/ui/insight-card";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { 
  saveDashboardDataToSupabase, 
  loadDashboardDataFromSupabase, 
  clearDashboardDataFromSupabase, 
  hasSavedDataInSupabase,
  type DashboardData 
} from "@/lib/supabaseStorage";
import { calculateTrend, getDataSource } from "@/utils/dataHelpers";
import { DataSourceBadge } from "@/components/ui/data-source-badge";

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
  const [lastUploadDate, setLastUploadDate] = useState<Date | null>(null);
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

  // Initialize engagement system
  const {
    achievements,
    insights,
    alerts,
    performanceScore,
    showAchievementNotification,
    updateEngagement,
    dismissAchievementNotification,
    dismissAlert,
    dismissInsight,
    handleAlertAction,
    handleInsightAction
  } = useEngagement();

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

  // Convert metrics to engagement format and update with calculated trends
  const updateEngagementData = (metricsData: typeof metrics) => {
    // Calculate real trends from historical data
    const npsTrend = calculateTrend(npsData);
    const jiraTrend = calculateTrend(jiraData);
    const projectTrend = calculateTrend(satisfactionData);
    const adhocTrend = calculateTrend(adhocData);
    
    // Get data source info
    const npsSource = getDataSource(hasUploadedData, metricsData.nps.current, defaultMetrics.nps.current);
    const jiraSource = getDataSource(hasUploadedData, metricsData.jira.current, defaultMetrics.jira.current);
    const projectSource = getDataSource(hasUploadedData, metricsData.project.current, defaultMetrics.project.current);
    const adhocSource = getDataSource(hasUploadedData, metricsData.adhoc.current, defaultMetrics.adhoc.current);
    
    const engagementMetrics = [
      {
        title: "Net Promoter Score",
        currentScore: metricsData.nps.current,
        target: metricsData.nps.target,
        maxScore: 100,
        trend: npsTrend,
        metricType: "nps",
        isRealData: npsSource.isReal
      },
      {
        title: "Jira Tickets",
        currentScore: metricsData.jira.current,
        target: metricsData.jira.target,
        maxScore: 5,
        trend: jiraTrend,
        metricType: "jira",
        isRealData: jiraSource.isReal
      },
      {
        title: "Project Satisfaction",
        currentScore: metricsData.project.current,
        target: metricsData.project.target,
        maxScore: 5,
        trend: projectTrend,
        metricType: "satisfaction",
        isRealData: projectSource.isReal
      },
      {
        title: "Ad-hoc Feedback",
        currentScore: metricsData.adhoc.current,
        target: metricsData.adhoc.target,
        maxScore: 5,
        trend: adhocTrend,
        metricType: "adhoc",
        isRealData: adhocSource.isReal
      }
    ];
    updateEngagement(engagementMetrics);
  };

  // Update engagement when component loads
  useEffect(() => {
    if (metrics) {
      updateEngagementData(metrics);
    }
  }, [metrics, updateEngagement]);

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

    // Update engagement system with new metrics
    updateEngagementData(newMetrics);

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
    setLastUploadDate(new Date());
    console.log("Dashboard data saved to Supabase");
  };


  const handleCardClick = (type: 'nps' | 'jira' | 'project' | 'adhoc', title: string, currentScore: number, target: number, maxScore: number, trend: number, respondents?: number) => {
    setSelectedCard({ type, title, currentScore, target, maxScore, trend, respondents });
  };

  // Calculate trends for display
  const npsTrend = calculateTrend(npsData);
  const jiraTrend = calculateTrend(jiraData);
  const projectTrend = calculateTrend(satisfactionData);
  const adhocTrend = calculateTrend(adhocData);

  // Get data sources for badges
  const npsSource = getDataSource(hasUploadedData, metrics.nps.current, defaultMetrics.nps.current);
  const jiraSource = getDataSource(hasUploadedData, metrics.jira.current, defaultMetrics.jira.current);
  const projectSource = getDataSource(hasUploadedData, metrics.project.current, defaultMetrics.project.current);
  const adhocSource = getDataSource(hasUploadedData, metrics.adhoc.current, defaultMetrics.adhoc.current);

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
        {/* Header with Logo and Traffic Light */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            {/* Sysmex Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/lovable-uploads/c2503f0e-4514-4e32-b540-b9ea2e9d0512.png" 
                alt="Sysmex - Together for a better healthcare journey" 
                className="h-12 w-auto object-contain"
              />
            </div>
            
            {/* Dashboard Title */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Customer Satisfaction Dashboard
            </h1>
            
            {/* Traffic Light */}
            <div className="flex-shrink-0">
              <OverallTrafficLight metrics={metrics} variant="horizontal" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm text-muted-foreground">Real-time insights</p>
              </div>
              <div className="flex items-center gap-2 bg-secondary/20 rounded-full px-3 py-1">
                <Trophy className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium">{achievements.length} Achievements</span>
              </div>
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
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-600 dark:text-blue-400">Customer Experience Focus</p>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {npsData.length > 0 ? Math.round(npsData[npsData.length - 1]?.score || 65) : 65}
                  </div>
                  <p className="text-xs text-muted-foreground">NPS Score</p>
                </div>
              </div>
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
                  trend={projectTrend}
                  respondents={metrics.project.respondents}
                  icon={<FolderOpen className="h-4 w-4" />}
                  onClick={() => handleCardClick('project', 'Project Satisfaction', metrics.project.current, metrics.project.target, 5, projectTrend, metrics.project.respondents)}
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
                  trend={jiraTrend}
                  respondents={metrics.jira.respondents}
                  icon={<Ticket className="h-4 w-4" />}
                  onClick={() => handleCardClick('jira', 'Jira Tickets', metrics.jira.current, metrics.jira.target, 5, jiraTrend, metrics.jira.respondents)}
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
                  trend={adhocTrend}
                  respondents={metrics.adhoc.respondents}
                  icon={<MessageSquare className="h-4 w-4" />}
                  onClick={() => handleCardClick('adhoc', 'Ad-hoc Feedback', metrics.adhoc.current, metrics.adhoc.target, 5, adhocTrend, metrics.adhoc.respondents)}
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
                    trend={npsTrend}
                    respondents={metrics.nps.respondents}
                    className="w-full h-full flex-1"
                    onClick={() => handleCardClick('nps', 'Net Promoter Score', metrics.nps.current, metrics.nps.target, 100, npsTrend, metrics.nps.respondents)}
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
                    trend={jiraTrend}
                    respondents={metrics.jira.respondents}
                    icon={<Ticket className="h-4 w-4" />}
                    onClick={() => handleCardClick('jira', 'Jira Tickets', metrics.jira.current, metrics.jira.target, 5, jiraTrend, metrics.jira.respondents)}
                  />
                  
                  <CompactMetricCard
                    title="Project Satisfaction"
                    currentScore={metrics.project.current}
                    target={metrics.project.target}
                    maxScore={5}
                    trend={projectTrend}
                    respondents={metrics.project.respondents}
                    icon={<FolderOpen className="h-4 w-4" />}
                    onClick={() => handleCardClick('project', 'Project Satisfaction', metrics.project.current, metrics.project.target, 5, projectTrend, metrics.project.respondents)}
                  />
                  
                  <CompactMetricCard
                    title="Ad-hoc Feedback"
                    currentScore={metrics.adhoc.current}
                    target={metrics.adhoc.target}
                    maxScore={5}
                    trend={adhocTrend}
                    respondents={metrics.adhoc.respondents}
                    icon={<MessageSquare className="h-4 w-4" />}
                    onClick={() => handleCardClick('adhoc', 'Ad-hoc Feedback', metrics.adhoc.current, metrics.adhoc.target, 5, adhocTrend, metrics.adhoc.respondents)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Insights Section */}
        {insights.length > 0 && (
          <div className="animate-fade-in">
            <InsightsSection
              insights={insights}
              onDismissInsight={dismissInsight}
              onActionInsight={handleInsightAction}
              maxVisible={3}
            />
          </div>
        )}

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

        {/* Data Source Information */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3 text-center">Data Sources & Freshness</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs font-medium mb-1">NPS</p>
              <DataSourceBadge 
                source={npsSource.source} 
                isReal={npsSource.isReal} 
                lastUpdated={lastUploadDate || undefined}
                className="justify-center"
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium mb-1">Jira Tickets</p>
              <DataSourceBadge 
                source={jiraSource.source} 
                isReal={jiraSource.isReal} 
                lastUpdated={lastUploadDate || undefined}
                className="justify-center"
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium mb-1">Project Satisfaction</p>
              <DataSourceBadge 
                source={projectSource.source} 
                isReal={projectSource.isReal} 
                lastUpdated={lastUploadDate || undefined}
                className="justify-center"
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium mb-1">Ad-hoc Feedback</p>
              <DataSourceBadge 
                source={adhocSource.source} 
                isReal={adhocSource.isReal} 
                lastUpdated={lastUploadDate || undefined}
                className="justify-center"
              />
            </div>
          </div>
          {!hasUploadedData && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You're viewing default demo data. Upload an Excel file above to see your real customer satisfaction metrics and get accurate insights.
              </p>
            </div>
          )}
        </div>

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

        {/* Single Notification System - Bottom Right */}
        <NotificationQueue
          achievement={showAchievementNotification ? achievements[achievements.length - 1] : null}
          alerts={alerts}
          onDismissAchievement={dismissAchievementNotification}
          onDismissAlert={dismissAlert}
          onActionAlert={handleAlertAction}
        />
      </div>
    </div>
  );
};

export default Index;
