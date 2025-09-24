import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Upload, Trophy, Monitor, TestTube, Building, Microscope, Beaker, Wrench, Headphones, Users } from 'lucide-react';
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
import { calculateYTDAnalysis, calculateTrend, FY_MONTHS, FY_MONTHS_SHORT } from '@/utils/ytdCalculations';
import * as XLSX from 'xlsx';
const defaultSalesData: SalesData = {
  salesMetrics: {
    eclair: {
      current: 2125000, // 5 months FY progress (Apr-Aug)
      target: 5100000, // Full FY target
      achieved: 83.33 // YTD achievement vs expected YTD
    },
    delphicAP: {
      current: 1625000,
      target: 4800000,
      achieved: 81.25
    },
    delphicLIS: {
      current: 2300000,
      target: 6600000,
      achieved: 83.64
    },
    hclabExternal: {
      current: 1950000,
      target: 5400000,
      achieved: 86.67
    },
    urinalysis: {
      total: {
        current: 3000000,
        target: 8400000,
        achieved: 85.71
      },
      breakdown: {
        instrument: {
          current: 1000000,
          target: 3000000,
          achieved: 80
        },
        reagents: {
          current: 1500000,
          target: 4200000,
          achieved: 85.71
        },
        service: {
          current: 500000,
          target: 1200000,
          achieved: 100
        }
      }
    },
    ogt: { // Only reagents for OGT
      current: 1375000,
      target: 3600000,
      achieved: 91.67
    },
    fcm: {
      total: {
        current: 2225000,
        target: 6000000,
        achieved: 89
      },
      breakdown: {
        reagents: {
          current: 1125000,
          target: 3000000,
          achieved: 90
        },
        instrument: {
          current: 800000,
          target: 2100000,
          achieved: 91.43
        },
        service: {
          current: 300000,
          target: 900000,
          achieved: 80
        }
      }
    },
    hclabInternal: {
      current: 1125000,
      target: 3000000,
      achieved: 90
    },
    snzInternal: { // Renamed from snzService
      current: 700000,
      target: 1800000,
      achieved: 93.33
    }
  },
  monthlyData: {
    external_health_it: [{
      month: 'Apr 2025',
      eclair: 400000,
      delphicAP: 300000,
      delphicLIS: 430000,
      hclabExternal: 370000
    }, {
      month: 'May 2025',
      eclair: 410000,
      delphicAP: 310000,
      delphicLIS: 440000,
      hclabExternal: 380000
    }, {
      month: 'Jun 2025',
      eclair: 420000,
      delphicAP: 320000,
      delphicLIS: 450000,
      hclabExternal: 390000
    }, {
      month: 'Jul 2025',
      eclair: 435000,
      delphicAP: 335000,
      delphicLIS: 470000,
      hclabExternal: 400000
    }, {
      month: 'Aug 2025',
      eclair: 460000,
      delphicAP: 360000,
      delphicLIS: 510000,
      hclabExternal: 410000
    }],
    external_ivd: [{
      month: 'Apr 2025',
      urinalysis: 550000,
      ogt: 250000,
      fcm: 400000
    }, {
      month: 'May 2025',
      urinalysis: 575000,
      ogt: 260000,
      fcm: 420000
    }, {
      month: 'Jun 2025',
      urinalysis: 600000,
      ogt: 275000,
      fcm: 445000
    }, {
      month: 'Jul 2025',
      urinalysis: 625000,
      ogt: 290000,
      fcm: 470000
    }, {
      month: 'Aug 2025',
      urinalysis: 650000,
      ogt: 300000,
      fcm: 490000
    }],
    internal: [{
      month: 'Apr 2025',
      hclabInternal: 200000,
      snzInternal: 125000
    }, {
      month: 'May 2025',
      hclabInternal: 210000,
      snzInternal: 130000
    }, {
      month: 'Jun 2025',
      hclabInternal: 220000,
      snzInternal: 135000
    }, {
      month: 'Jul 2025',
      hclabInternal: 235000,
      snzInternal: 145000
    }, {
      month: 'Aug 2025',
      hclabInternal: 260000,
      snzInternal: 165000
    }]
  },
  monthlyTargets: {
    external_health_it: FY_MONTHS_SHORT.slice(0, 5).map((month, index) => ({
      month: FY_MONTHS[index],
      targets: { 
        eclair: 425000, 
        delphicAP: 400000, 
        delphicLIS: 550000, 
        hclabExternal: 450000 
      },
      actuals: { 
        eclair: [400000, 410000, 420000, 435000, 460000][index], 
        delphicAP: [300000, 310000, 320000, 335000, 360000][index], 
        delphicLIS: [430000, 440000, 450000, 470000, 510000][index], 
        hclabExternal: [370000, 380000, 390000, 400000, 410000][index] 
      }
    })),
    external_ivd: FY_MONTHS_SHORT.slice(0, 5).map((month, index) => ({
      month: FY_MONTHS[index],
      targets: { 
        urinalysis: 700000, 
        ogt: 300000, 
        fcm: 500000 
      },
      actuals: { 
        urinalysis: [550000, 575000, 600000, 625000, 650000][index], 
        ogt: [250000, 260000, 275000, 290000, 300000][index], 
        fcm: [400000, 420000, 445000, 470000, 490000][index] 
      }
    })),
    internal: FY_MONTHS_SHORT.slice(0, 5).map((month, index) => ({
      month: FY_MONTHS[index],
      targets: { 
        hclabInternal: 250000, 
        snzInternal: 150000 
      },
      actuals: { 
        hclabInternal: [200000, 210000, 220000, 235000, 260000][index], 
        snzInternal: [125000, 130000, 135000, 145000, 165000][index] 
      }
    }))
  },
  companyTripProgress: {
    overall: 87.2,
    target: 50000000, // Full FY target
    achieved: 21800000, // YTD achieved (5 months)
    requiredForTrip: 45000000
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
          
          // Debug: Check if data structure is correct
          console.log('Loaded sales data:', data);
          console.log('SNZ data:', data.salesMetrics.snzInternal);
          
          // Fix any old data structure issues
          if ((data.salesMetrics as any).snzService && !data.salesMetrics.snzInternal) {
            data.salesMetrics.snzInternal = (data.salesMetrics as any).snzService;
            delete (data.salesMetrics as any).snzService;
          }
          
          // Ensure all required properties exist
          const requiredMetrics = ['eclair', 'delphicAP', 'delphicLIS', 'hclabExternal', 'urinalysis', 'ogt', 'fcm', 'hclabInternal', 'snzInternal'];
          for (const metric of requiredMetrics) {
            if (!data.salesMetrics[metric]) {
              console.warn(`Missing metric: ${metric}, using default`);
              data.salesMetrics[metric] = defaultSalesData.salesMetrics[metric];
            }
          }
          
          setSalesData(data);
          setIsUsingRealData(true);
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error('Error loading sales data:', error);
        // Fallback to default data on error
        setSalesData(defaultSalesData);
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
        'OGT Target','OGT Current', // Only reagents for OGT
        'FCM Reagents Target','FCM Reagents Current',
        'FCM Instrument Target','FCM Instrument Current',
        'FCM Service Target','FCM Service Current',
        'HCLAB Internal Target','HCLAB Internal Current',
        'SNZ Internal Target','SNZ Internal Current' // Renamed from SNZ Service
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
          snzInternal: Number(r['SNZ Internal Target']) || 0,
        },
        actuals: {
          hclabInternal: Number(r['HCLAB Internal Current']) || 0,
          snzInternal: Number(r['SNZ Internal Current']) || 0,
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
          snzInternal: Number(r['SNZ Internal Current']) || 0,
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
        snzInternal: { a: total(monthlyData.internal, 'snzInternal'), t: mt_internal.reduce((a, r) => a + r.targets.snzInternal, 0) },
        // breakdowns
        urinalysis_instrument: { a: sum(rows.map(r => Number(r['Urinalysis Instrument Current']) || 0)), t: sum(rows.map(r => Number(r['Urinalysis Instrument Target']) || 0)) },
        urinalysis_reagents: { a: sum(rows.map(r => Number(r['Urinalysis Reagents Current']) || 0)), t: sum(rows.map(r => Number(r['Urinalysis Reagents Target']) || 0)) },
        urinalysis_service: { a: sum(rows.map(r => Number(r['Urinalysis Service Current']) || 0)), t: sum(rows.map(r => Number(r['Urinalysis Service Target']) || 0)) },
        fcm_reagents: { a: sum(rows.map(r => Number(r['FCM Reagents Current']) || 0)), t: sum(rows.map(r => Number(r['FCM Reagents Target']) || 0)) },
        fcm_instrument: { a: sum(rows.map(r => Number(r['FCM Instrument Current']) || 0)), t: sum(rows.map(r => Number(r['FCM Instrument Target']) || 0)) },
        fcm_service: { a: sum(rows.map(r => Number(r['FCM Service Current']) || 0)), t: sum(rows.map(r => Number(r['FCM Service Target']) || 0)) },
      };

      // Helper function for YTD achievement calculation
      const calculateYTDAchievement = (actualYTD: number, annualTarget: number, monthsCompleted: number = rows.length): number => {
        const expectedYTD = (annualTarget / 12) * monthsCompleted;
        return expectedYTD > 0 ? +((actualYTD / expectedYTD) * 100).toFixed(2) : 0;
      };

      const pct = (a: number, t: number) => (t > 0 ? +(((a / t) * 100).toFixed(2)) : 0);

      const newSalesData: SalesData = {
        salesMetrics: {
          eclair: { current: ytd.eclair.a, target: ytd.eclair.t, achieved: calculateYTDAchievement(ytd.eclair.a, ytd.eclair.t) },
          delphicAP: { current: ytd.delphicAP.a, target: ytd.delphicAP.t, achieved: calculateYTDAchievement(ytd.delphicAP.a, ytd.delphicAP.t) },
          delphicLIS: { current: ytd.delphicLIS.a, target: ytd.delphicLIS.t, achieved: calculateYTDAchievement(ytd.delphicLIS.a, ytd.delphicLIS.t) },
          hclabExternal: { current: ytd.hclabExternal.a, target: ytd.hclabExternal.t, achieved: calculateYTDAchievement(ytd.hclabExternal.a, ytd.hclabExternal.t) },
          urinalysis: {
            total: { current: ytd.urinalysis.a, target: ytd.urinalysis.t, achieved: calculateYTDAchievement(ytd.urinalysis.a, ytd.urinalysis.t) },
            breakdown: {
              instrument: { current: ytd.urinalysis_instrument.a, target: ytd.urinalysis_instrument.t, achieved: calculateYTDAchievement(ytd.urinalysis_instrument.a, ytd.urinalysis_instrument.t) },
              reagents: { current: ytd.urinalysis_reagents.a, target: ytd.urinalysis_reagents.t, achieved: calculateYTDAchievement(ytd.urinalysis_reagents.a, ytd.urinalysis_reagents.t) },
              service: { current: ytd.urinalysis_service.a, target: ytd.urinalysis_service.t, achieved: calculateYTDAchievement(ytd.urinalysis_service.a, ytd.urinalysis_service.t) },
            }
          },
          ogt: { current: ytd.ogt.a, target: ytd.ogt.t, achieved: calculateYTDAchievement(ytd.ogt.a, ytd.ogt.t) },
          fcm: {
            total: { current: ytd.fcm.a, target: ytd.fcm.t, achieved: calculateYTDAchievement(ytd.fcm.a, ytd.fcm.t) },
            breakdown: {
              reagents: { current: ytd.fcm_reagents.a, target: ytd.fcm_reagents.t, achieved: calculateYTDAchievement(ytd.fcm_reagents.a, ytd.fcm_reagents.t) },
              instrument: { current: ytd.fcm_instrument.a, target: ytd.fcm_instrument.t, achieved: calculateYTDAchievement(ytd.fcm_instrument.a, ytd.fcm_instrument.t) },
              service: { current: ytd.fcm_service.a, target: ytd.fcm_service.t, achieved: calculateYTDAchievement(ytd.fcm_service.a, ytd.fcm_service.t) },
            }
          },
          hclabInternal: { current: ytd.hclabInternal.a, target: ytd.hclabInternal.t, achieved: calculateYTDAchievement(ytd.hclabInternal.a, ytd.hclabInternal.t) },
          snzInternal: { current: ytd.snzInternal.a, target: ytd.snzInternal.t, achieved: calculateYTDAchievement(ytd.snzInternal.a, ytd.snzInternal.t) },
        },
        monthlyData,
        monthlyTargets: {
          external_health_it: mt_external_health_it,
          external_ivd: mt_external_ivd,
          internal: mt_internal,
        },
        companyTripProgress: {
          overall: calculateYTDAchievement(
            ytd.eclair.a + ytd.delphicAP.a + ytd.delphicLIS.a + ytd.hclabExternal.a +
            ytd.urinalysis.a + ytd.ogt.a + ytd.fcm.a + ytd.hclabInternal.a + ytd.snzInternal.a,
            ytd.eclair.t + ytd.delphicAP.t + ytd.delphicLIS.t + ytd.hclabExternal.t +
            ytd.urinalysis.t + ytd.ogt.t + ytd.fcm.t + ytd.hclabInternal.t + ytd.snzInternal.t
          ),
          target: ytd.eclair.t + ytd.delphicAP.t + ytd.delphicLIS.t + ytd.hclabExternal.t +
                  ytd.urinalysis.t + ytd.ogt.t + ytd.fcm.t + ytd.hclabInternal.t + ytd.snzInternal.t,
          achieved: ytd.eclair.a + ytd.delphicAP.a + ytd.delphicLIS.a + ytd.hclabExternal.a +
                    ytd.urinalysis.a + ytd.ogt.a + ytd.fcm.a + ytd.hclabInternal.a + ytd.snzInternal.a,
          requiredForTrip: Math.round((ytd.eclair.t + ytd.delphicAP.t + ytd.delphicLIS.t + ytd.hclabExternal.t +
                    ytd.urinalysis.t + ytd.ogt.t + ytd.fcm.t + ytd.hclabInternal.t + ytd.snzInternal.t) * 0.9),
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
    // Use Financial Year months (Apr 2025 - Mar 2026)
    const templateData = FY_MONTHS.map(month => ({
      Month: month,
      // Health IT
      'Eclair Target': 425000, // Annual FY target / 12
      'Eclair Current': 0,
      'Delphic AP Target': 400000,
      'Delphic AP Current': 0,
      'Delphic LIS Target': 550000,
      'Delphic LIS Current': 0,
      'HCLAB External Target': 450000,
      'HCLAB External Current': 0,
      // IVD - Urinalysis (with breakdowns)
      'Urinalysis Instrument Target': 250000,
      'Urinalysis Instrument Current': 0,
      'Urinalysis Reagents Target': 350000,
      'Urinalysis Reagents Current': 0,
      'Urinalysis Service Target': 100000,
      'Urinalysis Service Current': 0,
      // IVD - OGT (Only reagents)
      'OGT Target': 300000,
      'OGT Current': 0,
      // IVD - FCM (with breakdowns)
      'FCM Reagents Target': 250000,
      'FCM Reagents Current': 0,
      'FCM Instrument Target': 175000,
      'FCM Instrument Current': 0,
      'FCM Service Target': 75000,
      'FCM Service Current': 0,
      // Internal Sales
      'HCLAB Internal Target': 250000,
      'HCLAB Internal Current': 0,
      'SNZ Internal Target': 150000, // Renamed from SNZ Service
      'SNZ Internal Current': 0
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Template FY25-26');
    XLSX.writeFile(workbook, 'sales_template_FY25-26.xlsx');
    toast.success('FY25-26 template downloaded successfully!');
  };
  const handleProductClick = (productType: 'urinalysis' | 'fcm') => {
    setSelectedProduct(productType);
    setModalOpen(true);
  };

  const getProductModalData = () => {
    if (!selectedProduct) return null;

    const productData = salesData.salesMetrics[selectedProduct];
    const productName = selectedProduct === 'urinalysis' ? 'Urinalysis' : 'FCM';
    
    // Use actual breakdown data from Excel with targets
    const monthlyData = salesData.monthlyTargets.external_ivd.map(item => {
      const prefix = selectedProduct === 'urinalysis' ? 'urinalysis' : 'fcm';
      
      // Calculate breakdown ratios from the current breakdown data
      const instrumentRatio = productData.breakdown.instrument?.current / productData.total.current || 0;
      const reagentRatio = productData.breakdown.reagents?.current / productData.total.current || 0;
      const serviceRatio = productData.breakdown.service?.current / productData.total.current || 0;
      
      const targetInstrumentRatio = productData.breakdown.instrument?.target / productData.total.target || 0;
      const targetReagentRatio = productData.breakdown.reagents?.target / productData.total.target || 0;
      const targetServiceRatio = productData.breakdown.service?.target / productData.total.target || 0;
      
      return {
        month: item.month,
        instruments_actual: item.actuals[prefix] * instrumentRatio,
        instruments_target: item.targets[prefix] * targetInstrumentRatio,
        reagents_actual: item.actuals[prefix] * reagentRatio,
        reagents_target: item.targets[prefix] * targetReagentRatio,
        service_actual: item.actuals[prefix] * serviceRatio,
        service_target: item.targets[prefix] * targetServiceRatio,
        total_actual: item.actuals[prefix],
        total_target: item.targets[prefix]
      };
    });

    return {
      productName,
      productType: selectedProduct,
      totalSales: productData.total.current,
      target: productData.total.target,
      breakdown: {
        instruments: {
          current: productData.breakdown.instrument?.current || 0,
          target: productData.breakdown.instrument?.target || 0,
          achieved: productData.breakdown.instrument?.achieved || 0
        },
        reagents: {
          current: productData.breakdown.reagents?.current || 0,
          target: productData.breakdown.reagents?.target || 0,
          achieved: productData.breakdown.reagents?.achieved || 0
        },
        service: {
          current: productData.breakdown.service?.current || 0,
          target: productData.breakdown.service?.target || 0,
          achieved: productData.breakdown.service?.achieved || 0
        }
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
                  <Link to="/climate">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-2 lg:px-3 py-2 h-auto hover:bg-primary/5 transition-all duration-200"
                    >
                      <Users className="h-4 w-4 mr-1 lg:mr-2 text-muted-foreground" />
                      <span className="text-xs lg:text-sm">Climate Survey</span>
                    </Button>
                  </Link>
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
                  actualValue={salesData.salesMetrics.eclair.current}
                  targetValue={salesData.salesMetrics.eclair.target}
                  showActualValues={true}
                />
                <RadialMetricCard 
                  title="Delphic AP" 
                  currentScore={salesData.salesMetrics.delphicAP.achieved} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, salesData.salesMetrics.delphicAP.achieved * 1.1)} 
                  trend={1.8} 
                  icon={<Microscope className="h-4 w-4" />}
                  actualValue={salesData.salesMetrics.delphicAP.current}
                  targetValue={salesData.salesMetrics.delphicAP.target}
                  showActualValues={true}
                />
                <RadialMetricCard 
                  title="Delphic LIS" 
                  currentScore={salesData.salesMetrics.delphicLIS.achieved} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, salesData.salesMetrics.delphicLIS.achieved * 1.1)} 
                  trend={3.1} 
                  icon={<TestTube className="h-4 w-4" />}
                  actualValue={salesData.salesMetrics.delphicLIS.current}
                  targetValue={salesData.salesMetrics.delphicLIS.target}
                  showActualValues={true}
                />
                <RadialMetricCard 
                  title="HCLAB External" 
                  currentScore={salesData.salesMetrics.hclabExternal?.achieved || 0} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, (salesData.salesMetrics.hclabExternal?.achieved || 0) * 1.1)} 
                  trend={4.2} 
                  icon={<Building className="h-4 w-4" />}
                  actualValue={salesData.salesMetrics.hclabExternal?.current || 0}
                  targetValue={salesData.salesMetrics.hclabExternal?.target || 0}
                  showActualValues={true}
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
                  currentScore={salesData.salesMetrics.urinalysis?.total?.achieved || 0} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, (salesData.salesMetrics.urinalysis?.total?.achieved || 0) * 1.1)} 
                  trend={3.8} 
                  icon={<Beaker className="h-4 w-4" />}
                  onClick={() => handleProductClick('urinalysis')}
                  actualValue={salesData.salesMetrics.urinalysis?.total?.current || 0}
                  targetValue={salesData.salesMetrics.urinalysis?.total?.target || 0}
                  showActualValues={true}
                />
                <AchievementMetricCard 
                  title="OGT" 
                  currentScore={salesData.salesMetrics.ogt?.achieved || 0} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, (salesData.salesMetrics.ogt?.achieved || 0) * 1.1)} 
                  trend={5.5} 
                  icon={<Microscope className="h-4 w-4" />}
                  actualValue={salesData.salesMetrics.ogt?.current || 0}
                  targetValue={salesData.salesMetrics.ogt?.target || 0}
                  showActualValues={true}
                />
                <AchievementMetricCard 
                  title="FCM" 
                  currentScore={salesData.salesMetrics.fcm?.total?.achieved || 0} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, (salesData.salesMetrics.fcm?.total?.achieved || 0) * 1.1)} 
                  trend={2.9} 
                  icon={<TestTube className="h-4 w-4" />}
                  onClick={() => handleProductClick('fcm')}
                  actualValue={salesData.salesMetrics.fcm?.total?.current || 0}
                  targetValue={salesData.salesMetrics.fcm?.total?.target || 0}
                  showActualValues={true}
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
                  currentScore={salesData.salesMetrics.hclabInternal?.achieved || 0} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, (salesData.salesMetrics.hclabInternal?.achieved || 0) * 1.1)} 
                  trend={6.1} 
                  icon={<Building className="h-4 w-4" />}
                  actualValue={salesData.salesMetrics.hclabInternal?.current || 0}
                  targetValue={salesData.salesMetrics.hclabInternal?.target || 0}
                  showActualValues={true}
                />
                <GaugeMetricCard 
                  title="SNZ Internal" 
                  currentScore={salesData.salesMetrics.snzInternal?.achieved || 0} 
                  target={100} 
                  maxScore={Math.max(100 * 1.5, (salesData.salesMetrics.snzInternal?.achieved || 0) * 1.1)} 
                  trend={4.7} 
                  icon={<Headphones className="h-4 w-4" />}
                  actualValue={salesData.salesMetrics.snzInternal?.current || 0}
                  targetValue={salesData.salesMetrics.snzInternal?.target || 0}
                  showActualValues={true}
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
                  Download FY25-26 Template
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