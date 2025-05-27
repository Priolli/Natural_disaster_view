import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Download, Maximize2, MoreHorizontal, Filter } from 'lucide-react';
import html2canvas from 'html2canvas';

export type ChartType = 'bar' | 'line' | 'pie';

interface ChartContainerProps {
  title: string;
  description?: string;
  chartType: ChartType;
  data: any[];
  config: {
    xAxisKey?: string;
    bars?: {
      dataKey: string;
      fill: string;
      name: string;
    }[];
    lines?: {
      dataKey: string;
      stroke: string;
      name: string;
    }[];
    pies?: {
      dataKey: string;
      nameKey: string;
      colors: string[];
    };
  };
  height?: number;
  filters?: {
    types?: string[];
    onTypeChange?: (type: string) => void;
  };
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  chartType,
  data,
  config,
  height = 400,
  filters
}) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(filters?.types || []);

  const downloadChart = async () => {
    const chartElement = document.getElementById(`chart-${title.replace(/\s+/g, '-')}`);
    if (chartElement) {
      try {
        const canvas = await html2canvas(chartElement);
        const link = document.createElement('a');
        link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error downloading chart:', error);
      }
    }
  };

  const handleTypeChange = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    filters?.onTypeChange?.(type);
  };

  const formatYAxisTick = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
  };

  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={config.xAxisKey} 
                angle={-45}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis 
                tickFormatter={formatYAxisTick}
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)' 
                }}
                formatter={(value: number) => [formatYAxisTick(value), '']}
              />
              <Legend />
              {config.bars?.map((bar, index) => (
                <Bar 
                  key={index} 
                  dataKey={bar.dataKey} 
                  fill={bar.fill} 
                  name={bar.name} 
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xAxisKey} />
              <YAxis 
                tickFormatter={formatYAxisTick}
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)' 
                }}
                formatter={(value: number) => [formatYAxisTick(value), '']}
              />
              <Legend />
              {config.lines?.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.stroke}
                  name={line.name}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={130}
                innerRadius={60}
                dataKey={config.pies?.dataKey}
                nameKey={config.pies?.nameKey}
                label={(entry) => entry.name}
                labelLine={true}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={config.pies?.colors[index % (config.pies?.colors.length || 1)]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)' 
                }}
                formatter={(value: number) => [formatYAxisTick(value), '']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          {filters && filters.types && (
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                className="text-sm border border-gray-300 rounded-md p-1"
                onChange={(e) => handleTypeChange(e.target.value)}
                value={selectedTypes[0] || ''}
              >
                <option value="">All Types</option>
                {filters.types.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}
          <button 
            onClick={downloadChart}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title="Download chart"
          >
            <Download className="w-5 h-5" />
          </button>
          <button 
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title="Expand"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <button 
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title="More options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div id={`chart-${title.replace(/\s+/g, '-')}`} className="mt-2">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartContainer;