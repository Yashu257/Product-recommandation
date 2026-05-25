import React from 'react';
import { Sparkles, RefreshCw, TrendingUp, Hash } from 'lucide-react';

interface AIToolsProps {
  onGenerateCaption: () => void;
  onGenerateHashtags: () => void;
  onRewriteContent: () => void;
  onImproveEngagement: () => void;
}

export const AITools: React.FC<AIToolsProps> = ({
  onGenerateCaption,
  onGenerateHashtags,
  onRewriteContent,
  onImproveEngagement,
}) => {
  const tools = [
    {
      label: 'Generate Caption',
      icon: Sparkles,
      onClick: onGenerateCaption,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Generate Hashtags',
      icon: Hash,
      onClick: onGenerateHashtags,
      color: 'from-blue-500 to-purple-500',
    },
    {
      label: 'Rewrite Content',
      icon: RefreshCw,
      onClick: onRewriteContent,
      color: 'from-pink-500 to-orange-500',
    },
    {
      label: 'Improve Engagement',
      icon: TrendingUp,
      onClick: onImproveEngagement,
      color: 'from-green-500 to-blue-500',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-bold text-gray-900">AI Features</h3>
      </div>
      <div className="space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.label}
              onClick={tool.onClick}
              className={`w-full p-3 bg-gradient-to-r ${tool.color} text-white rounded-xl hover:shadow-lg transition-all group`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">{tool.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
