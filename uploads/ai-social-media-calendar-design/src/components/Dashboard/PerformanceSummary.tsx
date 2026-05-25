import React from 'react';
import { TrendingUp, Eye, Heart, MessageCircle } from 'lucide-react';

export const PerformanceSummary: React.FC = () => {
  const metrics = [
    { label: 'Total Reach', value: '45.2K', change: '+12%', icon: Eye, color: 'text-blue-500' },
    { label: 'Engagement', value: '8.4K', change: '+18%', icon: Heart, color: 'text-pink-500' },
    { label: 'Comments', value: '1.2K', change: '+8%', icon: MessageCircle, color: 'text-purple-500' },
    { label: 'Growth', value: '+24%', change: '+5%', icon: TrendingUp, color: 'text-green-500' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Content Performance</h2>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${metric.color}`} />
                <span className="text-xs text-gray-600">{metric.label}</span>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <span className="text-xs text-green-600 font-medium">{metric.change}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
