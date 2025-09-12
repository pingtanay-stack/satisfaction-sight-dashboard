import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Upload, Trophy, Monitor, TestTube, Building, Microscope, Beaker, Wrench, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { RadialMetricCard } from '@/components/dashboard/RadialMetricCard';
import { AchievementMetricCard } from '@/components/dashboard/AchievementMetricCard';
import { GaugeMetricCard } from '@/components/dashboard/GaugeMetricCard';
import { IsometricAdventureProgress } from '@/components/dashboard/IsometricAdventureProgress';
import { SalesTrendChart } from '@/components/dashboard/SalesTrendChart';
import { ProductDetailModal } from '@/components/dashboard/ProductDetailModal';
import { DataSourceBadge } from '@/components/ui/data-source-badge';
import { toast } from 'sonner';
import { SalesData, MonthlyTargetData, saveSalesDataToSupabase, loadSalesDataFromSupabase, hasSavedSalesDataInSupabase } from '@/lib/salesStorage';
import * as XLSX from 'xlsx';
const defaultSalesData: SalesData = {
  salesMetrics: {
    eclair: {
      current: 850000,
      target: 1000000,
      achieved: 85
    },
    delphicAP: {
      current: 650000,
      target: 800000,
      achieved: 81.25
    },
    delphicLIS: {
      current: 920000,
      target: 1100000,
      achieved: 83.64
    },
    hclabExternal: {
      current: 780000,
      target: 900000,
      achieved: 86.67
    },
    urinalysis: {
      total: {
        current: 1200000,
        target: 1400000,
        achieved: 85.71
      },
      breakdown: {
        instrument: {
          current: 400000,
          target: 500000,
          achieved: 80
        },
        reagents: {
          current: 600000,
          target: 700000,
          achieved: 85.71
        },
        service: {
          current: 200000,
          target: 200000,
          achieved: 100
        }
      }
    },
    ogt: {
      current: 550000,
      target: 600000,
      achieved: 91.67
    },
    fcm: {
      total: {
        current: 890000,
        target: 1000000,
        achieved: 89
      },
      breakdown: {
        reagents: {
          current: 450000,
          target: 500000,
          achieved: 90
        },
        instrument: {
          current: 320000,
          target: 350000,
          achieved: 91.43
        },
        service: {
          current: 120000,
          target: 150000,
          achieved: 80
        }
      }
    },
    hclabInternal: {
      current: 450000,
      target: 500000,
      achieved: 90
    },
    snzService: {
      current: 280000,
      target: 300000,
      achieved: 93.33
    }
  },
  monthlyData: {
    external_health_it: [{
      month: 'Jan',
      eclair: 800000,
      delphicAP: 600000,
      delphicLIS: 850000,
      hclabExternal: 700000
    }, {
      month: 'Feb',
      eclair: 820000,
      delphicAP: 620000,
      delphicLIS: 880000,
      hclabExternal: 720000
    }, {
      month: 'Mar',
      eclair: 850000,
      delphicAP: 650000,
      delphicLIS: 920000,
      hclabExternal: 780000
    }],
    external_ivd: [{
      month: 'Jan',
      urinalysis: 1100000,
      ogt: 500000,
      fcm: 800000
    }, {
      month: 'Feb',
      urinalysis: 1150000,
      ogt: 520000,
      fcm: 840000
    }, {
      month: 'Mar',
      urinalysis: 1200000,
      ogt: 550000,
      fcm: 890000
    }],
    internal: [{
      month: 'Jan',
      hclabInternal: 400000,
      snzService: 250000
    }, {
      month: 'Feb',
      hclabInternal: 420000,
      snzService: 260000
    }, {
      month: 'Mar',
      hclabInternal: 450000,
      snzService: 280000
    }]
  },
  monthlyTargets: {
    external_health_it: [{
      month: 'Jan',
      targets: { eclair: 83000, delphicAP: 67000, delphicLIS: 92000, hclabExternal: 75000 },
      actuals: { eclair: 80000, delphicAP: 60000, delphicLIS: 85000, hclabExternal: 70000 }
    }, {
      month: 'Feb', 
      targets: { eclair: 84000, delphicAP: 68000, delphicLIS: 93000, hclabExternal: 76000 },
      actuals: { eclair: 82000, delphicAP: 62000, delphicLIS: 88000, hclabExternal: 72000 }
    }, {
      month: 'Mar',
      targets: { eclair: 85000, delphicAP: 69000, delphicLIS: 94000, hclabExternal: 77000 },
      actuals: { eclair: 85000, delphicAP: 65000, delphicLIS: 92000, hclabExternal: 78000 }
    }],
    external_ivd: [{
      month: 'Jan',
      targets: { urinalysis: 117000, ogt: 50000, fcm: 83000 },
      actuals: { urinalysis: 110000, ogt: 50000, fcm: 80000 }
    }, {
      month: 'Feb',
      targets: { urinalysis: 118000, ogt: 51000, fcm: 84000 },
      actuals: { urinalysis: 115000, ogt: 52000, fcm: 84000 }
    }, {
      month: 'Mar',
      targets: { urinalysis: 119000, ogt: 52000, fcm: 85000 },
      actuals: { urinalysis: 120000, ogt: 55000, fcm: 89000 }
    }],
    internal: [{
      month: 'Jan',
      targets: { hclabInternal: 42000, snzService: 25000 },
      actuals: { hclabInternal: 40000, snzService: 25000 }
    }, {
      month: 'Feb', 
      targets: { hclabInternal: 43000, snzService: 26000 },
      actuals: { hclabInternal: 42000, snzService: 26000 }
    }, {
      month: 'Mar',
      targets: { hclabInternal: 44000, snzService: 27000 },
      actuals: { hclabInternal: 45000, snzService: 28000 }
    }]
  },
  companyTripProgress: {
    overall: 87.2,
    target: 10000000,
    achieved: 8720000,
    requiredForTrip: 9000000
  }
};

// Transform monthly targets data to chart format
const transformMonthlyTargetsToChartData = (monthlyTargets: MonthlyTargetData[]) => {
  return monthlyTargets.map(item => {
    const chartItem: { month: string; [key: string]: string | number } = { month: item.month };
    
    // Add actual values
    Object.entries(item.actuals).forEach(([key, value]) => {
      chartItem[`${key}_actual`] = value;
    });
    
    // Add target values
    Object.entries(item.targets).forEach(([key, value]) => {
      chartItem[`${key}_target`] = value;
    });
    
    return chartItem;
  });
};

const Sales = () => {
  const [salesData, setSalesData] = useState<SalesData>(defaultSalesData);
  const [isUsingRealData, setIsUsingRealData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>();
  const [selectedProduct, setSelectedProduct] = useState<'urinalysis' | 'fcm' | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
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
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: 0 });

      if (!rows.length) {
        toast.error('The uploaded file is empty.');
        return;
      }

      const requiredCols = [
        'Month',
        'Eclair Target','Eclair Current',
        'Delphic AP Target','Delphic AP Current',
        'Delphic LIS Target','Delphic LIS Current',
        'HCLAB External Target','HCLAB External Current',
        'Urinalysis Instrument Target','Urinalysis Instrument Current',
        'Urinalysis Reagents Target','Urinalysis Reagents Current',
        'Urinalysis Service Target','Urinalysis Service Current',
        'OGT Target','OGT Current',
        'FCM Reagents Target','FCM Reagents Current',
        'FCM Instrument Target','FCM Instrument Current',
        'FCM Service Target','FCM Service Current',
        'HCLAB Internal Target','HCLAB Internal Current',
        'SNZ Service Target','SNZ Service Current'
      ];

      const missing = requiredCols.filter(c => !(c in rows[0]));
      if (missing.length) {
        toast.error(`Missing columns: ${missing.slice(0,4).join(', ')}${missing.length>4?'...':''}`);
        return;
      }

      // Monthly Targets - Health IT
      const mt_external_health_it = rows.map(r => ({
        month: String(r['Month']),
        targets: {
          eclair: Number(r['Eclair Target']) || 0,
          delphicAP: Number(r['Delphic AP Target']) || 0,
          delphicLIS: Number(r['Delphic LIS Target']) || 0,
          hclabExternal: Number(r['HCLAB External Target']) || 0,
        },
        actuals: {
          eclair: Number(r['Eclair Current']) || 0,
          delphicAP: Number(r['Delphic AP Current']) || 0,
          delphicLIS: Number(r['Delphic LIS Current']) || 0,
          hclabExternal: Number(r['HCLAB External Current']) || 0,
        }
      }));

      // Monthly Targets - IVD (aggregate breakdown to totals)
      const mt_external_ivd = rows.map(r => {
        const ur_t = (Number(r['Urinalysis Instrument Target']) || 0) + (Number(r['Urinalysis Reagents Target']) || 0) + (Number(r['Urinalysis Service Target']) || 0);
        const ur_a = (Number(r['Urinalysis Instrument Current']) || 0) + (Number(r['Urinalysis Reagents Current']) || 0) + (Number(r['Urinalysis Service Current']) || 0);
        const fcm_t = (Number(r['FCM Reagents Target']) || 0) + (Number(r['FCM Instrument Target']) || 0) + (Number(r['FCM Service Target']) || 0);
        const fcm_a = (Number(r['FCM Reagents Current']) || 0) + (Number(r['FCM Instrument Current']) || 0) + (Number(r['FCM Service Current']) || 0);
        return {
          month: String(r['Month']),
          targets: {
            urinalysis: ur_t,
            ogt: Number(r['OGT Target']) || 0,
            fcm: fcm_t,
          },
          actuals: {
            urinalysis: ur_a,
            ogt: Number(r['OGT Current']) || 0,
            fcm: fcm_a,
          }
        };
      });

      // Monthly Targets - Internal
      const mt_internal = rows.map(r => ({
        month: String(r['Month']),
        targets: {
          hclabInternal: Number(r['HCLAB Internal Target']) || 0,
          snzService: Number(r['SNZ Service Target']) || 0,
        },
        actuals: {
          hclabInternal: Number(r['HCLAB Internal Current']) || 0,
          snzService: Number(r['SNZ Service Current']) || 0,
        }
      }));

      // Monthly actuals for other components
      const monthlyData = {
        external_health_it: rows.map(r => ({
          month: String(r['Month']),
          eclair: Number(r['Eclair Current']) || 0,
          delphicAP: Number(r['Delphic AP Current']) || 0,
          delphicLIS: Number(r['Delphic LIS Current']) || 0,
          hclabExternal: Number(r['HCLAB External Current']) || 0,
        })),
        external_ivd: rows.map(r => ({
          month: String(r['Month']),
          urinalysis: (Number(r['Urinalysis Instrument Current']) || 0) + (Number(r['Urinalysis Reagents Current']) || 0) + (Number(r['Urinalysis Service Current']) || 0),
          ogt: Number(r['OGT Current']) || 0,
          fcm: (Number(r['FCM Reagents Current']) || 0) + (Number(r['FCM Instrument Current']) || 0) + (Number(r['FCM Service Current']) || 0),
        })),
        internal: rows.map(r => ({
          month: String(r['Month']),
          hclabInternal: Number(r['HCLAB Internal Current']) || 0,
          snzService: Number(r['SNZ Service Current']) || 0,
        })),
      } as SalesData['monthlyData'];

      const sum = (arr: number[]) => arr.reduce((a, b) => a + (Number(b) || 0), 0);
      const total = (arrObjs: any[], key: string) => arrObjs.reduce((a, r) => a + (Number(r[key]) || 0), 0);
      const ytd = {
        eclair: { a: total(monthlyData.external_health_it, 'eclair'), t: mt_external_health_it.reduce((a, r) => a + r.targets.eclair, 0) },
        delphicAP: { a: total(monthlyData.external_health_it, 'delphicAP'), t: mt_external_health_it.reduce((a, r) => a + r.targets.delphicAP, 0) },
        delphicLIS: { a: total(monthlyData.external_health_it, 'delphicLIS'), t: mt_external_health_it.reduce((a, r) => a + r.targets.delphicLIS, 0) },
        hclabExternal: { a: total(monthlyData.external_health_it, 'hclabExternal'), t: mt_external_health_it.reduce((a, r) => a + r.targets.hclabExternal, 0) },
        urinalysis: { a: total(monthlyData.external_ivd, 'urinalysis'), t: mt_external_ivd.reduce((a, r) => a + r.targets.urinalysis, 0) },
        ogt: { a: total(monthlyData.external_ivd, 'ogt'), t: mt_external_ivd.reduce((a, r) => a + r.targets.ogt, 0) },
        fcm: { a: total(monthlyData.external_ivd, 'fcm'), t: mt_external_ivd.reduce((a, r) => a + r.targets.fcm, 0) },
        hclabInternal: { a: total(monthlyData.internal, 'hclabInternal'), t: mt_internal.reduce((a, r) => a + r.targets.hclabInternal, 0) },
        snzService: { a: total(monthlyData.internal, 'snzService'), t: mt_internal.reduce((a, r) => a + r.targets.snzService, 0) },
        // breakdowns
        urinalysis_instrument: { a: sum(rows.map(r => Number(r['Urinalysis Instrument Current']) || 0)), t: sum(rows.map(r => Number(r['Urinalysis Instrument Target']) || 0)) },
        urinalysis_reagents: { a: sum(rows.map(r => Number(r['Urinalysis Reagents Current']) || 0)), t: sum(rows.map(r => Number(r['Urinalysis Reagents Target']) || 0)) },
        urinalysis_service: { a: sum(rows.map(r => Number(r['Urinalysis Service Current']) || 0)), t: sum(rows.map(r => Number(r['Urinalysis Service Target']) || 0)) },
        fcm_reagents: { a: sum(rows.map(r => Number(r['FCM Reagents Current']) || 0)), t: sum(rows.map(r => Number(r['FCM Reagents Target']) || 0)) },
        fcm_instrument: { a: sum(rows.map(r => Number(r['FCM Instrument Current']) || 0)), t: sum(rows.map(r => Number(r['FCM Instrument Target']) || 0)) },
        fcm_service: { a: sum(rows.map(r => Number(r['FCM Service Current']) || 0)), t: sum(rows.map(r => Number(r['FCM Service Target']) || 0)) },
      };

      const pct = (a: number, t: number) => (t > 0 ? +(((a / t) * 100).toFixed(2)) : 0);

      const newSalesData: SalesData = {
        salesMetrics: {
          eclair: { current: ytd.eclair.a, target: ytd.eclair.t, achieved: pct(ytd.eclair.a, ytd.eclair.t) },
          delphicAP: { current: ytd.delphicAP.a, target: ytd.delphicAP.t, achieved: pct(ytd.delphicAP.a, ytd.delphicAP.t) },
          delphicLIS: { current: ytd.delphicLIS.a, target: ytd.delphicLIS.t, achieved: pct(ytd.delphicLIS.a, ytd.delphicLIS.t) },
          hclabExternal: { current: ytd.hclabExternal.a, target: ytd.hclabExternal.t, achieved: pct(ytd.hclabExternal.a, ytd.hclabExternal.t) },
          urinalysis: {
            total: { current: ytd.urinalysis.a, target: ytd.urinalysis.t, achieved: pct(ytd.urinalysis.a, ytd.urinalysis.t) },
            breakdown: {
              instrument: { current: ytd.urinalysis_instrument.a, target: ytd.urinalysis_instrument.t, achieved: pct(ytd.urinalysis_instrument.a, ytd.urinalysis_instrument.t) },
              reagents: { current: ytd.urinalysis_reagents.a, target: ytd.urinalysis_reagents.t, achieved: pct(ytd.urinalysis_reagents.a, ytd.urinalysis_reagents.t) },
              service: { current: ytd.urinalysis_service.a, target: ytd.urinalysis_service.t, achieved: pct(ytd.urinalysis_service.a, ytd.urinalysis_service.t) },
            }
          },
          ogt: { current: ytd.ogt.a, target: ytd.ogt.t, achieved: pct(ytd.ogt.a, ytd.ogt.t) },
          fcm: {
            total: { current: ytd.fcm.a, target: ytd.fcm.t, achieved: pct(ytd.fcm.a, ytd.fcm.t) },
            breakdown: {
              reagents: { current: ytd.fcm_reagents.a, target: ytd.fcm_reagents.t, achieved: pct(ytd.fcm_reagents.a, ytd.fcm_reagents.t) },
              instrument: { current: ytd.fcm_instrument.a, target: ytd.fcm_instrument.t, achieved: pct(ytd.fcm_instrument.a, ytd.fcm_instrument.t) },
              service: { current: ytd.fcm_service.a, target: ytd.fcm_service.t, achieved: pct(ytd.fcm_service.a, ytd.fcm_service.t) },
            }
          },
          hclabInternal: { current: ytd.hclabInternal.a, target: ytd.hclabInternal.t, achieved: pct(ytd.hclabInternal.a, ytd.hclabInternal.t) },
          snzService: { current: ytd.snzService.a, target: ytd.snzService.t, achieved: pct(ytd.snzService.a, ytd.snzService.t) },
        },
        monthlyData,
        monthlyTargets: {
          external_health_it: mt_external_health_it,
          external_ivd: mt_external_ivd,
          internal: mt_internal,
        },
        companyTripProgress: {
          overall: pct(
            ytd.eclair.a + ytd.delphicAP.a + ytd.delphicLIS.a + ytd.hclabExternal.a +
            ytd.urinalysis.a + ytd.ogt.a + ytd.fcm.a + ytd.hclabInternal.a + ytd.snzService.a,
            ytd.eclair.t + ytd.delphicAP.t + ytd.delphicLIS.t + ytd.hclabExternal.t +
            ytd.urinalysis.t + ytd.ogt.t + ytd.fcm.t + ytd.hclabInternal.t + ytd.snzService.t
          ),
          target: ytd.eclair.t + ytd.delphicAP.t + ytd.delphicLIS.t + ytd.hclabExternal.t +
                  ytd.urinalysis.t + ytd.ogt.t + ytd.fcm.t + ytd.hclabInternal.t + ytd.snzService.t,
          achieved: ytd.eclair.a + ytd.delphicAP.a + ytd.delphicLIS.a + ytd.hclabExternal.a +
                    ytd.urinalysis.a + ytd.ogt.a + ytd.fcm.a + ytd.hclabInternal.a + ytd.snzService.a,
          requiredForTrip: Math.round((ytd.eclair.t + ytd.delphicAP.t + ytd.delphicLIS.t + ytd.hclabExternal.t +
                    ytd.urinalysis.t + ytd.ogt.t + ytd.fcm.t + ytd.hclabInternal.t + ytd.snzService.t) * 0.9),
        }
      };

      setSalesData(newSalesData);
      await saveSalesDataToSupabase(newSalesData);
      setIsUsingRealData(true);
      setLastUpdated(new Date());
      toast.success(`Uploaded ${file.name}: ${rows.length} rows processed`);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file. Please check the template format.');
    }
  };
  const downloadTemplate = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const templateData = months.map(month => ({
      Month: month,
      // Health IT
      'Eclair Target': 83333,
      'Eclair Current': 0,
      'Delphic AP Target': 66667,
      'Delphic AP Current': 0,
      'Delphic LIS Target': 91667,
      'Delphic LIS Current': 0,
      'HCLAB External Target': 75000,
      'HCLAB External Current': 0,
      // IVD
      'Urinalysis Instrument Target': 41667,
      'Urinalysis Instrument Current': 0,
      'Urinalysis Reagents Target': 58333,
      'Urinalysis Reagents Current': 0,
      'Urinalysis Service Target': 16667,
      'Urinalysis Service Current': 0,
      'OGT Target': 50000,
      'OGT Current': 0,
      'FCM Reagents Target': 41667,
      'FCM Reagents Current': 0,
      'FCM Instrument Target': 29167,
      'FCM Instrument Current': 0,
      'FCM Service Target': 12500,
      'FCM Service Current': 0,
      // Internal
      'HCLAB Internal Target': 41667,
      'HCLAB Internal Current': 0,
      'SNZ Service Target': 25000,
      'SNZ Service Current': 0
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Template');
    XLSX.writeFile(workbook, 'sales_template.xlsx');
    toast.success('12-month template downloaded successfully!');
  };
  const handleProductClick = (productType: 'urinalysis' | 'fcm') => {
    setSelectedProduct(productType);
    setModalOpen(true);
  };

  const getProductModalData = () => {
    if (!selectedProduct) return null;

    const productData = salesData.salesMetrics[selectedProduct];
    const productName = selectedProduct === 'urinalysis' ? 'Urinalysis' : 'FCM';
    
    // Generate monthly data for the modal
    const monthlyData = salesData.monthlyData.external_ivd.map(item => ({
      month: item.month,
      instruments: selectedProduct === 'urinalysis' 
        ? Number(item.urinalysis) * 0.33 // Approximate breakdown
        : Number(item.fcm) * 0.36,
      reagents: selectedProduct === 'urinalysis' 
        ? Number(item.urinalysis) * 0.50 
        : Number(item.fcm) * 0.51,
      service: selectedProduct === 'urinalysis' 
        ? Number(item.urinalysis) * 0.17 
        : Number(item.fcm) * 0.13,
      total: selectedProduct === 'urinalysis' ? Number(item.urinalysis) : Number(item.fcm)
    }));

    return {
      productName,
      productType: selectedProduct,
      totalSales: productData.total.current,
      target: productData.total.target,
      breakdown: {
        instruments: productData.breakdown.instrument?.current || 0,
        reagents: productData.breakdown.reagents?.current || 0,
        service: productData.breakdown.service?.current || 0,
      },
      monthlyData,
      trend: 3.5 // Default trend value
    };
  };

  const companyTripPercentage = Math.min(salesData.companyTripProgress.achieved / salesData.companyTripProgress.requiredForTrip * 100, 100);
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-pulse-slow" />
      
      <div className="relative z-10">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
              {/* Left: Logo and Navigation */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex-shrink-0">
                  <img 
                    src="/lovable-uploads/c2503f0e-4514-4e32-b540-b9ea2e9d0512.png" 
                    alt="Sysmex - Together for a better healthcare journey" 
                    className="h-8 lg:h-10 w-auto object-contain"
                  />
                </div>
                
                {/* Navigation Bar */}
                <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-lg border">
                  <Link to="/">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-2 lg:px-3 py-2 h-auto hover:bg-primary/5 transition-all duration-200"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1 lg:mr-2 text-muted-foreground" />
                      <span className="text-xs lg:text-sm">Customer Satisfaction</span>
                    </Button>
                  </Link>
                  <div className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 bg-primary/10 border border-primary/20 rounded-md">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-xs lg:text-sm font-medium text-primary">Sales Performance</span>
                  </div>
                </div>
              </div>
              
              {/* Center: Dashboard Title */}
              <div className="flex-1 text-center">
                <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Sales Performance Dashboard
                </h1>
              </div>
              
              {/* Right: Data Source Badge */}
              <div className="flex items-center justify-end flex-shrink-0">
                <DataSourceBadge source={isUsingRealData ? 'excel' : 'default'} isReal={isUsingRealData} lastUpdated={lastUpdated} />
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
              <IsometricAdventureProgress currentProgress={companyTripPercentage} target={salesData.companyTripProgress.target} achieved={salesData.companyTripProgress.achieved} requiredForTrip={salesData.companyTripProgress.requiredForTrip} />
            </CardContent>
          </Card>

          {/* External Sales - Health IT */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-blue-600" />
                External Sales - Health IT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <RadialMetricCard 
                  title="Eclair" 
                  currentScore={salesData.salesMetrics.eclair.achieved} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, salesData.salesMetrics.eclair.achieved * 1.1)} 
                  trend={2.5} 
                  icon={<Monitor className="h-4 w-4" />} 
                />
                <RadialMetricCard 
                  title="Delphic AP" 
                  currentScore={salesData.salesMetrics.delphicAP.achieved} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, salesData.salesMetrics.delphicAP.achieved * 1.1)} 
                  trend={1.8} 
                  icon={<Microscope className="h-4 w-4" />} 
                />
                <RadialMetricCard 
                  title="Delphic LIS" 
                  currentScore={salesData.salesMetrics.delphicLIS.achieved} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, salesData.salesMetrics.delphicLIS.achieved * 1.1)} 
                  trend={3.1} 
                  icon={<TestTube className="h-4 w-4" />} 
                />
                <RadialMetricCard 
                  title="HCLAB External" 
                  currentScore={salesData.salesMetrics.hclabExternal.achieved} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, salesData.salesMetrics.hclabExternal.achieved * 1.1)} 
                  trend={4.2} 
                  icon={<Building className="h-4 w-4" />} 
                />
              </div>
            </CardContent>
          </Card>

          {/* External Sales - IVD */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <TestTube className="h-5 w-5 text-green-600" />
                External Sales - IVD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AchievementMetricCard 
                  title="Urinalysis" 
                  currentScore={salesData.salesMetrics.urinalysis.total.achieved} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, salesData.salesMetrics.urinalysis.total.achieved * 1.1)} 
                  trend={3.8} 
                  icon={<Beaker className="h-4 w-4" />} 
                  onClick={() => handleProductClick('urinalysis')}
                />
                <AchievementMetricCard 
                  title="OGT" 
                  currentScore={salesData.salesMetrics.ogt.achieved} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, salesData.salesMetrics.ogt.achieved * 1.1)} 
                  trend={5.5} 
                  icon={<TestTube className="h-4 w-4" />} 
                />
                <AchievementMetricCard 
                  title="FCM" 
                  currentScore={salesData.salesMetrics.fcm.total.achieved} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, salesData.salesMetrics.fcm.total.achieved * 1.1)} 
                  trend={2.9} 
                  icon={<Microscope className="h-4 w-4" />}
                  onClick={() => handleProductClick('fcm')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Internal Sales */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Building className="h-5 w-5 text-purple-600" />
                Internal Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GaugeMetricCard 
                  title="HCLAB Internal" 
                  currentScore={salesData.salesMetrics.hclabInternal.achieved} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, salesData.salesMetrics.hclabInternal.achieved * 1.1)} 
                  trend={6.1} 
                  icon={<Building className="h-4 w-4" />} 
                />
                <GaugeMetricCard 
                  title="SNZ Service" 
                  currentScore={salesData.salesMetrics.snzService.achieved} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, salesData.salesMetrics.snzService.achieved * 1.1)} 
                  trend={4.7} 
                  icon={<Headphones className="h-4 w-4" />} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Sales Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-blue-600" />
                  Health IT Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SalesTrendChart 
                  data={transformMonthlyTargetsToChartData(salesData.monthlyTargets.external_health_it || [])}
                  title="Health IT - Actual vs Target"
                  showActualVsTarget={true}
                />
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-4 w-4 text-green-600" />
                  IVD Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SalesTrendChart 
                  data={transformMonthlyTargetsToChartData(salesData.monthlyTargets.external_ivd || [])}
                  title="IVD - Actual vs Target"
                  showActualVsTarget={true}
                />
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-purple-600" />
                  Internal Sales Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SalesTrendChart 
                  data={transformMonthlyTargetsToChartData(salesData.monthlyTargets.internal || [])}
                  title="Internal Sales - Actual vs Target"
                  showActualVsTarget={true}
                />
              </CardContent>
            </Card>
          </div>

          {/* Data Management Section - Moved to Bottom */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={downloadTemplate} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download 12-Month Template
                </Button>
                <div className="relative">
                  <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <Button variant="default" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Sales Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Product Detail Modal */}
        {modalOpen && selectedProduct && getProductModalData() && (
          <ProductDetailModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            {...getProductModalData()!}
          />
        )}
      </div>
    </div>;
};
export default Sales;