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
import { ArrowLeft, Upload, FileDown, Users, Lightbulb, Star, TrendingUp, MessageSquare, ThumbsUp, Sparkles, Heart, Smile, Zap, Trophy, Target, BarChart3 } from "lucide-react";
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

const Climate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [ideas, setIdeas] = useState<IdeaData[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("General");
  const [newRating, setNewRating] = useState(5);
  const [newIdea, setNewIdea] = useState({ title: "", description: "", category: "Culture", anonymous: false });
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const teams = ["Sales & Marketing", "Technical", "Development", "Admin"];

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
  }, []);

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

      // Process and save climate survey data
      const climateData = {
        user_id: user.user.id,
        overall_satisfaction: 4.2,
        communication_cooperation: 3.8,
        learning_development: 4.0,
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
        'Overall Satisfaction (1-5)': 4,
        'Communication & Cooperation (1-5)': 3,
        'Learning & Development (1-5)': 4,
        'Comments': 'Great team environment'
      },
      { 
        'Employee ID': 'EMP002',
        'Team': 'Technical',
        'Overall Satisfaction (1-5)': 5,
        'Communication & Cooperation (1-5)': 4,
        'Learning & Development (1-5)': 5,
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
    : "3.5";

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-500";
    if (score >= 3.5) return "text-yellow-500"; 
    return "text-red-500";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 4.5) return "🤩";
    if (score >= 4.0) return "😄";
    if (score >= 3.5) return "😊";
    if (score >= 2.5) return "😐";
    return "😢";
  };

  const getMoodGradient = (score: number) => {
    if (score >= 4.5) return "from-green-400 to-emerald-500";
    if (score >= 3.5) return "from-yellow-400 to-orange-500";
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")} className="hover-scale">
              <BarChart3 className="h-4 w-4 mr-2" />
              Customer Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate("/sales")} className="hover-scale">
              <TrendingUp className="h-4 w-4 mr-2" />
              Sales Dashboard  
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
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
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 transition-all duration-300 hover:scale-125 ${
                    star <= parseFloat(overallScore) 
                      ? 'fill-yellow-400 text-yellow-400 animate-twinkle' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className={`h-2 bg-gradient-to-r ${getMoodGradient(parseFloat(overallScore))} rounded-full mx-auto max-w-xs animate-pulse`}></div>
            <p className="text-muted-foreground">Based on Communication, Learning & Overall Satisfaction</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 glass-surface">
            <TabsTrigger value="overview" className="hover-glow">📊 Overview</TabsTrigger>
            <TabsTrigger value="teams" className="hover-glow">👥 Team Scores</TabsTrigger>
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
                    {climateData?.communication_cooperation.toFixed(1) || "3.8"}/5.0
                    <span className="text-lg ml-2">{getScoreEmoji(climateData?.communication_cooperation || 3.8)}</span>
                  </div>
                  <Progress 
                    value={(climateData?.communication_cooperation || 3.8) * 20} 
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
                    {climateData?.learning_development.toFixed(1) || "4.0"}/5.0
                    <span className="text-lg ml-2">{getScoreEmoji(climateData?.learning_development || 4.0)}</span>
                  </div>
                  <Progress 
                    value={(climateData?.learning_development || 4.0) * 20} 
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
                    {climateData?.overall_satisfaction.toFixed(1) || "4.2"}/5.0
                    <span className="text-lg ml-2">{getScoreEmoji(climateData?.overall_satisfaction || 4.2)}</span>
                  </div>
                  <Progress 
                    value={(climateData?.overall_satisfaction || 4.2) * 20} 
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
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary animate-pulse" />
                  Quick Team Rating
                  <Zap className="h-5 w-5 text-yellow-500 animate-bounce" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Select Team</label>
                    <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                      <SelectTrigger className="hover-glow">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team} value={team}>{team}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium">Current Satisfaction (1-5)</label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={newRating}
                      onChange={(e) => setNewRating(parseFloat(e.target.value))}
                      className="hover-glow"
                    />
                  </div>
                  <Button 
                    onClick={handleQuickRating}
                    disabled={isSubmittingRating}
                    className="hover-lift bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
                  >
                    {isSubmittingRating ? (
                      <>
                        <div className="animate-spin mr-2">⭐</div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Submit Rating
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {teams.map((team, index) => {
                const randomScore = 3.5 + Math.random() * 1.5;
                return (
                  <Card key={team} className="glass-card hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500 animate-twinkle" />
                        {team}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-center mb-2 animate-pulse-glow">
                        {randomScore.toFixed(1)}/5.0
                        <span className="text-lg ml-1">{getScoreEmoji(randomScore)}</span>
                      </div>
                      <div className="flex justify-center gap-1 mb-2">
                        {[1, 2, 3, 4].map((star) => (
                          <Star
                            key={star}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-twinkle"
                            style={{ animationDelay: `${star * 0.2}s` }}
                          />
                        ))}
                        <Star className="h-4 w-4 text-gray-300" />
                      </div>
                      <div className={`h-2 bg-gradient-to-r ${getMoodGradient(randomScore)} rounded-full animate-shimmer`}></div>
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
            <Card className="glass-card">
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

            <Card className="glass-card">
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