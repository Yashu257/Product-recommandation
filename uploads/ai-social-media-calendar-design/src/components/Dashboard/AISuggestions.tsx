import React from 'react';
import { AIContentSuggestion } from '../../types';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PlatformIcon } from '../common/PlatformIcon';

interface AISuggestionsProps {
  suggestions: AIContentSuggestion[];
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({ suggestions }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h2 className="text-lg font-bold text-gray-900">AI Content Suggestions</h2>
      </div>
      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all cursor-pointer group"
          >
            <h3 className="font-semibold text-gray-900 text-sm mb-2">{suggestion.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{suggestion.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {suggestion.platforms.map((platform) => (
                  <PlatformIcon key={platform} platform={platform} size="sm" />
                ))}
              </div>
              <button className="flex items-center gap-1 text-sm text-purple-600 font-medium group-hover:gap-2 transition-all">
                Use this
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
