import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  Calendar,
  FileText,
  Filter,
  Globe2,
  LayoutDashboard,
  List,
  Search,
  Settings,
  Smartphone,
  Tablet,
  Laptop,
  TrendingDown,
  TrendingUp,
  Sun,
  Moon,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import WorldMap from './components/WorldMap';

interface CountryMetric {
  name: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface KeywordItem {
  keyword: string;
  position: number;
  change: number;
}

interface DeviceItem {
  device: string;
  clicks: number;
  impressions: number;
  ctr: number;
}

interface PerformanceTrendItem {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface DashboardDataset {
  summary: {
    avgPages: number;
    avgPagesChange: number;
    volumeQs: number;
    volumeQsChange: number;
    keywords: number;
    keywordsChange: number;
    clicks: number;
    clicksChange: number;
    ctr: number;
    ctrChange: number;
    position: number;
    positionChange: number;
  };
  performanceData: PerformanceTrendItem[];
  keywordData: KeywordItem[];
  deviceData: DeviceItem[];
}

// Global & Country-Specific Datasets
const dashboardDatasets: Record<string, DashboardDataset> = {
  all: {
    summary: {
      avgPages: 644,
      avgPagesChange: -24.6,
      volumeQs: 14505,
      volumeQsChange: -10.4,
      keywords: 724560,
      keywordsChange: 4.3,
      clicks: 2290,
      clicksChange: -31.5,
      ctr: 0.32,
      ctrChange: -36.0,
      position: 17.93,
      positionChange: 7.0, // Upward arrow indicates improvement
    },
    performanceData: [
      { date: 'Apr 23', clicks: 2100, impressions: 45000, ctr: 4.67, position: 17.5 },
      { date: 'Apr 30', clicks: 2400, impressions: 52000, ctr: 4.62, position: 17.2 },
      { date: 'May 7', clicks: 2200, impressions: 48000, ctr: 4.58, position: 18.0 },
      { date: 'May 14', clicks: 2600, impressions: 55000, ctr: 4.73, position: 17.6 },
      { date: 'May 21', clicks: 2290, impressions: 51000, ctr: 4.49, position: 17.93 },
    ],
    keywordData: [
      { keyword: 'analytics dashboard', position: 12, change: 3 },
      { keyword: 'seo tools online', position: 8, change: -2 },
      { keyword: 'website optimization', position: 15, change: 5 },
      { keyword: 'digital marketing', position: 22, change: -1 },
      { keyword: 'content strategy', position: 18, change: 4 },
    ],
    deviceData: [
      { device: 'Desktop', clicks: 1374, impressions: 30600, ctr: 4.49 },
      { device: 'Mobile', clicks: 687, impressions: 15300, ctr: 4.49 },
      { device: 'Tablet', clicks: 229, impressions: 5100, ctr: 4.49 },
    ],
  },
  us: {
    summary: {
      avgPages: 420,
      avgPagesChange: -12.5,
      volumeQs: 8200,
      volumeQsChange: 2.1,
      keywords: 410200,
      keywordsChange: 5.2,
      clicks: 1247,
      clicksChange: -28.4,
      ctr: 4.49,
      ctrChange: -15.2,
      position: 14.2,
      positionChange: 11.2,
    },
    performanceData: [
      { date: 'Apr 23', clicks: 1100, impressions: 24000, ctr: 4.58, position: 14.0 },
      { date: 'Apr 30', clicks: 1300, impressions: 29000, ctr: 4.48, position: 13.8 },
      { date: 'May 7', clicks: 1150, impressions: 25000, ctr: 4.6, position: 14.5 },
      { date: 'May 14', clicks: 1400, impressions: 31000, ctr: 4.52, position: 14.1 },
      { date: 'May 21', clicks: 1247, impressions: 27800, ctr: 4.49, position: 14.2 },
    ],
    keywordData: [
      { keyword: 'analytics dashboard', position: 8, change: 4 },
      { keyword: 'seo tools online', position: 4, change: 1 },
      { keyword: 'website optimization', position: 9, change: 6 },
      { keyword: 'digital marketing', position: 15, change: -2 },
      { keyword: 'content strategy', position: 12, change: 3 },
    ],
    deviceData: [
      { device: 'Desktop', clicks: 748, impressions: 16680, ctr: 4.49 },
      { device: 'Mobile', clicks: 374, impressions: 8340, ctr: 4.49 },
      { device: 'Tablet', clicks: 125, impressions: 2780, ctr: 4.49 },
    ],
  },
  gb: {
    summary: {
      avgPages: 180,
      avgPagesChange: -8.2,
      volumeQs: 3100,
      volumeQsChange: -4.3,
      keywords: 165000,
      keywordsChange: 3.1,
      clicks: 523,
      clicksChange: -32.5,
      ctr: 4.51,
      ctrChange: -22.1,
      position: 16.5,
      positionChange: 5.4,
    },
    performanceData: [
      { date: 'Apr 23', clicks: 480, impressions: 10500, ctr: 4.57, position: 16.2 },
      { date: 'Apr 30', clicks: 550, impressions: 12200, ctr: 4.51, position: 16.0 },
      { date: 'May 7', clicks: 500, impressions: 11000, ctr: 4.55, position: 16.8 },
      { date: 'May 14', clicks: 600, impressions: 13100, ctr: 4.58, position: 16.3 },
      { date: 'May 21', clicks: 523, impressions: 11600, ctr: 4.51, position: 16.5 },
    ],
    keywordData: [
      { keyword: 'analytics dashboard', position: 15, change: 2 },
      { keyword: 'seo tools online', position: 10, change: -3 },
      { keyword: 'website optimization', position: 18, change: 3 },
      { keyword: 'digital marketing', position: 24, change: 1 },
      { keyword: 'content strategy', position: 20, change: 5 },
    ],
    deviceData: [
      { device: 'Desktop', clicks: 314, impressions: 6960, ctr: 4.51 },
      { device: 'Mobile', clicks: 157, impressions: 3480, ctr: 4.51 },
      { device: 'Tablet', clicks: 52, impressions: 1160, ctr: 4.51 },
    ],
  },
  ca: {
    summary: {
      avgPages: 98,
      avgPagesChange: -5.4,
      volumeQs: 1950,
      volumeQsChange: -1.2,
      keywords: 98000,
      keywordsChange: 2.4,
      clicks: 320,
      clicksChange: -34.8,
      ctr: 4.51,
      ctrChange: -25.2,
      position: 15.8,
      positionChange: 6.1,
    },
    performanceData: [
      { date: 'Apr 23', clicks: 290, impressions: 6400, ctr: 4.53, position: 15.5 },
      { date: 'Apr 30', clicks: 330, impressions: 7300, ctr: 4.52, position: 15.3 },
      { date: 'May 7', clicks: 310, impressions: 6800, ctr: 4.56, position: 16.1 },
      { date: 'May 14', clicks: 360, impressions: 8000, ctr: 4.5, position: 15.6 },
      { date: 'May 21', clicks: 320, impressions: 7100, ctr: 4.51, position: 15.8 },
    ],
    keywordData: [
      { keyword: 'analytics dashboard', position: 13, change: 1 },
      { keyword: 'seo tools online', position: 11, change: -1 },
      { keyword: 'website optimization', position: 14, change: 4 },
      { keyword: 'digital marketing', position: 21, change: -2 },
      { keyword: 'content strategy', position: 17, change: 2 },
    ],
    deviceData: [
      { device: 'Desktop', clicks: 192, impressions: 4260, ctr: 4.51 },
      { device: 'Mobile', clicks: 96, impressions: 2130, ctr: 4.51 },
      { device: 'Tablet', clicks: 32, impressions: 710, ctr: 4.51 },
    ],
  },
  in: {
    summary: {
      avgPages: 54,
      avgPagesChange: 1.2,
      volumeQs: 650,
      volumeQsChange: 5.4,
      keywords: 35000,
      keywordsChange: 8.3,
      clicks: 80,
      clicksChange: -15.4,
      ctr: 3.81,
      ctrChange: -10.2,
      position: 21.4,
      positionChange: 4.2,
    },
    performanceData: [
      { date: 'Apr 23', clicks: 70, impressions: 1800, ctr: 3.89, position: 21.0 },
      { date: 'Apr 30', clicks: 85, impressions: 2200, ctr: 3.86, position: 20.8 },
      { date: 'May 7', clicks: 75, impressions: 1950, ctr: 3.85, position: 22.0 },
      { date: 'May 14', clicks: 90, impressions: 2350, ctr: 3.83, position: 21.2 },
      { date: 'May 21', clicks: 80, impressions: 2100, ctr: 3.81, position: 21.4 },
    ],
    keywordData: [
      { keyword: 'analytics dashboard', position: 22, change: 3 },
      { keyword: 'seo tools online', position: 18, change: 2 },
      { keyword: 'website optimization', position: 25, change: -5 },
      { keyword: 'digital marketing', position: 31, change: 1 },
      { keyword: 'content strategy', position: 28, change: 4 },
    ],
    deviceData: [
      { device: 'Desktop', clicks: 24, impressions: 630, ctr: 3.81 },
      { device: 'Mobile', clicks: 48, impressions: 1260, ctr: 3.81 },
      { device: 'Tablet', clicks: 8, impressions: 210, ctr: 3.81 },
    ],
  },
  de: {
    summary: {
      avgPages: 44,
      avgPagesChange: -2.3,
      volumeQs: 420,
      volumeQsChange: 1.1,
      keywords: 18400,
      keywordsChange: 2.1,
      clicks: 50,
      clicksChange: -11.4,
      ctr: 4.17,
      ctrChange: -8.5,
      position: 15.1,
      positionChange: 3.1,
    },
    performanceData: [
      { date: 'Apr 23', clicks: 42, impressions: 1000, ctr: 4.2, position: 15.0 },
      { date: 'Apr 30', clicks: 52, impressions: 1250, ctr: 4.16, position: 14.9 },
      { date: 'May 7', clicks: 46, impressions: 1100, ctr: 4.18, position: 15.3 },
      { date: 'May 14', clicks: 55, impressions: 1300, ctr: 4.23, position: 14.8 },
      { date: 'May 21', clicks: 50, impressions: 1200, ctr: 4.17, position: 15.1 },
    ],
    keywordData: [
      { keyword: 'analytics dashboard', position: 11, change: 2 },
      { keyword: 'seo tools online', position: 6, change: 1 },
      { keyword: 'website optimization', position: 13, change: -2 },
      { keyword: 'digital marketing', position: 18, change: 2 },
    ],
    deviceData: [
      { device: 'Desktop', clicks: 35, impressions: 840, ctr: 4.17 },
      { device: 'Mobile', clicks: 12, impressions: 290, ctr: 4.14 },
      { device: 'Tablet', clicks: 3, impressions: 70, ctr: 4.28 },
    ],
  },
  fr: {
    summary: {
      avgPages: 31,
      avgPagesChange: -4.1,
      volumeQs: 290,
      volumeQsChange: -2.0,
      keywords: 12100,
      keywordsChange: 1.5,
      clicks: 30,
      clicksChange: -9.5,
      ctr: 4.29,
      ctrChange: -6.4,
      position: 17.2,
      positionChange: 2.5,
    },
    performanceData: [
      { date: 'Apr 23', clicks: 25, impressions: 580, ctr: 4.31, position: 17.0 },
      { date: 'Apr 30', clicks: 32, impressions: 750, ctr: 4.27, position: 16.9 },
      { date: 'May 7', clicks: 28, impressions: 650, ctr: 4.3, position: 17.5 },
      { date: 'May 14', clicks: 35, impressions: 820, ctr: 4.27, position: 17.1 },
      { date: 'May 21', clicks: 30, impressions: 700, ctr: 4.29, position: 17.2 },
    ],
    keywordData: [
      { keyword: 'analytics dashboard', position: 14, change: 1 },
      { keyword: 'seo tools online', position: 9, change: -1 },
      { keyword: 'website optimization', position: 17, change: 3 },
      { keyword: 'digital marketing', position: 22, change: 1 },
    ],
    deviceData: [
      { device: 'Desktop', clicks: 20, impressions: 470, ctr: 4.26 },
      { device: 'Mobile', clicks: 8, impressions: 190, ctr: 4.21 },
      { device: 'Tablet', clicks: 2, impressions: 40, ctr: 5.0 },
    ],
  },
  au: {
    summary: {
      avgPages: 22,
      avgPagesChange: +5.0,
      volumeQs: 210,
      volumeQsChange: +4.2,
      keywords: 9500,
      keywordsChange: +3.0,
      clicks: 25,
      clicksChange: -5.0,
      ctr: 4.55,
      ctrChange: -4.2,
      position: 16.1,
      positionChange: 4.8,
    },
    performanceData: [
      { date: 'Apr 23', clicks: 22, impressions: 480, ctr: 4.58, position: 16.0 },
      { date: 'Apr 30', clicks: 27, impressions: 600, ctr: 4.5, position: 15.9 },
      { date: 'May 7', clicks: 24, impressions: 520, ctr: 4.62, position: 16.3 },
      { date: 'May 14', clicks: 29, impressions: 640, ctr: 4.53, position: 15.8 },
      { date: 'May 21', clicks: 25, impressions: 550, ctr: 4.55, position: 16.1 },
    ],
    keywordData: [
      { keyword: 'analytics dashboard', position: 10, change: 2 },
      { keyword: 'seo tools online', position: 7, change: -2 },
      { keyword: 'website optimization', position: 12, change: 4 },
      { keyword: 'content strategy', position: 15, change: 1 },
    ],
    deviceData: [
      { device: 'Desktop', clicks: 16, impressions: 350, ctr: 4.57 },
      { device: 'Mobile', clicks: 7, impressions: 160, ctr: 4.38 },
      { device: 'Tablet', clicks: 2, impressions: 40, ctr: 5.0 },
    ],
  },
  jp: {
    summary: {
      avgPages: 15,
      avgPagesChange: +1.0,
      volumeQs: 170,
      volumeQsChange: +2.1,
      keywords: 6200,
      keywordsChange: +1.2,
      clicks: 18,
      clicksChange: -4.3,
      ctr: 4.0,
      ctrChange: -3.8,
      position: 14.8,
      positionChange: 6.8,
    },
    performanceData: [
      { date: 'Apr 23', clicks: 15, impressions: 380, ctr: 3.95, position: 14.5 },
      { date: 'Apr 30', clicks: 20, impressions: 500, ctr: 4.0, position: 14.3 },
      { date: 'May 7', clicks: 16, impressions: 400, ctr: 4.0, position: 15.0 },
      { date: 'May 14', clicks: 22, impressions: 550, ctr: 4.0, position: 14.6 },
      { date: 'May 21', clicks: 18, impressions: 450, ctr: 4.0, position: 14.8 },
    ],
    keywordData: [
      { keyword: 'analytics dashboard', position: 7, change: 3 },
      { keyword: 'seo tools online', position: 3, change: 1 },
      { keyword: 'website optimization', position: 8, change: 4 },
    ],
    deviceData: [
      { device: 'Desktop', clicks: 11, impressions: 280, ctr: 3.93 },
      { device: 'Mobile', clicks: 6, impressions: 150, ctr: 4.0 },
      { device: 'Tablet', clicks: 1, impressions: 20, ctr: 5.0 },
    ],
  },
};

// Summary of Country metrics (Static) for World Map and Panel List
const countrySummaryData: Record<string, CountryMetric> = {
  us: { name: 'United States', clicks: 1247, impressions: 27800, ctr: 4.49, position: 14.2 },
  gb: { name: 'United Kingdom', clicks: 523, impressions: 11600, ctr: 4.51, position: 16.5 },
  ca: { name: 'Canada', clicks: 320, impressions: 7100, ctr: 4.51, position: 15.8 },
  in: { name: 'India', clicks: 80, impressions: 2100, ctr: 3.81, position: 21.4 },
  de: { name: 'Germany', clicks: 50, impressions: 1200, ctr: 4.17, position: 15.1 },
  fr: { name: 'France', clicks: 30, impressions: 700, ctr: 4.29, position: 17.2 },
  au: { name: 'Australia', clicks: 25, impressions: 550, ctr: 4.55, position: 16.1 },
  jp: { name: 'Japan', clicks: 18, impressions: 450, ctr: 4.0, position: 14.8 },
};

// Device Styling configuration
const DEVICE_COLORS: Record<string, string> = {
  Desktop: '#3b82f6', // blue
  Mobile: '#10b981',  // emerald/green
  Tablet: '#8b5cf6',  // violet/purple
};

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<
    'overview' | 'clicks' | 'impressions' | 'ctr' | 'position'
  >('overview');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Synchronize Dark Mode Class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch data dynamically based on selected country
  const currentData = useMemo<DashboardDataset>(() => {
    if (!selectedCountry) {
      return dashboardDatasets.all;
    }
    return dashboardDatasets[selectedCountry] || dashboardDatasets.all;
  }, [selectedCountry]);

  // Total clicks for active country's device chart center labeling
  const totalDeviceClicks = useMemo(() => {
    return currentData.deviceData.reduce((sum, item) => sum + item.clicks, 0);
  }, [currentData]);

  // Handle dropdown country selector
  const handleCountryDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCountry(val === 'all' ? null : val);
  };

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border/50 flex flex-col justify-between transition-colors duration-300">
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-inner">
              <LayoutDashboard className="w-6 h-6 animate-pulse" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">Datablog</span>
          </div>

          {/* Navigation */}
          <nav className="px-3 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all font-medium">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm">Organic Overview</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200">
              <Search className="w-5 h-5" />
              <span className="text-sm">Search Console</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200">
              <List className="w-5 h-5" />
              <span className="text-sm">Performance</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200">
              <Settings className="w-5 h-5" />
              <span className="text-sm">Tools & Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer with Dark Mode toggle */}
        <div className="p-4 border-t border-sidebar-border/50">
          <div className="flex items-center justify-between bg-muted/60 p-2 rounded-xl">
            <span className="text-xs text-muted-foreground font-semibold px-2">Theme</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-background text-foreground shadow-sm hover:scale-105 transition-transform"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col bg-background/50">
        {/* Header */}
        <header className="bg-card/50 backdrop-blur-md border-b border-border/80 px-8 py-5 flex flex-col gap-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Organic Overview
                {selectedCountry && (
                  <span className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                    {countrySummaryData[selectedCountry]?.name}
                  </span>
                )}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-xl border border-border/60 transition-all bg-card shadow-sm">
                <FileText className="w-4 h-4 text-muted-foreground/80" />
                Get template
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-xl border border-border/60 transition-all bg-card shadow-sm">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Connected
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-xl border border-border/60 transition-all bg-card shadow-sm">
                <Calendar className="w-4 h-4 text-muted-foreground/80" />
                Apr 23, 2026 - May 20, 2026
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground border-t border-border/40 pt-3">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" />
              <span className="font-semibold">Search type:</span>
              <select className="px-2.5 py-1.5 border border-border/80 rounded-lg bg-card text-foreground font-medium shadow-sm outline-none focus:border-primary">
                <option>web</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold">Country Filter:</span>
              <select
                value={selectedCountry || 'all'}
                onChange={handleCountryDropdownChange}
                className="px-2.5 py-1.5 border border-border/80 rounded-lg bg-card text-foreground font-medium shadow-sm outline-none focus:border-primary"
              >
                <option value="all">All Countries</option>
                {Object.entries(countrySummaryData).map(([code, item]) => (
                  <option key={code} value={code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold">Device Category:</span>
              <select className="px-2.5 py-1.5 border border-border/80 rounded-lg bg-card text-foreground font-medium shadow-sm outline-none focus:border-primary">
                <option>All Devices</option>
              </select>
            </div>

            {selectedCountry && (
              <button
                onClick={() => setSelectedCountry(null)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Country Filter
              </button>
            )}
          </div>
        </header>

        {/* Metrics Cards Grid */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {/* Average Pages */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 hover:shadow-lg hover:border-border/100 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Average Pages</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-foreground">
                  {currentData.summary.avgPages.toLocaleString()}
                </div>
              </div>
              <div className={`flex items-center gap-1 text-xs mt-3 font-semibold ${
                currentData.summary.avgPagesChange >= 0 ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                {currentData.summary.avgPagesChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{Math.abs(currentData.summary.avgPagesChange)}%</span>
              </div>
            </div>

            {/* Volume QS */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 hover:shadow-lg hover:border-border/100 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Volume QS</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-foreground">
                  {currentData.summary.volumeQs.toLocaleString()}
                </div>
              </div>
              <div className={`flex items-center gap-1 text-xs mt-3 font-semibold ${
                currentData.summary.volumeQsChange >= 0 ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                {currentData.summary.volumeQsChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{Math.abs(currentData.summary.volumeQsChange)}%</span>
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 hover:shadow-lg hover:border-border/100 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Keywords</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-foreground">
                  {currentData.summary.keywords.toLocaleString()}
                </div>
              </div>
              <div className={`flex items-center gap-1 text-xs mt-3 font-semibold ${
                currentData.summary.keywordsChange >= 0 ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                {currentData.summary.keywordsChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{Math.abs(currentData.summary.keywordsChange)}%</span>
              </div>
            </div>

            {/* Clicks */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 hover:shadow-lg hover:border-border/100 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Clicks</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm">
                    👆
                  </div>
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-foreground">
                  {currentData.summary.clicks.toLocaleString()}
                </div>
              </div>
              <div className={`flex items-center gap-1 text-xs mt-3 font-semibold ${
                currentData.summary.clicksChange >= 0 ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                {currentData.summary.clicksChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{Math.abs(currentData.summary.clicksChange)}%</span>
              </div>
            </div>

            {/* CTR */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 hover:shadow-lg hover:border-border/100 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">CTR</span>
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center text-sm">
                    📊
                  </div>
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-foreground">
                  {currentData.summary.ctr}%
                </div>
              </div>
              <div className={`flex items-center gap-1 text-xs mt-3 font-semibold ${
                currentData.summary.ctrChange >= 0 ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                {currentData.summary.ctrChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{Math.abs(currentData.summary.ctrChange)}%</span>
              </div>
            </div>

            {/* Average Position */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 hover:shadow-lg hover:border-border/100 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Avg Position</span>
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center text-sm">
                    🎯
                  </div>
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-foreground">
                  {currentData.summary.position}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs mt-3 font-semibold text-emerald-500">
                <TrendingUp className="w-3 h-3" />
                <span>{currentData.summary.positionChange}%</span>
              </div>
            </div>
          </div>

          {/* Performance Area Chart */}
          <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">Performance Over Time</h3>
                <p className="text-xs text-muted-foreground">Select a metric below to visualize the trend</p>
              </div>
              
              {/* Metric Selector Tabs */}
              <div className="flex flex-wrap items-center bg-muted/80 p-1.5 rounded-xl border border-border/30 text-xs">
                {(['overview', 'clicks', 'impressions', 'ctr', 'position'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveMetric(m)}
                    className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all duration-200 ${
                      activeMetric === m
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Graph Container */}
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData.performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="colorCtr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="colorPosition" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.15)" />
                  <XAxis dataKey="date" stroke="rgba(156,163,175,0.6)" fontSize={11} tickLine={false} axisLine={false} />
                  
                  {/* Dynamic Axis Config */}
                  {activeMetric === 'overview' ? (
                    <>
                      <YAxis yAxisId="left" stroke="#3b82f6" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={10} tickLine={false} axisLine={false} />
                    </>
                  ) : activeMetric === 'clicks' ? (
                    <YAxis stroke="#3b82f6" fontSize={10} tickLine={false} axisLine={false} />
                  ) : activeMetric === 'impressions' ? (
                    <YAxis stroke="#10b981" fontSize={10} tickLine={false} axisLine={false} />
                  ) : activeMetric === 'ctr' ? (
                    <YAxis stroke="#ef4444" fontSize={10} tickLine={false} axisLine={false} />
                  ) : (
                    <YAxis stroke="#f59e0b" fontSize={10} tickLine={false} axisLine={false} reversed />
                  )}

                  {/* Sleek Tooltip */}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      color: '#0f172a',
                    }}
                    itemStyle={{ fontSize: '12px' }}
                    labelStyle={{ fontWeight: 'bold', fontSize: '12px', color: '#64748b' }}
                  />

                  {/* Render Areas Dynamically */}
                  {activeMetric === 'overview' && (
                    <>
                      <Area yAxisId="left" type="monotone" dataKey="clicks" name="Clicks" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorClicks)" />
                      <Area yAxisId="right" type="monotone" dataKey="impressions" name="Impressions" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorImpressions)" />
                    </>
                  )}
                  {activeMetric === 'clicks' && (
                    <Area type="monotone" dataKey="clicks" name="Clicks" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorClicks)" />
                  )}
                  {activeMetric === 'impressions' && (
                    <Area type="monotone" dataKey="impressions" name="Impressions" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorImpressions)" />
                  )}
                  {activeMetric === 'ctr' && (
                    <Area type="monotone" dataKey="ctr" name="CTR (%)" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCtr)" />
                  )}
                  {activeMetric === 'position' && (
                    <Area type="monotone" dataKey="position" name="Avg Position" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPosition)" />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Panels Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Keyword Rankings */}
            <div className="bg-card rounded-2xl border border-border/80 p-6 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1.5">Keyword Rankings</h3>
                <p className="text-xs text-muted-foreground mb-4">Rankings and position change details</p>
                <div className="space-y-3.5">
                  {currentData.keywordData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                      <div className="flex-1">
                        <div className="text-sm font-bold text-foreground tracking-tight">{item.keyword}</div>
                        <div className="text-xs text-muted-foreground">Avg Position: {item.position}</div>
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-semibold ${
                        item.change > 0 ? 'text-emerald-500' : 'text-rose-500'
                      }`}>
                        {item.change > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        <span>{Math.abs(item.change)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Device Performance Donut Chart */}
            <div className="bg-card rounded-2xl border border-border/80 p-6 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1.5">Device Distribution</h3>
                <p className="text-xs text-muted-foreground mb-4">Traffic split by device platform</p>
                
                {/* Donut Graph Component */}
                <div className="relative h-48 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={currentData.deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="clicks"
                      >
                        {currentData.deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={DEVICE_COLORS[entry.device] || '#ccc'} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Absolute Center Labels */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Clicks</span>
                    <span className="text-2xl font-extrabold text-foreground">{totalDeviceClicks.toLocaleString()}</span>
                  </div>
                </div>

                {/* Legends containing micro metrics */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/40 text-center">
                  {currentData.deviceData.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: DEVICE_COLORS[item.device] }}
                        ></span>
                        <span className="text-xs font-bold text-foreground">{item.device}</span>
                      </div>
                      <span className="text-xs font-semibold">{item.clicks} clicks</span>
                      <span className="text-[10px] text-muted-foreground">CTR: {item.ctr}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Country Performance: Interactive World Map */}
            <div className="bg-card rounded-2xl border border-border/80 p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-lg font-bold text-foreground">Country Traffic</h3>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                    Console Map
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Click countries to filter dashboard details</p>
                
                {/* World Map Container */}
                <div className="h-44 mb-2 flex items-center justify-center border border-border/20 rounded-xl bg-muted/20 p-2 shadow-inner">
                  <WorldMap
                    countryData={countrySummaryData}
                    selectedCountry={selectedCountry}
                    onSelectCountry={setSelectedCountry}
                  />
                </div>

                {/* Simple List showing stats */}
                <div className="mt-4 space-y-2 text-xs">
                  {Object.entries(countrySummaryData).slice(0, 3).map(([code, item]) => {
                    const isSelected = selectedCountry === code;
                    return (
                      <button
                        key={code}
                        onClick={() => setSelectedCountry(isSelected ? null : code)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl transition-all border ${
                          isSelected
                            ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm'
                            : 'border-transparent hover:bg-muted text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Globe2 className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="font-semibold">{item.name}</span>
                        </div>
                        <span className={isSelected ? 'text-primary font-bold' : 'text-muted-foreground font-medium'}>
                          {item.clicks.toLocaleString()} clicks
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
