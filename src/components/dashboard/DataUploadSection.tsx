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
    // Create simplified Excel template for monthly surveys
    const templateData = [
      ['Month', 'NPS Score', 'NPS Respondents', 'Jira Score', 'Jira Respondents', 'Project Satisfaction Score', 'Project Respondents', 'Ad-hoc Score', 'Ad-hoc Respondents', 'NPS Comments'],
      ['Jan', '25', '120', '3.2', '75', '3.1', '35', '3.5', '18', 'System is slow during peak hours, needs performance improvement'],
      ['Feb', '32', '135', '3.4', '82', '3.3', '40', '3.3', '20', 'Mobile app needs improvement, overall good experience'],
      ['Mar', '38', '156', '3.6', '89', '3.6', '45', '3.1', '23', 'Love the new dashboard features, very intuitive'],
      ['Apr', '42', '167', '3.7', '95', '3.8', '48', '3.0', '25', 'Excellent performance improvements, great support'],
      ['May', '45', '172', '3.8', '102', '3.9', '52', '3.1', '28', 'API documentation is comprehensive, security is robust'],
      ['Jun', '48', '180', '3.8', '108', '4.2', '55', '3.2', '30', 'Best customer service experience, training materials helpful'],
      ['Jul', '', '', '', '', '', '', '', '', ''],
      ['Aug', '', '', '', '', '', '', '', '', ''],
      ['Sep', '', '', '', '', '', '', '', '', ''],
      ['Oct', '', '', '', '', '', '', '', '', ''],
      ['Nov', '', '', '', '', '', '', '', '', ''],
      ['Dec', '', '', '', '', '', '', '', '', '']
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