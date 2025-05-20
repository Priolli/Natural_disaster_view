import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { AlertTriangle, Download, Filter, X } from 'lucide-react';
import ChartContainer from '../components/dashboard/ChartContainer';
import { useDisasterData } from '../hooks/useDisasterData';
import { DisasterEvent, FilterOptions } from '../types/disaster';

const DashboardPage: React.FC = () => {
  const { disasters, loading, error } = useDisasterData();
  const [filters, setFilters] = useState<FilterOptions>({ types: [] });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const chartData = useMemo(() => {
    if (!disasters || disasters.length === 0) return null;

    const filteredData = disasters.filter(disaster => {
      if (filters.types.length > 0 && !filters.types.includes(disaster.type)) {
        return false;
      }
      if (filters.startDate && new Date(disaster.startDate) < new Date(filters.startDate)) {
        return false;
      }
      if (filters.endDate && new Date(disaster.startDate) > new Date(filters.endDate)) {
        return false;
      }
      if (filters.minDeaths && disaster.impact.deaths < filters.minDeaths) {
        return false;
      }
      if (filters.minAffected && (disaster.impact.affected || 0) < (filters.minAffected || 0)) {
        return false;
      }
      return true;
    });

    // Disasters by type
    const byType = filteredData.reduce((acc: { [key: string]: number }, disaster) => {
      const type = disaster.type.charAt(0).toUpperCase() + disaster.type.slice(1);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const disastersByTypeData = Object.entries(byType).map(([name, value]) => ({
      name,
      value,
    }));

    // Disasters by year
    const byYear = filteredData.reduce((acc: { [key: string]: number }, disaster) => {
      const year = format(new Date(disaster.startDate), 'yyyy');
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});

    const disasterTrendData = Object.entries(byYear)
      .map(([year, count]) => ({
        year,
        count,
      }))
      .sort((a, b) => a.year.localeCompare(b.year));

    // Top 10 deadliest events
    const deadliestEvents = [...filteredData]
      .sort((a, b) => b.impact.deaths - a.impact.deaths)
      .slice(0, 10)
      .map(event => ({
        name: event.name,
        deaths: event.impact.deaths,
        type: event.type,
      }));

    // Economic impact by year
    const economicByYear = filteredData.reduce((acc: { [key: string]: number }, disaster) => {
      const year = format(new Date(disaster.startDate), 'yyyy');
      acc[year] = (acc[year] || 0) + (disaster.impact.economicLossUSD || 0);
      return acc;
    }, {});

    const economicTrendData = Object.entries(economicByYear)
      .map(([year, loss]) => ({
        year,
        loss: loss / 1000000, // Convert to millions
      }))
      .sort((a, b) => a.year.localeCompare(b.year));

    // Impact by disaster type
    const impactByType = filteredData.reduce((acc: any, disaster) => {
      const type = disaster.type.charAt(0).toUpperCase() + disaster.type.slice(1);
      if (!acc[type]) {
        acc[type] = {
          deaths: 0,
          affected: 0,
          economicLoss: 0,
        };
      }
      acc[type].deaths += disaster.impact.deaths;
      acc[type].affected += disaster.impact.affected || 0;
      acc[type].economicLoss += disaster.impact.economicLossUSD || 0;
      return acc;
    }, {});

    const impactByTypeData = Object.entries(impactByType).map(([type, data]: [string, any]) => ({
      type,
      ...data,
    }));

    return {
      disastersByTypeData,
      disasterTrendData,
      deadliestEvents,
      economicTrendData,
      impactByTypeData,
    };
  }, [disasters, filters]);

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Disaster Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Analyzing {disasters.length.toLocaleString()} disasters from the EMDAT database
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
            <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              <Download className="h-5 w-5 mr-2" />
              Export Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartContainer
            title="Disasters by Type"
            description="Distribution of natural disasters by category"
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
            description="Annual number of recorded disasters"
            chartType="line"
            data={chartData.disasterTrendData}
            config={{
              xAxisKey: 'year',
              lines: [
                {
                  dataKey: 'count',
                  stroke: '#6366F1',
                  name: 'Number of Disasters',
                },
              ],
            }}
          />
        </div>

        <div className="mb-8">
          <ChartContainer
            title="Top 10 Deadliest Events"
            description="Events with highest recorded fatalities"
            chartType="bar"
            data={chartData.deadliestEvents}
            height={400}
            config={{
              xAxisKey: 'name',
              bars: [
                {
                  dataKey: 'deaths',
                  fill: '#EF4444',
                  name: 'Deaths',
                },
              ],
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartContainer
            title="Economic Impact Over Time"
            description="Annual economic losses in millions USD"
            chartType="line"
            data={chartData.economicTrendData}
            config={{
              xAxisKey: 'year',
              lines: [
                {
                  dataKey: 'loss',
                  stroke: '#22C55E',
                  name: 'Economic Loss (Millions USD)',
                },
              ],
            }}
          />

          <ChartContainer
            title="Impact by Disaster Type"
            description="Deaths and affected population by disaster category"
            chartType="bar"
            data={chartData.impactByTypeData}
            config={{
              xAxisKey: 'type',
              bars: [
                {
                  dataKey: 'deaths',
                  fill: '#EF4444',
                  name: 'Deaths',
                },
                {
                  dataKey: 'affected',
                  fill: '#3B82F6',
                  name: 'Affected',
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;