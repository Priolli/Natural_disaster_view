import React, { useMemo } from 'react';
import ChartContainer from '../components/dashboard/ChartContainer';
import { useDisasterData } from '../hooks/useDisasterData';
import { AlertTriangle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { disasters, loading, error } = useDisasterData();

  const chartData = useMemo(() => {
    console.log('DashboardPage processing data:', {
      disastersCount: disasters?.length,
      hasData: !!disasters,
    });

    if (!disasters || disasters.length === 0) {
      console.log('No disaster data available');
      return null;
    }

    // Calculate disasters by type
    const byType = disasters.reduce((acc: { [key: string]: number }, disaster) => {
      const type = disaster.type.charAt(0).toUpperCase() + disaster.type.slice(1);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const disastersByTypeData = Object.entries(byType).map(([name, value]) => ({
      name,
      value,
    }));

    console.log('Disasters by type:', disastersByTypeData);

    // Calculate disaster trend by year
    const byYear = disasters.reduce((acc: { [key: string]: number }, disaster) => {
      const year = new Date(disaster.startDate).getFullYear().toString();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});

    const disasterTrendData = Object.entries(byYear)
      .map(([year, disasters]) => ({
        year,
        disasters,
      }))
      .sort((a, b) => a.year.localeCompare(b.year));

    console.log('Disaster trend data:', disasterTrendData);

    // Calculate fatalities by disaster type and year
    const fatalitiesByYear = disasters.reduce((acc: any, disaster) => {
      const year = new Date(disaster.startDate).getFullYear().toString();
      if (!acc[year]) acc[year] = {};
      acc[year][disaster.type] = (acc[year][disaster.type] || 0) + disaster.impact.deaths;
      return acc;
    }, {});

    const fatalitiesData = Object.entries(fatalitiesByYear).map(([year, types]: [string, any]) => ({
      year,
      ...types,
    }));

    // Calculate impact by region
    const byRegion = disasters.reduce((acc: any, disaster) => {
      const region = disaster.location.region || 'Unknown';
      if (!acc[region]) {
        acc[region] = {
          affected: 0,
          economic: 0,
        };
      }
      acc[region].affected += disaster.impact.affected || 0;
      acc[region].economic += disaster.impact.economicLossUSD || 0;
      return acc;
    }, {});

    const impactByRegionData = Object.entries(byRegion).map(([region, data]: [string, any]) => ({
      region,
      affected: data.affected,
      economic: data.economic,
    }));

    console.log('Chart data generated successfully');

    return {
      disastersByTypeData,
      disasterTrendData,
      fatalitiesData,
      impactByRegionData,
    };
  }, [disasters]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-red-600">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-yellow-700">
              No data available. Please upload a disaster dataset to view analytics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Disaster Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartContainer
          title="Disasters by Type"
          description="Distribution of natural disasters by type"
          chartType="pie"
          data={chartData.disastersByTypeData}
          config={{
            pies: {
              dataKey: 'value',
              nameKey: 'name',
              colors: ['#EF4444', '#3B82F6', '#8B5CF6', '#F97316', '#06B6D4', '#EAB308', '#DC2626'],
            },
          }}
        />
        
        <ChartContainer
          title="Disaster Trend"
          description="Annual number of recorded natural disasters"
          chartType="line"
          data={chartData.disasterTrendData}
          config={{
            xAxisKey: 'year',
            lines: [
              {
                dataKey: 'disasters',
                stroke: '#6366F1',
                name: 'Number of Disasters',
              },
            ],
          }}
        />
      </div>
      
      <div className="mb-8">
        <ChartContainer
          title="Fatalities by Disaster Type"
          description="Annual fatalities from major disaster types"
          chartType="bar"
          data={chartData.fatalitiesData}
          config={{
            xAxisKey: 'year',
            bars: [
              {
                dataKey: 'earthquake',
                fill: '#EF4444',
                name: 'Earthquakes',
              },
              {
                dataKey: 'flood',
                fill: '#3B82F6',
                name: 'Floods',
              },
              {
                dataKey: 'hurricane',
                fill: '#8B5CF6',
                name: 'Hurricanes',
              },
            ],
          }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer
          title="Population Affected by Region"
          description="Total affected population by geographic region"
          chartType="bar"
          data={chartData.impactByRegionData}
          config={{
            xAxisKey: 'region',
            bars: [
              {
                dataKey: 'affected',
                fill: '#22C55E',
                name: 'Affected Population',
              },
            ],
          }}
        />
        
        <ChartContainer
          title="Economic Impact by Region"
          description="Economic losses by geographic region (USD)"
          chartType="bar"
          data={chartData.impactByRegionData}
          config={{
            xAxisKey: 'region',
            bars: [
              {
                dataKey: 'economic',
                fill: '#F97316',
                name: 'Economic Losses',
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default DashboardPage;