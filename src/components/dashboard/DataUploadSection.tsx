import { Upload, Download, Link, FileSpreadsheet, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface DataUploadSectionProps {
  onDataUpdate?: (data: any) => void;
}

export function DataUploadSection({ onDataUpdate }: DataUploadSectionProps = {}) {
  const { toast } = useToast();
  
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
    // Create Excel template data
    const templateData = [
      ['Month', 'NPS Score', 'Jira Satisfaction', 'Project Satisfaction', 'Ad-hoc Feedback'],
      ['Jan', '25', '3.2', '3.1', '3.5'],
      ['Feb', '32', '3.4', '3.3', '3.3'],
      ['Mar', '38', '3.6', '3.6', '3.1'],
      ['Apr', '42', '3.7', '3.8', '3.0'],
      ['May', '45', '3.8', '3.9', '3.1'],
      ['Jun', '48', '3.8', '4.2', '3.2'],
      ['Jul', '', '', '', ''],
      ['Aug', '', '', '', ''],
      ['Sep', '', '', '', ''],
      ['Oct', '', '', '', ''],
      ['Nov', '', '', '', ''],
      ['Dec', '', '', '', '']
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

  const connectToService = (service: string) => {
    console.log(`Connecting to ${service}...`);
    
    // Simulate connection process
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
        <div className="space-y-3">
          <h4 className="font-medium">Connect to Cloud Services</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => connectToService('SharePoint')}
            >
              <Link className="h-6 w-6" />
              <span className="text-sm">SharePoint</span>
              <Badge variant="secondary" className="text-xs">
                Excel Online
              </Badge>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => connectToService('OneDrive')}
            >
              <Link className="h-6 w-6" />
              <span className="text-sm">OneDrive</span>
              <Badge variant="secondary" className="text-xs">
                Microsoft 365
              </Badge>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => connectToService('Google Sheets')}
            >
              <Link className="h-6 w-6" />
              <span className="text-sm">Google Sheets</span>
              <Badge variant="secondary" className="text-xs">
                Real-time sync
              </Badge>
            </Button>
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