import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Users, DollarSign, Euro, PoundSterling, Moon, Sun, Download } from 'lucide-react';

const currencies = [
  { code: 'USD', symbol: '$', icon: DollarSign },
  { code: 'EUR', symbol: '€', icon: Euro },
  { code: 'GBP', symbol: '£', icon: PoundSterling },
  { code: 'JPY', symbol: '¥', icon: DollarSign },
];

const industries = [
  'E-commerce',
  'Publishers',
  'SaaS',
  'Finance',
  'Healthcare',
  'Education',
];

const formatLargeNumber = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  } else {
    return value.toFixed(1);
  }
};

const EstimatedRoiDisplay = ({ roi, convertedLeads, darkMode }) => {
  return (
    <Card className={darkMode ? 'bg-gray-800' : 'bg-white'}>
      <CardContent className="p-6">
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Estimated ROI</h2>
        <div className={`text-5xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'} mb-2`}>
          ${roi.toFixed(2)}
        </div>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Based on {formatLargeNumber(convertedLeads)} converted leads
        </p>
      </CardContent>
    </Card>
  );
};

const RoiCalculatorDashboard = () => {
  const [trafficSources, setTrafficSources] = useState({
    organic: '6000000',
    paid: '1000000',
    affiliates: '500000',
    displayAds: '500000',
  });
  const [cvr, setCvr] = useState(4.3);
  const [trafficAcquired, setTrafficAcquired] = useState(10);
  const [aov, setAov] = useState(60);
  const [currency, setCurrency] = useState(currencies[0]);
  const [industry, setIndustry] = useState(industries[0]);
  const [darkMode, setDarkMode] = useState(false);

  const [calculatedRoi, setCalculatedRoi] = useState(0);
  const [convertedLeads, setConvertedLeads] = useState(0);

  useEffect(() => {
    try {
      const totalTraffic = Object.values(trafficSources).reduce((sum, value) => sum + parseInt(value || '0', 10), 0);
      const acquiredTraffic = totalTraffic * (trafficAcquired / 100);
      const leads = acquiredTraffic * (cvr / 100);
      const revenue = leads * aov;
      setConvertedLeads(Math.round(leads));
      setCalculatedRoi(revenue);
    } catch (error) {
      console.error('Error in ROI calculation:', error);
      setConvertedLeads(0);
      setCalculatedRoi(0);
    }
  }, [trafficSources, cvr, trafficAcquired, aov]);

  const formatValue = (value) => {
    if (typeof value !== 'string' && typeof value !== 'number') return '0';
    return parseInt(value, 10).toLocaleString('en-US');
  };

  const formatCurrency = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).replace(/^\D+/, '');
  };

  const handleTrafficInputChange = (channel, value) => {
    const numValue = value.replace(/[^\d]/g, '');
    setTrafficSources(prev => ({ ...prev, [channel]: numValue }));
  };

  const TrafficSourceInput = ({ name, value }) => (
    <div className="flex flex-col items-center">
      <Input 
        type="text" 
        value={formatValue(value)}
        onChange={(e) => handleTrafficInputChange(name, e.target.value)}
        className={`w-36 text-center border-2 rounded-lg ${
          darkMode 
            ? 'bg-gray-700 text-white border-gray-600 focus:border-green-500' 
            : 'bg-white text-gray-800 border-gray-300 focus:border-green-600'
        }`}
      />
      <span className={`mt-2 text-sm font-medium capitalize ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {name === 'organic' ? 'Organic' : name === 'displayAds' ? 'Display Ads' : name}
      </span>
    </div>
  );

  const exportData = () => {
    try {
      const data = {
        trafficSources,
        cvr,
        trafficAcquired,
        aov,
        currency: currency.code,
        industry,
        convertedLeads,
        calculatedRoi
      };
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = 'roi_calculator_data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <div className={`p-8 min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} font-sans`}>
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>ROI Calculator Dashboard</h1>
          <div className="flex space-x-4 items-center">
            <Select onValueChange={(value) => setCurrency(currencies.find(c => c.code === value) || currencies[0])}>
              <SelectTrigger className={`w-[120px] border-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'} focus:border-green-500`}>
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.code} ({c.symbol})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setIndustry}>
              <SelectTrigger className={`w-[120px] border-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'} focus:border-green-500`}>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Sun className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              <Moon className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-gray-400'}`} />
            </div>
            <Button onClick={exportData} variant="outline" size="icon" className={darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100'}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Traffic Sources Card */}
        <Card className={`shadow-lg rounded-lg border-none mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <CardContent className="p-6">
            <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Traffic Sources</h2>
            <div className="flex justify-between items-end">
              {Object.entries(trafficSources).map(([name, value]) => (
                <TrafficSourceInput key={name} name={name} value={value} />
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Conversion Metrics Card */}
        <Card className={`shadow-lg rounded-lg border-none mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <CardContent className="p-6">
            <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Conversion Metrics</h2>
            <div className="space-y-6">
              {[
                { label: 'CVR', value: cvr, setter: setCvr, max: 10, step: 0.1, format: (v) => `${v.toFixed(1)}%` },
                { label: 'Traffic Acquired', value: trafficAcquired, setter: setTrafficAcquired, max: 100, step: 1, format: (v) => `${v}%` },
                { label: 'AOV', value: aov, setter: setAov, max: 1000, step: 1, format: (v) => formatCurrency(v) },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{metric.label}</span>
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metric.format(metric.value)}</span>
                  </div>
                  <Slider 
                    value={[metric.value]} 
                    onValueChange={(value) => metric.setter(value[0])} 
                    max={metric.max} 
                    step={metric.step}
                    className={`[&>span]:bg-${darkMode ? 'green-500' : 'green-600'}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Summary Cards */}
        <Card className={`shadow-lg rounded-lg border-none mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              {[
                { label: 'Converted Leads', value: formatLargeNumber(convertedLeads), icon: Users },
                { label: 'Traffic Growth', value: `${trafficAcquired}%`, icon: ArrowUpRight },
                { label: 'ROI', value: formatCurrency(calculatedRoi), icon: currency.icon },
              ].map((item) => (
                <div key={item.label} className="flex items-center">
                  <div className={`${darkMode ? 'bg-green-500 bg-opacity-20' : 'bg-green-100'} p-3 rounded-full mr-4`}>
                    {React.createElement(item.icon, { className: `w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-700'}` })}
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.label}</h3>
                    <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-green-700'}`}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Estimated ROI Display */}
        <EstimatedRoiDisplay roi={calculatedRoi} convertedLeads={convertedLeads} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default RoiCalculatorDashboard;
