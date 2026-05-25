import React from 'react';
import { Platform } from '../../types';
import { PlatformIcon } from '../common/PlatformIcon';
import { Calendar, Clock } from 'lucide-react';

interface LivePreviewProps {
  title: string;
  content: string;
  platforms: Platform[];
  date: string;
  time: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  title,
  content,
  platforms,
  date,
  time,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Live Preview</h3>
      
      <div className="space-y-4">
        {/* Preview Card */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          {/* Platforms */}
          {platforms.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              {platforms.map((platform) => (
                <PlatformIcon key={platform} platform={platform} size="md" />
              ))}
            </div>
          )}

          {/* Title */}
          {title && (
            <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
          )}

          {/* Content */}
          <div className="text-gray-700 whitespace-pre-wrap mb-3">
            {content || <span className="text-gray-400">Your content will appear here...</span>}
          </div>

          {/* Schedule Info */}
          {(date || time) && (
            <div className="pt-3 border-t border-gray-200 space-y-2">
              {date && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</span>
                </div>
              )}
              {time && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{time}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Character Limits */}
        {platforms.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">Platform Limits</h4>
            <div className="space-y-1">
              {platforms.includes('twitter') && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Twitter/X</span>
                  <span className={content.length > 280 ? 'text-red-600 font-medium' : 'text-gray-500'}>
                    {content.length}/280
                  </span>
                </div>
              )}
              {platforms.includes('facebook') && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Facebook</span>
                  <span className="text-gray-500">{content.length}/63,206</span>
                </div>
              )}
              {platforms.includes('instagram') && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Instagram</span>
                  <span className={content.length > 2200 ? 'text-red-600 font-medium' : 'text-gray-500'}>
                    {content.length}/2,200
                  </span>
                </div>
              )}
              {platforms.includes('linkedin') && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">LinkedIn</span>
                  <span className={content.length > 3000 ? 'text-red-600 font-medium' : 'text-gray-500'}>
                    {content.length}/3,000
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
