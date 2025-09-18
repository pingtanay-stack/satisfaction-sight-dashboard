import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileDown, Users, Lightbulb, Star, TrendingUp, MessageSquare, ThumbsUp, Sparkles, Heart, Smile, Zap, Trophy, Target, BarChart3, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';

interface ClimateData {
  overall_satisfaction: number;
  communication_cooperation: number;
  learning_development: number;
  team_name: string;
  survey_data: any;
  monthly_data: any;
}

interface IdeaData {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  votes: number;
  is_anonymous: boolean;
  created_at: string;
}

interface TeamScore {
  team_name: string;
  average_score: number;
  vote_count: number;
}

const Climate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [ideas, setIdeas] = useState<IdeaData[]>([]);
  const [teamScores, setTeamScores] = useState<TeamScore[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("General");
  const [newRating, setNewRating] = useState(2);
  const [newIdea, setNewIdea] = useState({ title: "", description: "", category: "Culture", anonymous: false });
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const teams = ["Sales & Marketing", "Technical", "Development", "Admin"];

  const loadTeamScores = async () => {
    const { data, error } = await supabase.rpc('get_team_scores');
    if (data && !error) {
      setTeamScores(data);
    }
  };

  const loadClimateData = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    const { data, error } = await supabase
      .from('user_climate_data')
      .select('*')
      .eq('user_id', user.user.id)
      .single();

    if (data && !error) {
      setClimateData(data);
    } else {
      // Set default inverted demo data (lower scores are better)
      setClimateData({
        overall_satisfaction: 1.8,
        communication_cooperation: 2.2,
        learning_development: 2.0,
        team_name: "General",
        survey_data: {},
        monthly_data: {}
      });
    }
  };

  const loadIdeas = async () => {
    const { data, error } = await supabase
      .from('climate_ideas')
      .select('*')
      .order('votes', { ascending: false });

    if (data && !error) {
      setIdeas(data);
    }
  };

  useEffect(() => {
    loadClimateData();
    loadIdeas();
    loadTeamScores();
  }, []);

  const handleTeamVote = async (teamName: string, score: number) => {
    const { data: user } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('team_votes')
      .insert({
        team_name: teamName,
        user_id: user.user?.id || null,
        vote_score: score
      });

    if (error) {
      toast({ title: "Error saving vote", variant: "destructive" });
    } else {
      toast({ title: `🗳️ Vote submitted for ${teamName}!` });
      loadTeamScores(); // Reload team scores to show updated averages
    }
  };

  const handleQuickRating = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast({ title: "Please sign in to rate", variant: "destructive" });
      return;
    }

    setIsSubmittingRating(true);

    const { error } = await supabase
      .from('user_climate_data')
      .upsert({
        user_id: user.user.id,
        team_name: selectedTeam,
        overall_satisfaction: newRating,
        communication_cooperation: newRating,
        learning_development: newRating,
        survey_data: {},
        monthly_data: {}
      });

    if (error) {
      toast({ title: "Error saving rating", variant: "destructive" });
    } else {
      setShowSuccessAnimation(true);
      toast({ title: "🎉 Rating saved successfully!" });
      setTimeout(() => setShowSuccessAnimation(false), 2000);
      loadClimateData();
    }
    
    setIsSubmittingRating(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Process and save climate survey data (inverted scoring: 1=best, 5=worst)
      const climateData = {
        user_id: user.user.id,
        overall_satisfaction: 1.8,
        communication_cooperation: 2.2,
        learning_development: 2.0,
        team_name: "General",
        survey_data: data as any,
        monthly_data: {} as any
      };

      const { error } = await supabase
        .from('user_climate_data')
        .upsert(climateData);

      if (error) {
        toast({ title: "Error uploading data", variant: "destructive" });
      } else {
        toast({ title: "📊 Survey data uploaded successfully!" });
        loadClimateData();
      }
    } catch (error) {
      toast({ title: "Error processing file", variant: "destructive" });
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      { 
        'Employee ID': 'EMP001',
        'Team': 'Sales & Marketing',
        'Overall Satisfaction (1-5, 1=Best)': 2,
        'Communication & Cooperation (1-5, 1=Best)': 3,
        'Learning & Development (1-5, 1=Best)': 2,
        'Comments': 'Great team environment'
      },
      { 
        'Employee ID': 'EMP002',
        'Team': 'Technical',
        'Overall Satisfaction (1-5, 1=Best)': 1,
        'Communication & Cooperation (1-5, 1=Best)': 2,
        'Learning & Development (1-5, 1=Best)': 1,
        'Comments': 'Excellent growth opportunities'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Climate Survey Template');
    XLSX.writeFile(wb, 'climate_survey_template.xlsx');
  };

  const submitIdea = async () => {
    if (!newIdea.title || !newIdea.description) return;

    const { data: user } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('climate_ideas')
      .insert({
        title: newIdea.title,
        description: newIdea.description,
        category: newIdea.category,
        user_id: newIdea.anonymous ? null : user.user?.id,
        is_anonymous: newIdea.anonymous
      });

    if (error) {
      toast({ title: "Error submitting idea", variant: "destructive" });
    } else {
      toast({ title: "💡 Idea submitted successfully!" });
      setNewIdea({ title: "", description: "", category: "Culture", anonymous: false });
      loadIdeas();
    }
  };

  const voteIdea = async (ideaId: string) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return;

    const { error } = await supabase
      .from('climate_ideas')
      .update({ votes: idea.votes + 1 })
      .eq('id', ideaId);

    if (!error) {
      toast({ title: "👍 Vote added!" });
      loadIdeas();
    }
  };

  const overallScore = climateData ? 
    ((climateData.overall_satisfaction + climateData.communication_cooperation + climateData.learning_development) / 3).toFixed(1)
    : "2.5";

  const getScoreColor = (score: number) => {
    if (score <= 1.5) return "text-green-500";
    if (score <= 2.5) return "text-yellow-500"; 
    return "text-red-500";
  };

  const getScoreEmoji = (score: number) => {
    if (score <= 1.5) return "🤩";
    if (score <= 2.0) return "😄";
    if (score <= 2.5) return "😊";
    if (score <= 3.5) return "😐";
    return "😢";
  };

  const getMoodGradient = (score: number) => {
    if (score <= 1.5) return "from-green-400 to-emerald-500";
    if (score <= 2.5) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-pink-500";
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-500';
      case 'Under Review': return 'bg-yellow-500';
      case 'Implemented': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/8 via-background to-secondary/6 bg-[length:400%_400%] animate-gradient-shift">
      {/* Header with matching gradient style */}
      <div className="border-b bg-gradient-to-r from-primary/5 via-secondary/3 to-primary/5 backdrop-blur-sm border-border/50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)} className="hover-lift">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-fade-in">
                Climate Survey Dashboard ⛅
              </h1>
              <p className="text-muted-foreground animate-slide-up">Staff satisfaction and workplace culture insights</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Enhanced Vision Framework - Main View */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-primary/15 to-secondary/10 border-2 border-primary/30 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              🏠 Our Vision Framework - Central Hub
            </h2>
            <p className="text-lg text-muted-foreground">Navigate to any dashboard from our organizational foundation</p>
          </div>
          
          {/* House Structure */}
          <div className="relative max-w-5xl mx-auto">
            
            {/* Roof - Vision */}
            <div className="relative mb-0">
              <div className="w-0 h-0 border-l-[350px] border-r-[350px] border-b-[140px] border-l-transparent border-r-transparent border-b-primary/40 mx-auto"></div>
              <div className="absolute top-14 left-1/2 transform -translate-x-1/2 text-center z-10">
                <h1 className="text-3xl font-bold text-primary mb-1">Our Vision</h1>
                <p className="text-sm text-muted-foreground">Excellence Through Innovation</p>
              </div>
              {/* Roof ridge line */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-primary/40"></div>
            </div>

            {/* House Body */}
            <div className="bg-gradient-to-b from-background to-secondary/5 border-2 border-primary/30 rounded-none relative" style={{marginTop: '-2px'}}>
              
              {/* Dashboard Navigation - Top Floor */}
              <div className="text-center py-8 border-b border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10">
                <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center justify-center gap-2">
                  <BarChart3 className="h-6 w-6 text-primary animate-pulse" />
                  Dashboard Navigation Hub
                  <Sparkles className="h-6 w-6 text-yellow-500 animate-twinkle" />
                </h2>
                <div className="flex justify-center gap-6 flex-wrap">
                  <Button 
                    onClick={() => navigate("/")} 
                    className="hover-lift bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-8 py-4 h-auto"
                  >
                    📊 Customer Dashboard
                  </Button>
                  <Button 
                    onClick={() => navigate("/sales")} 
                    className="hover-lift bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-lg px-8 py-4 h-auto"
                  >
                    📈 Sales Dashboard
                  </Button>
                  <Button 
                    className="hover-lift bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg px-8 py-4 h-auto opacity-75 cursor-not-allowed"
                    disabled
                  >
                    ⛅ Climate Dashboard (Current)
                  </Button>
                </div>
              </div>
              
              {/* Core Values - Second Floor */}
              <div className="text-center py-6 border-b border-border/50 bg-secondary/5">
                <h2 className="text-lg font-semibold text-foreground mb-4">Core Values</h2>
                <div className="flex justify-center gap-3 flex-wrap">
                  <Badge variant="secondary" className="px-3 py-1 text-xs hover-scale">Driving Innovation</Badge>
                  <Badge variant="secondary" className="px-3 py-1 text-xs hover-scale">Ignite purpose in our work</Badge>
                  <Badge variant="secondary" className="px-3 py-1 text-xs hover-scale">Developing Trusted Relationship</Badge>
                  <Badge variant="secondary" className="px-3 py-1 text-xs hover-scale">Building Customer Confidence</Badge>
                  <Badge variant="secondary" className="px-3 py-1 text-xs hover-scale">Upholding Ethical Standards</Badge>
                </div>
              </div>

              {/* Four Pillars - Main Floor */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-background/80">
                {[
                  { title: "People", icon: Users, color: "bg-blue-500", description: "Customer Experience", dashboard: "/" },
                  { title: "Innovate", icon: Lightbulb, color: "bg-green-500", description: "Continuous Improvement", dashboard: "/climate" },
                  { title: "Protect", icon: Shield, color: "bg-orange-500", description: "Quality Assurance", dashboard: "/" },
                  { title: "Expand", icon: TrendingUp, color: "bg-purple-500", description: "Growth & Scale", dashboard: "/sales" }
                ].map(pillar => (
                  <div 
                    key={pillar.title} 
                    className="text-center group bg-background/70 rounded-lg p-4 border border-border/30 hover:border-primary/50 transition-all duration-200 shadow-sm cursor-pointer hover-lift"
                    onClick={() => navigate(pillar.dashboard)}
                  >
                    <div className="mb-3">
                      <div className={`w-12 h-12 rounded-full ${pillar.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                        <pillar.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">{pillar.title}</h3>
                      <p className="text-xs text-muted-foreground">{pillar.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Foundation */}
            <div className="text-center py-4 bg-secondary/20 border-2 border-t-0 border-primary/20 rounded-b-lg">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Foundation:</strong> Customer Satisfaction • Innovation Excellence • Quality Protection • Strategic Growth
              </p>
            </div>
          </div>
        </Card>

        {/* THINK TANK - Prominent Banner */}
        <div className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-yellow-600/20 p-8 rounded-2xl border-4 border-dashed border-primary/40 mb-8 text-center shadow-2xl">
          <div className="text-6xl mb-4 animate-bounce">🧠💡</div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            THINK TANK - Innovation Central
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            🚀 The heart of our innovation! Share brilliant ideas to transform our workplace culture!
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              className="text-lg px-6 py-3 h-auto hover-lift bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-2 animate-pulse"
              onClick={() => document.getElementById('ideas-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              💭 {ideas.length} Active Ideas
            </Button>
            <Button 
              variant="outline" 
              className="text-lg px-6 py-3 h-auto hover-lift bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 border-2 animate-pulse"
              onClick={() => document.getElementById('submit-idea-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              ⚡ Innovation Hub
            </Button>
          </div>
        </div>

        {/* Main Score Display with Enhanced Animations */}
        <Card className={`text-center glass-card hover-lift animate-fade-in ${showSuccessAnimation ? 'animate-celebrate' : ''}`}>
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 text-red-500 animate-pulse" />
              Overall Climate Score
              <Sparkles className="h-6 w-6 text-yellow-500 animate-twinkle" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(parseFloat(overallScore))} animate-scale-in`}>
              {overallScore}/5.0
              <span className="text-4xl ml-2 animate-bounce">{getScoreEmoji(parseFloat(overallScore))}</span>
            </div>
            <div className="flex justify-center gap-1 mb-4">
              {[5, 4, 3, 2, 1].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 transition-all duration-300 hover:scale-125 ${
                    parseFloat(overallScore) <= star 
                      ? 'fill-yellow-400 text-yellow-400 animate-twinkle' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className={`h-2 bg-gradient-to-r ${getMoodGradient(parseFloat(overallScore))} rounded-full mx-auto max-w-xs animate-pulse`}></div>
            <p className="text-muted-foreground">Based on Communication, Learning & Overall Satisfaction (1=Best, 5=Needs Improvement)</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 glass-surface">
            <TabsTrigger value="overview" className="hover-glow">📊 Overview</TabsTrigger>
            <TabsTrigger value="teams" className="hover-glow">👥 Team Voting</TabsTrigger>
            <TabsTrigger value="upload" className="hover-glow">📁 Data Management</TabsTrigger>
            <TabsTrigger value="ideas" className="hover-glow">💡 Think Tank</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass-card hover-lift group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    Communication & Cooperation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 animate-pulse-glow">
                    {climateData?.communication_cooperation.toFixed(1) || "2.2"}/5.0
                    <span className="text-lg ml-2">{getScoreEmoji(climateData?.communication_cooperation || 2.2)}</span>
                  </div>
                  <Progress 
                    value={100 - (climateData?.communication_cooperation || 2.2) * 20} 
                    className="mt-2 h-3 animate-shimmer" 
                  />
                  <div className="mt-2 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    Excellent team synergy! 🤝
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    Learning & Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600 animate-pulse-glow">
                    {climateData?.learning_development.toFixed(1) || "2.0"}/5.0
                    <span className="text-lg ml-2">{getScoreEmoji(climateData?.learning_development || 2.0)}</span>
                  </div>
                  <Progress 
                    value={100 - (climateData?.learning_development || 2.0) * 20} 
                    className="mt-2 h-3 animate-shimmer" 
                  />
                  <div className="mt-2 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    Great growth mindset! 📚
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Smile className="h-4 w-4 text-green-500" />
                    Overall Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 animate-pulse-glow">
                    {climateData?.overall_satisfaction.toFixed(1) || "1.8"}/5.0
                    <span className="text-lg ml-2">{getScoreEmoji(climateData?.overall_satisfaction || 1.8)}</span>  
                  </div>
                  <Progress 
                    value={100 - (climateData?.overall_satisfaction || 1.8) * 20} 
                    className="mt-2 h-3 animate-shimmer" 
                  />
                  <div className="mt-2 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    Keep up the good vibes! ✨
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4 animate-fade-in">
            <Card className="glass-card border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary animate-pulse" />
                  Live Team Voting System
                  <Zap className="h-5 w-5 text-yellow-500 animate-bounce" />
                </CardTitle>
                <p className="text-muted-foreground">Vote multiple times to help improve team performance! (1=Best, 5=Needs Improvement)</p>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {teams.map((team, index) => {
                const teamScore = teamScores.find(ts => ts.team_name === team);
                const avgScore = teamScore?.average_score || 3.0;
                const voteCount = teamScore?.vote_count || 0;
                
                return (
                  <Card key={team} className="glass-card hover-lift animate-fade-in cursor-pointer group border-2 border-primary/20" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-center">
                        <Trophy className="h-6 w-6 text-yellow-500 animate-twinkle mx-auto mb-2" />
                        {team}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold animate-pulse-glow mb-2">
                          {avgScore}/5.0
                          <span className="text-lg ml-1">{getScoreEmoji(avgScore)}</span>
                        </div>
                        <div className="flex justify-center gap-1 mb-2">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 transition-all duration-300 ${
                                avgScore <= star 
                                  ? 'fill-yellow-400 text-yellow-400 animate-twinkle' 
                                  : 'text-gray-300'
                              }`}
                              style={{ animationDelay: `${star * 0.2}s` }}
                            />
                          ))}
                        </div>
                        <Badge variant="outline" className="mb-4">📊 {voteCount} votes</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Rate this team (1-5):</label>
                        <div className="flex gap-1 justify-center">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Button
                              key={rating}
                              size="sm"
                              variant={rating <= 2 ? "default" : rating <= 3 ? "secondary" : "destructive"}
                              onClick={() => handleTeamVote(team, rating)}
                              className="w-10 h-10 text-xs hover-scale"
                            >
                              {rating}
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                          Click to vote: 1-2 = Great! • 3 = Good • 4-5 = Needs work
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-500 animate-bounce" />
                    Upload Survey Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Upload Excel files containing survey results from HR 📊
                  </p>
                  <Input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hover-glow"
                  />
                  <Button variant="outline" onClick={downloadTemplate} className="w-full hover-lift">
                    <FileDown className="h-4 w-4 mr-2" />
                    Download Template 📄
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-500 animate-pulse" />
                    Data Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Source:</span>
                    <Badge variant="secondary" className="animate-fade-in">✨ Demo Data</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Updated:</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()} 📅
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Survey Responses:</span>
                    <span className="text-sm font-medium animate-pulse">24 employees 👥</span>
                  </div>
                  <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg">
                    <p className="text-sm text-center animate-fade-in">
                      🎯 Response rate: 89% - Excellent participation!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ideas" className="space-y-4 animate-fade-in">
            <Card className="glass-card border-2 border-primary/20" id="submit-idea-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500 animate-pulse" />
                  Submit New Idea
                  <Sparkles className="h-5 w-5 text-purple-500 animate-twinkle" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="💡 Idea title..."
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  className="hover-glow"
                />
                <Textarea
                  placeholder="✨ Describe your idea to enhance work culture..."
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                  className="hover-glow"
                />
                <div className="flex gap-4 items-center">
                  <Select 
                    value={newIdea.category} 
                    onValueChange={(value) => setNewIdea({ ...newIdea, category: value })}
                  >
                    <SelectTrigger className="w-48 hover-glow">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Culture">🎭 Work Culture</SelectItem>
                      <SelectItem value="Process">⚙️ Process Improvement</SelectItem>
                      <SelectItem value="Benefits">🎁 Benefits & Perks</SelectItem>
                      <SelectItem value="Environment">🏢 Work Environment</SelectItem>
                    </SelectContent>
                  </Select>
                  <label className="flex items-center gap-2 text-sm">
                    <input 
                      type="checkbox" 
                      checked={newIdea.anonymous}
                      onChange={(e) => setNewIdea({ ...newIdea, anonymous: e.target.checked })}
                      className="rounded"
                    />
                    🎭 Submit anonymously
                  </label>
                  <Button 
                    onClick={submitIdea}
                    disabled={!newIdea.title || !newIdea.description}
                    className="hover-lift bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Submit Idea ✨
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card" id="ideas-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500 animate-pulse" />
                  Community Ideas
                  <Badge variant="outline" className="animate-bounce">{ideas.length} ideas</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ideas.length === 0 ? (
                    <div className="text-center py-8">
                      <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                      <p className="text-muted-foreground">💭 No ideas yet. Be the first to share!</p>
                    </div>
                  ) : (
                    ideas.map((idea, index) => (
                      <Card key={idea.id} className="glass-surface hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-sm">{idea.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getStatusBadgeColor(idea.status)} text-white animate-fade-in`}
                              >
                                {idea.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{idea.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs animate-fade-in">
                                {idea.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {idea.is_anonymous ? "👤 Anonymous" : "👥 Team Member"}
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => voteIdea(idea.id)}
                              className="hover-scale"
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {idea.votes} 👍
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Climate;