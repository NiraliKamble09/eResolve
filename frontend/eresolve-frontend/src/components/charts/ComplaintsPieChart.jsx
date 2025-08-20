import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { STATUS_COLORS, STATUS_DISPLAY_NAMES } from '../../utils/constants';

const ComplaintsPieChart = ({ complaints = [] }) => {
  // Prepare data for pie chart
  const getPieChartData = () => {
    const statusCounts = {};
    
    complaints.forEach(complaint => {
      const status = complaint.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts)
      .filter(([status, count]) => count > 0)
      .map(([status, count]) => ({
        name: STATUS_DISPLAY_NAMES[status] || status,
        value: count,
        color: STATUS_COLORS[status]?.color || '#64748b'
      }));
  };

  const chartData = getPieChartData();

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="text-slate-800 font-medium">{data.name}</p>
          <p className="text-slate-600">
            Count: <span className="font-medium">{data.value}</span>
          </p>
          <p className="text-slate-600">
            Percentage: <span className="font-medium">
              {((data.value / complaints.length) * 100).toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-slate-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <PieChartIcon className="w-12 h-12 mb-4 text-slate-300" />
        <p className="text-center">
          No data available for chart.<br />
          Create some complaints to see the distribution.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <PieChartIcon className="w-5 h-5 text-slate-600 mr-2" />
        <h3 className="text-lg font-semibold text-slate-800">Complaints by Status</h3>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="text-center text-sm text-slate-600">
          <span className="font-medium">{complaints.length}</span> total complaints
        </div>
      </div>
    </div>
  );
};

export default ComplaintsPieChart;
