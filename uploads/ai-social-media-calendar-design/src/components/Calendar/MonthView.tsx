import React from 'react';
import { Post } from '../../types';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns';
import { PlatformIcon } from '../common/PlatformIcon';

interface MonthViewProps {
  currentDate: Date;
  posts: Post[];
  onPostClick: (post: Post) => void;
}

const statusColors = {
  draft: 'border-l-gray-400 bg-gray-50',
  scheduled: 'border-l-purple-500 bg-purple-50',
  published: 'border-l-green-500 bg-green-50',
};

export const MonthView: React.FC<MonthViewProps> = ({ currentDate, posts, onPostClick }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getPostsForDay = (day: Date) => {
    return posts.filter(post => 
      post.scheduledDate && isSameDay(post.scheduledDate, day)
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Week Day Headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day) => (
          <div key={day} className="p-4 text-center">
            <span className="text-sm font-semibold text-gray-600">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayPosts = getPostsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);

          return (
            <div
              key={index}
              className={`min-h-32 p-2 border-r border-b border-gray-200 ${
                !isCurrentMonth ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-medium ${
                    isTodayDate
                      ? 'w-7 h-7 flex items-center justify-center bg-purple-500 text-white rounded-full'
                      : isCurrentMonth
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}
                >
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className="space-y-1">
                {dayPosts.slice(0, 2).map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onPostClick(post)}
                    className={`p-2 rounded-lg border-l-2 ${statusColors[post.status]} cursor-pointer hover:shadow-md transition-all text-xs`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      {post.platforms.slice(0, 2).map((platform) => (
                        <PlatformIcon key={platform} platform={platform} size="sm" />
                      ))}
                    </div>
                    <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                    {post.scheduledTime && (
                      <p className="text-gray-500 mt-0.5">{post.scheduledTime}</p>
                    )}
                  </div>
                ))}
                {dayPosts.length > 2 && (
                  <p className="text-xs text-gray-500 pl-2">+{dayPosts.length - 2} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
