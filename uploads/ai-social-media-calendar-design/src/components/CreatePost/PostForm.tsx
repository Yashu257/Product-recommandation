import React from 'react';
import { Platform } from '../../types';
import { Calendar, Clock } from 'lucide-react';
import { PlatformIcon } from '../common/PlatformIcon';

interface PostFormProps {
  title: string;
  content: string;
  platforms: Platform[];
  date: string;
  time: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onPlatformsChange: (platforms: Platform[]) => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

const allPlatforms: Platform[] = ['twitter', 'facebook', 'instagram', 'linkedin'];

export const PostForm: React.FC<PostFormProps> = ({
  title,
  content,
  platforms,
  date,
  time,
  onTitleChange,
  onContentChange,
  onPlatformsChange,
  onDateChange,
  onTimeChange,
}) => {
  const togglePlatform = (platform: Platform) => {
    if (platforms.includes(platform)) {
      onPlatformsChange(platforms.filter(p => p !== platform));
    } else {
      onPlatformsChange([...platforms, platform]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Post Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter a title for your post..."
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Post Content
        </label>
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Write your post content here..."
          rows={8}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-500">{content.length} characters</p>
        </div>
      </div>

      {/* Platform Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select Platforms
        </label>
        <div className="grid grid-cols-2 gap-3">
          {allPlatforms.map((platform) => (
            <button
              key={platform}
              onClick={() => togglePlatform(platform)}
              className={`p-4 rounded-xl border-2 transition-all ${
                platforms.includes(platform)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <PlatformIcon platform={platform} size="md" />
                <span className="font-medium text-gray-900 capitalize">{platform}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Schedule Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Schedule Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="time"
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
