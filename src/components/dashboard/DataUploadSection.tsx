import { Upload, Download, Link, FileSpreadsheet, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import * as XLSX from 'xlsx';

interface DataUploadSectionProps {
  onDataUpdate?: (data: any) => void;
}

export function DataUploadSection({ onDataUpdate }: DataUploadSectionProps = {}) {
  const { toast } = useToast();
  const [cloudUrls, setCloudUrls] = useState({
    sharepoint: "",
    onedrive: "",
    googlesheets: ""
  });
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Process the data and update dashboard
          if (onDataUpdate) {
            onDataUpdate(jsonData);
          }
          
          toast({
            title: "File uploaded successfully",
            description: `Processed ${file.name} with ${jsonData.length} rows of data.`,
          });
        } catch (error) {
          toast({
            title: "Upload failed",
            description: "Could not process the file. Please check the format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const downloadTemplate = () => {
    // Create comprehensive Excel template data for advanced analytics
    const templateData = [
      ['Month', 'Week', 'NPS Score', 'Jira Satisfaction', 'Project Satisfaction', 'Ad-hoc Feedback', 'NPS Responses', 'Jira Responses', 'Project Responses', 'Adhoc Responses', 'Avg Response Time (hrs)', 'Resolution Rate (%)', 'Promoters', 'Detractors', 'Passives', 'Critical Issues', 'Feature Requests', 'Bug Reports', 'Satisfaction Trend', 'Response Quality', 'User Segment', 'Department', 'Recent Feedback Sample'],
      ['Jan', '1', '25', '3.2', '3.1', '3.5', '120', '75', '35', '18', '24', '85', '30', '60', '30', '12', '8', '15', 'Declining', '3.2', 'Enterprise', 'IT', 'System is slow during peak hours'],
      ['Jan', '2', '28', '3.3', '3.2', '3.4', '125', '78', '36', '19', '22', '87', '35', '55', '35', '10', '9', '12', 'Improving', '3.3', 'SMB', 'Operations', 'Need better reporting features'],
      ['Jan', '3', '26', '3.1', '3.0', '3.6', '118', '72', '34', '17', '26', '83', '28', '65', '25', '15', '7', '18', 'Stable', '3.1', 'Enterprise', 'Finance', 'Interface could be more intuitive'],
      ['Jan', '4', '27', '3.4', '3.3', '3.3', '122', '76', '37', '20', '23', '86', '32', '58', '32', '11', '10', '14', 'Improving', '3.4', 'SMB', 'HR', 'Great customer support response'],
      ['Feb', '1', '32', '3.4', '3.3', '3.3', '135', '82', '40', '20', '21', '88', '45', '50', '40', '9', '12', '11', 'Improving', '3.5', 'Enterprise', 'IT', 'Mobile app needs improvement'],
      ['Feb', '2', '35', '3.5', '3.4', '3.2', '140', '85', '42', '22', '20', '90', '50', '45', '45', '8', '14', '10', 'Rising', '3.6', 'SMB', 'Sales', 'Love the new dashboard features'],
      ['Feb', '3', '30', '3.3', '3.2', '3.4', '130', '80', '38', '18', '25', '85', '40', '55', '35', '12', '10', '13', 'Declining', '3.3', 'Enterprise', 'Marketing', 'Integration with CRM needed'],
      ['Feb', '4', '34', '3.6', '3.5', '3.1', '138', '84', '41', '21', '19', '91', '48', '47', '43', '7', '13', '9', 'Rising', '3.7', 'SMB', 'Operations', 'Excellent performance improvements'],
      ['Mar', '1', '38', '3.6', '3.6', '3.1', '156', '89', '45', '23', '18', '92', '60', '40', '56', '6', '15', '8', 'Rising', '3.8', 'Enterprise', 'IT', 'Security features are robust'],
      ['Mar', '2', '40', '3.7', '3.7', '3.0', '160', '92', '47', '25', '17', '94', '65', '35', '60', '5', '17', '7', 'Strong', '3.9', 'SMB', 'Finance', 'API documentation is comprehensive'],
      ['Mar', '3', '36', '3.5', '3.5', '3.2', '152', '87', '43', '21', '20', '90', '55', '45', '52', '8', '13', '10', 'Stable', '3.6', 'Enterprise', 'HR', 'Training materials very helpful'],
      ['Mar', '4', '42', '3.8', '3.8', '3.0', '162', '95', '49', '27', '16', '95', '70', '30', '62', '4', '18', '6', 'Excellent', '4.0', 'SMB', 'Sales', 'Best customer service experience'],
      ['Apr', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['May', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['Jun', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['Jul', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['Aug', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['Sep', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['Oct', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['Nov', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['Dec', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    ];

    // Convert to CSV format
    const csvContent = templateData.map(row => row.join(',')).join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'customer_satisfaction_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const connectToService = (service: string, url: string) => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: `Please enter a valid ${service} URL before connecting.`,
        variant: "destructive",
      });
      return;
    }

    console.log(`Connecting to ${service} with URL: ${url}`);
    
    toast({
      title: `Connecting to ${service}...`,
      description: "Setting up integration with your cloud service.",
    });
    
    // Simulate successful connection after a delay
    setTimeout(() => {
      toast({
        title: "Connection established",
        description: `Successfully connected to ${service}. Data will sync automatically.`,
      });
    }, 2000);
  };

  return (
    <Card className="animate-fade-in card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Data Management
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-3">
          <h4 className="font-medium">Excel File Upload</h4>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-3">
              Drag and drop your Excel file here, or click to browse
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
        
        <Separator />
        
        {/* Cloud Integration Section */}
        <div className="space-y-4">
          <h4 className="font-medium">Connect to Cloud Services</h4>
          
          {/* SharePoint */}
          <div className="space-y-2">
            <Label htmlFor="sharepoint-url" className="text-sm font-medium">SharePoint URL</Label>
            <div className="flex gap-2">
              <Input
                id="sharepoint-url"
                placeholder="https://yourcompany.sharepoint.com/..."
                value={cloudUrls.sharepoint}
                onChange={(e) => setCloudUrls(prev => ({ ...prev, sharepoint: e.target.value }))}
                className="flex-1"
              />
              <Button 
                variant="outline"
                onClick={() => connectToService('SharePoint', cloudUrls.sharepoint)}
              >
                <Link className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </div>
            <Badge variant="secondary" className="text-xs">Excel Online</Badge>
          </div>
          
          {/* OneDrive */}
          <div className="space-y-2">
            <Label htmlFor="onedrive-url" className="text-sm font-medium">OneDrive File URL</Label>
            <div className="flex gap-2">
              <Input
                id="onedrive-url"
                placeholder="https://onedrive.live.com/..."
                value={cloudUrls.onedrive}
                onChange={(e) => setCloudUrls(prev => ({ ...prev, onedrive: e.target.value }))}
                className="flex-1"
              />
              <Button 
                variant="outline"
                onClick={() => connectToService('OneDrive', cloudUrls.onedrive)}
              >
                <Link className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </div>
            <Badge variant="secondary" className="text-xs">Microsoft 365</Badge>
          </div>
          
          {/* Google Sheets */}
          <div className="space-y-2">
            <Label htmlFor="googlesheets-url" className="text-sm font-medium">Google Sheets URL</Label>
            <div className="flex gap-2">
              <Input
                id="googlesheets-url"
                placeholder="https://docs.google.com/spreadsheets/..."
                value={cloudUrls.googlesheets}
                onChange={(e) => setCloudUrls(prev => ({ ...prev, googlesheets: e.target.value }))}
                className="flex-1"
              />
              <Button 
                variant="outline"
                onClick={() => connectToService('Google Sheets', cloudUrls.googlesheets)}
              >
                <Link className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </div>
            <Badge variant="secondary" className="text-xs">Real-time sync</Badge>
          </div>
        </div>
        
        {/* Status Section */}
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Data Status</p>
              <p className="text-xs text-muted-foreground">
                Last updated: Demo data (static)
              </p>
            </div>
            <Badge variant="outline">Demo Mode</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}