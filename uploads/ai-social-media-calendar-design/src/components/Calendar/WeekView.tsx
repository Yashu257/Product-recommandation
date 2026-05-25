import React from 'react';
import { Post } from '../../types';
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  format,
  isToday
} from 'date-fns';
import { PlatformIcon } from '../common/PlatformIcon';
import { Clock } from 'lucide-react';

interface WeekViewProps {
  currentDate: Date;
  posts: Post[];
  onPostClick: (post: Post) => void;
}

const statusColors = {
  draft: 'border-l-gray-400 bg-gray-50',
  scheduled: 'border-l-purple-500 bg-purple-50',
  published: 'border-l-green-500 bg-green-50',
};

export const WeekView: React.FC<WeekViewProps> = ({ currentDate, posts, onPostClick }) => {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getPostsForDay = (day: Date) => {
    return posts
      .filter(post => 
        post.scheduledDate && 
        format(post.scheduledDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      )
      .sort((a, b) => {
        if (!a.scheduledTime || !b.scheduledTime) return 0;
        return a.scheduledTime.localeCompare(b.scheduledTime);
      });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayPosts = getPostsForDay(day);
          const isTodayDate = isToday(day);

          return (
            <div
              key={index}
              className={`border-r border-gray-200 ${
                isTodayDate ? 'bg-purple-50/30' : ''
              }`}
            >
              {/* Day Header */}
              <div className="p-4 border-b border-gray-200 text-center">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  {format(day, 'EEE')}
                </p>
                <p
                  className={`text-lg font-bold ${
                    isTodayDate
                      ? 'w-8 h-8 mx-auto flex items-center justify-center bg-purple-500 text-white rounded-full'
                      : 'text-gray-900'
                  }`}
                >
                  {format(day, 'd')}
                </p>
              </div>

              {/* Posts */}
              <div className="p-2 space-y-2 min-h-96">
                {dayPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onPostClick(post)}
                    className={`p-3 rounded-lg border-l-2 ${statusColors[post.status]} cursor-pointer hover:shadow-md transition-all`}
                  >
                    <div className="flex items-center gap-1 mb-2">
                      {post.platforms.map((platform) => (
                        <PlatformIcon key={platform} platform={platform} size="sm" />
                      ))}
                    </div>
                    <p className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
                      {post.title}
                    </p>
                    {post.scheduledTime && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{post.scheduledTime}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
