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
import { ArrowLeft, Upload, FileDown, Users, Lightbulb, Star, TrendingUp, MessageSquare, ThumbsUp } from "lucide-react";
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
      toast({ title: "Rating saved successfully!" });
      loadClimateData();
    }
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
        toast({ title: "Survey data uploaded successfully!" });
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
      toast({ title: "Idea submitted successfully!" });
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
      loadIdeas();
    }
  };

  const overallScore = climateData ? 
    ((climateData.overall_satisfaction + climateData.communication_cooperation + climateData.learning_development) / 3).toFixed(1)
    : "3.5";

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600";
    if (score >= 3.5) return "text-yellow-600"; 
    return "text-red-600";
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Climate Survey Dashboard</h1>
              <p className="text-muted-foreground">Staff satisfaction and workplace culture insights</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              Customer Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate("/sales")}>
              Sales Dashboard  
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Score Display */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-xl">Overall Climate Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(parseFloat(overallScore))}`}>
              {overallScore}/5.0
            </div>
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= parseFloat(overallScore) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-muted-foreground">Based on Communication, Learning & Overall Satisfaction</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="teams">Team Scores</TabsTrigger>
            <TabsTrigger value="upload">Data Management</TabsTrigger>
            <TabsTrigger value="ideas">Think Tank</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Communication & Cooperation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {climateData?.communication_cooperation.toFixed(1) || "3.8"}/5.0
                  </div>
                  <Progress 
                    value={(climateData?.communication_cooperation || 3.8) * 20} 
                    className="mt-2" 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Learning & Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {climateData?.learning_development.toFixed(1) || "4.0"}/5.0
                  </div>
                  <Progress 
                    value={(climateData?.learning_development || 4.0) * 20} 
                    className="mt-2" 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Overall Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {climateData?.overall_satisfaction.toFixed(1) || "4.2"}/5.0
                  </div>
                  <Progress 
                    value={(climateData?.overall_satisfaction || 4.2) * 20} 
                    className="mt-2" 
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Quick Team Rating
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Select Team</label>
                    <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                      <SelectTrigger>
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
                    />
                  </div>
                  <Button onClick={handleQuickRating}>
                    Submit Rating
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {teams.map((team) => (
                <Card key={team}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">{team}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-center mb-2">
                      {(3.5 + Math.random() * 1.5).toFixed(1)}/5.0
                    </div>
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4].map((star) => (
                        <Star
                          key={star}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Survey Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Upload Excel files containing survey results from HR
                  </p>
                  <Input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                  />
                  <Button variant="outline" onClick={downloadTemplate} className="w-full">
                    <FileDown className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Source:</span>
                    <Badge variant="secondary">Demo Data</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Updated:</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Survey Responses:</span>
                    <span className="text-sm font-medium">24 employees</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ideas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Submit New Idea
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Idea title..."
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                />
                <Textarea
                  placeholder="Describe your idea to enhance work culture..."
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                />
                <div className="flex gap-4 items-center">
                  <Select 
                    value={newIdea.category} 
                    onValueChange={(value) => setNewIdea({ ...newIdea, category: value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Culture">Work Culture</SelectItem>
                      <SelectItem value="Process">Process Improvement</SelectItem>
                      <SelectItem value="Benefits">Benefits & Perks</SelectItem>
                      <SelectItem value="Environment">Work Environment</SelectItem>
                    </SelectContent>
                  </Select>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newIdea.anonymous}
                      onChange={(e) => setNewIdea({ ...newIdea, anonymous: e.target.checked })}
                    />
                    Submit anonymously
                  </label>
                  <Button onClick={submitIdea} disabled={!newIdea.title || !newIdea.description}>
                    Submit Idea
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Community Ideas</h3>
              {ideas.length > 0 ? ideas.map((idea) => (
                <Card key={idea.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold">{idea.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{idea.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusBadgeColor(idea.status)}>
                          {idea.status}
                        </Badge>
                        <Badge variant="outline">{idea.category}</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        {idea.is_anonymous ? 'Anonymous' : 'Team Member'} • {new Date(idea.created_at).toLocaleDateString()}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => voteIdea(idea.id)}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {idea.votes}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No ideas submitted yet. Be the first to share your thoughts!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Climate;