import React, { useState } from 'react';
import { Post } from '../types';
import { CalendarHeader } from '../components/Calendar/CalendarHeader';
import { MonthView } from '../components/Calendar/MonthView';
import { WeekView } from '../components/Calendar/WeekView';
import { CalendarLegend } from '../components/Calendar/CalendarLegend';
import { addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';

interface CalendarPageProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ posts, onPostClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  return (
    <div className="space-y-6">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      <CalendarLegend />

      {view === 'month' ? (
        <MonthView currentDate={currentDate} posts={posts} onPostClick={onPostClick} />
      ) : (
        <WeekView currentDate={currentDate} posts={posts} onPostClick={onPostClick} />
      )}
    </div>
  );
};
