import React from 'react';
import { PenSquare, Sparkles, Hash } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (page: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const actions = [
    {
      id: 'create',
      label: 'Create Post',
      icon: PenSquare,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'caption',
      label: 'Generate Caption',
      icon: Sparkles,
      color: 'from-blue-500 to-purple-500',
    },
    {
      id: 'hashtags',
      label: 'Generate Hashtags',
      icon: Hash,
      color: 'from-pink-500 to-orange-500',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onNavigate('create')}
              className={`w-full p-4 bg-gradient-to-br ${action.color} rounded-xl text-white hover:shadow-lg transition-all group`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-semibold">{action.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
