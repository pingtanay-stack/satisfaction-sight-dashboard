import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Upload, Trophy, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { CompanyTripProgress } from '@/components/dashboard/CompanyTripProgress';
import { SalesTrendChart } from '@/components/dashboard/SalesTrendChart';
import { DataSourceBadge } from '@/components/ui/data-source-badge';
import { toast } from 'sonner';
import { SalesData, saveSalesDataToSupabase, loadSalesDataFromSupabase, hasSavedSalesDataInSupabase } from '@/lib/salesStorage';
import * as XLSX from 'xlsx';

const defaultSalesData: SalesData = {
  salesMetrics: {
    eclair: { current: 850000, target: 1000000, achieved: 85 },
    delphicAP: { current: 650000, target: 800000, achieved: 81.25 },
    delphicLIS: { current: 920000, target: 1100000, achieved: 83.64 },
    hclabExternal: { current: 780000, target: 900000, achieved: 86.67 },
    urinalysis: {
      total: { current: 1200000, target: 1400000, achieved: 85.71 },
      breakdown: {
        instrument: { current: 400000, target: 500000, achieved: 80 },
        reagents: { current: 600000, target: 700000, achieved: 85.71 },
        service: { current: 200000, target: 200000, achieved: 100 }
      }
    },
    ogt: { current: 550000, target: 600000, achieved: 91.67 },
    fcm: {
      total: { current: 890000, target: 1000000, achieved: 89 },
      breakdown: {
        reagents: { current: 450000, target: 500000, achieved: 90 },
        instrument: { current: 320000, target: 350000, achieved: 91.43 },
        service: { current: 120000, target: 150000, achieved: 80 }
      }
    },
    hclabInternal: { current: 450000, target: 500000, achieved: 90 },
    snzService: { current: 280000, target: 300000, achieved: 93.33 }
  },
  monthlyData: {
    external_health_it: [
      { month: 'Jan', eclair: 800000, delphicAP: 600000, delphicLIS: 850000, hclabExternal: 700000 },
      { month: 'Feb', eclair: 820000, delphicAP: 620000, delphicLIS: 880000, hclabExternal: 720000 },
      { month: 'Mar', eclair: 850000, delphicAP: 650000, delphicLIS: 920000, hclabExternal: 780000 }
    ],
    external_ivd: [
      { month: 'Jan', urinalysis: 1100000, ogt: 500000, fcm: 800000 },
      { month: 'Feb', urinalysis: 1150000, ogt: 520000, fcm: 840000 },
      { month: 'Mar', urinalysis: 1200000, ogt: 550000, fcm: 890000 }
    ],
    internal: [
      { month: 'Jan', hclabInternal: 400000, snzService: 250000 },
      { month: 'Feb', hclabInternal: 420000, snzService: 260000 },
      { month: 'Mar', hclabInternal: 450000, snzService: 280000 }
    ]
  },
  companyTripProgress: {
    overall: 87.2,
    target: 10000000,
    achieved: 8720000,
    requiredForTrip: 9000000
  }
};

const Sales = () => {
  const [salesData, setSalesData] = useState<SalesData>(defaultSalesData);
  const [isUsingRealData, setIsUsingRealData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>();

  useEffect(() => {
    const loadData = async () => {
      try {
        const hasData = await hasSavedSalesDataInSupabase();
        if (hasData) {
          const data = await loadSalesDataFromSupabase(defaultSalesData);
          setSalesData(data);
          setIsUsingRealData(true);
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error('Error loading sales data:', error);
      }
    };
    loadData();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Process the uploaded data and update salesData
      // This is a simplified version - you'd want more robust parsing
      if (jsonData.length > 0) {
        await saveSalesDataToSupabase(salesData);
        setIsUsingRealData(true);
        setLastUpdated(new Date());
        toast.success('Sales data uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file. Please check the format.');
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        Month: 'March 2024',
        'Eclair Current': 850000,
        'Eclair Target': 1000000,
        'Delphic AP Current': 650000,
        'Delphic AP Target': 800000,
        'Delphic LIS Current': 920000,
        'Delphic LIS Target': 1100000,
        'HCLAB External Current': 780000,
        'HCLAB External Target': 900000,
        'Urinalysis Instrument Current': 400000,
        'Urinalysis Instrument Target': 500000,
        'Urinalysis Reagents Current': 600000,
        'Urinalysis Reagents Target': 700000,
        'Urinalysis Service Current': 200000,
        'Urinalysis Service Target': 200000,
        'OGT Current': 550000,
        'OGT Target': 600000,
        'FCM Reagents Current': 450000,
        'FCM Reagents Target': 500000,
        'FCM Instrument Current': 320000,
        'FCM Instrument Target': 350000,
        'FCM Service Current': 120000,
        'FCM Service Target': 150000,
        'HCLAB Internal Current': 450000,
        'HCLAB Internal Target': 500000,
        'SNZ Service Current': 280000,
        'SNZ Service Target': 300000
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Template');
    XLSX.writeFile(workbook, 'sales_template.xlsx');
    toast.success('Template downloaded successfully!');
  };

  const companyTripPercentage = Math.min((salesData.companyTripProgress.achieved / salesData.companyTripProgress.requiredForTrip) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-pulse-slow" />
      
      <div className="relative z-10">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Customer Dashboard
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Sales Performance Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Track sales performance and company trip progress</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DataSourceBadge 
                  source={isUsingRealData ? 'excel' : 'default'} 
                  isReal={isUsingRealData} 
                  lastUpdated={lastUpdated}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Company Trip Progress */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Company Trip Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CompanyTripProgress 
                currentProgress={companyTripPercentage}
                target={salesData.companyTripProgress.target}
                achieved={salesData.companyTripProgress.achieved}
                requiredForTrip={salesData.companyTripProgress.requiredForTrip}
              />
            </CardContent>
          </Card>

          {/* Data Upload Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={downloadTemplate} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Excel Template
                </Button>
                <div className="relative">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="default" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Sales Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* External Sales - Health IT */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>External Sales - Health IT</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Eclair"
                  currentScore={salesData.salesMetrics.eclair.achieved}
                  target={100}
                  maxScore={100}
                  trend={2.5}
                  icon={<TrendingUp className="h-4 w-4" />}
                />
                <MetricCard
                  title="Delphic AP"
                  currentScore={salesData.salesMetrics.delphicAP.achieved}
                  target={100}
                  maxScore={100}
                  trend={1.8}
                  icon={<TrendingUp className="h-4 w-4" />}
                />
                <MetricCard
                  title="Delphic LIS"
                  currentScore={salesData.salesMetrics.delphicLIS.achieved}
                  target={100}
                  maxScore={100}
                  trend={3.1}
                  icon={<TrendingUp className="h-4 w-4" />}
                />
                <MetricCard
                  title="HCLAB External"
                  currentScore={salesData.salesMetrics.hclabExternal.achieved}
                  target={100}
                  maxScore={100}
                  trend={4.2}
                  icon={<TrendingUp className="h-4 w-4" />}
                />
              </div>
            </CardContent>
          </Card>

          {/* External Sales - IVD */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>External Sales - IVD (In Vitro Diagnostics)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                  title="Urinalysis"
                  currentScore={salesData.salesMetrics.urinalysis.total.achieved}
                  target={100}
                  maxScore={100}
                  trend={3.8}
                  icon={<TrendingUp className="h-4 w-4" />}
                />
                <MetricCard
                  title="OGT"
                  currentScore={salesData.salesMetrics.ogt.achieved}
                  target={100}
                  maxScore={100}
                  trend={5.5}
                  icon={<TrendingUp className="h-4 w-4" />}
                />
                <MetricCard
                  title="FCM"
                  currentScore={salesData.salesMetrics.fcm.total.achieved}
                  target={100}
                  maxScore={100}
                  trend={2.9}
                  icon={<TrendingUp className="h-4 w-4" />}
                />
              </div>
            </CardContent>
          </Card>

          {/* Internal Sales */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Internal Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard
                  title="HCLAB Internal"
                  currentScore={salesData.salesMetrics.hclabInternal.achieved}
                  target={100}
                  maxScore={100}
                  trend={6.1}
                  icon={<TrendingUp className="h-4 w-4" />}
                />
                <MetricCard
                  title="SNZ Service"
                  currentScore={salesData.salesMetrics.snzService.achieved}
                  target={100}
                  maxScore={100}
                  trend={4.7}
                  icon={<TrendingUp className="h-4 w-4" />}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sales Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Health IT Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <SalesTrendChart data={salesData.monthlyData.external_health_it} />
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>IVD Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <SalesTrendChart data={salesData.monthlyData.external_ivd} />
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Internal Sales Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <SalesTrendChart data={salesData.monthlyData.internal} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sales;