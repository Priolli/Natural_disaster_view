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
  Line,
  Label
} from 'recharts';
import { Download, Maximize2, MoreHorizontal, Filter, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import ChartTooltip from './ChartTooltip';

export type ChartType = 'bar' | 'line' | 'pie';

interface ChartContainerProps {
  title: string;
  description?: string;
  highlightInsight?: string;
  chartType: ChartType;
  data: any[];
  config: {
    xAxisKey?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
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
  noDataMessage?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  highlightInsight,
  chartType,
  data,
  config,
  height = 400,
  filters,
  noDataMessage = 'No data available for the selected filters'
}) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(filters?.types || []);
  const [isExpanded, setIsExpanded] = useState(false);

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
    return value.toLocaleString();
  };

  const truncateLabel = (label: string, maxLength: number = 20) => {
    return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
  };

  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
          <p className="text-gray-500">{noDataMessage}</p>
        </div>
      );
    }

    const chartHeight = isExpanded ? window.innerHeight * 0.8 : height;
    const shouldRotateLabels = data.length > 8;

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: shouldRotateLabels ? 60 : 30
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={config.xAxisKey} 
                angle={shouldRotateLabels ? -45 : 0}
                textAnchor={shouldRotateLabels ? "end" : "middle"}
                interval={0}
                height={shouldRotateLabels ? 60 : 30}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              >
                {config.xAxisLabel && (
                  <Label value={config.xAxisLabel} position="bottom" offset={20} />
                )}
              </XAxis>
              <YAxis 
                tickFormatter={formatYAxisTick}
                width={80}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              >
                {config.yAxisLabel && (
                  <Label value={config.yAxisLabel} angle={-90} position="insideLeft" offset={-10} />
                )}
              </YAxis>
              <Tooltip 
                content={<ChartTooltip formatter={formatYAxisTick} />}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
              />
              {config.bars?.map((bar, index) => (
                <Bar 
                  key={index} 
                  dataKey={bar.dataKey} 
                  fill={bar.fill} 
                  name={bar.name} 
                  radius={[4, 4, 0, 0]}
                  label={{ 
                    position: 'top',
                    formatter: formatYAxisTick,
                    fontSize: 10,
                    fill: '#6B7280',
                    content: (props) => {
                      const value = props.value;
                      return value > 0 ? formatYAxisTick(value) : '';
                    }
                  }}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={config.xAxisKey}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              >
                {config.xAxisLabel && (
                  <Label value={config.xAxisLabel} position="bottom" offset={20} />
                )}
              </XAxis>
              <YAxis 
                tickFormatter={formatYAxisTick}
                width={80}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              >
                {config.yAxisLabel && (
                  <Label value={config.yAxisLabel} angle={-90} position="insideLeft" offset={-10} />
                )}
              </YAxis>
              <Tooltip 
                content={<ChartTooltip formatter={formatYAxisTick} />}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
              />
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
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={130}
                innerRadius={60}
                dataKey={config.pies?.dataKey}
                nameKey={config.pies?.nameKey}
                label={(entry) => truncateLabel(entry.name)}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={config.pies?.colors[index % (config.pies?.colors.length || 1)]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                content={<ChartTooltip formatter={formatYAxisTick} />}
              />
              <Legend 
                formatter={(value) => <span className="text-sm text-gray-600">{truncateLabel(value)}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isExpanded 
          ? 'fixed inset-4 z-50 bg-white border border-gray-200 overflow-auto' 
          : ''
      }`}
    >
      {isExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsExpanded(false)} />
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
            {highlightInsight && (
              <p className="text-sm italic text-indigo-600 mt-2">{highlightInsight}</p>
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
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              {isExpanded ? <X className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button 
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="More options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div 
          id={`chart-${title.replace(/\s+/g, '-')}`} 
          className={`transition-opacity duration-500 ease-in-out opacity-100 ${
            isExpanded ? 'pt-4' : ''
          }`}
        >
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;