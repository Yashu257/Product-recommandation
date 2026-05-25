import React from 'react';
import { Post } from '../../types';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { PlatformIcon } from '../common/PlatformIcon';

interface UpcomingScheduleProps {
  posts: Post[];
}

export const UpcomingSchedule: React.FC<UpcomingScheduleProps> = ({ posts }) => {
  const scheduledPosts = posts
    .filter(p => p.status === 'scheduled')
    .sort((a, b) => (a.scheduledDate?.getTime() || 0) - (b.scheduledDate?.getTime() || 0))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Schedule</h2>
      <div className="space-y-3">
        {scheduledPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-sm">{post.title}</h3>
              <div className="flex items-center gap-1">
                {post.platforms.map((platform) => (
                  <PlatformIcon key={platform} platform={platform} size="sm" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.content}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.scheduledDate ? format(post.scheduledDate, 'MMM dd, yyyy') : ''}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.scheduledTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
