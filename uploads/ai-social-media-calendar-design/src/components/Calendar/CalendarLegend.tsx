import React from 'react';

export const CalendarLegend: React.FC = () => {
  const statuses = [
    { label: 'Draft', color: 'bg-gray-400' },
    { label: 'Scheduled', color: 'bg-purple-500' },
    { label: 'Published', color: 'bg-green-500' },
  ];

  return (
    <div className="flex items-center gap-6 p-4 bg-white rounded-2xl border border-gray-200">
      <span className="text-sm font-medium text-gray-600">Status:</span>
      <div className="flex items-center gap-4">
        {statuses.map((status) => (
          <div key={status.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${status.color}`}></div>
            <span className="text-sm text-gray-700">{status.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
