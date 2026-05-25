import React from 'react';
import { FileText, Calendar, FileEdit, CheckCircle } from 'lucide-react';
import { StatCard } from '../components/Dashboard/StatCard';
import { UpcomingSchedule } from '../components/Dashboard/UpcomingSchedule';
import { RecentPosts } from '../components/Dashboard/RecentPosts';
import { AISuggestions } from '../components/Dashboard/AISuggestions';
import { QuickActions } from '../components/Dashboard/QuickActions';
import { PerformanceSummary } from '../components/Dashboard/PerformanceSummary';
import { mockStats, mockPosts, mockAISuggestions } from '../data/mockData';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Posts"
          value={mockStats.totalPosts}
          icon={FileText}
          color="purple"
          trend="+8%"
        />
        <StatCard
          title="Scheduled Posts"
          value={mockStats.scheduledPosts}
          icon={Calendar}
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Draft Posts"
          value={mockStats.draftPosts}
          icon={FileEdit}
          color="orange"
        />
        <StatCard
          title="Published Posts"
          value={mockStats.publishedPosts}
          icon={CheckCircle}
          color="green"
          trend="+15%"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <UpcomingSchedule posts={mockPosts} />
          <RecentPosts posts={mockPosts} />
          <PerformanceSummary />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <QuickActions onNavigate={onNavigate} />
          <AISuggestions suggestions={mockAISuggestions} />
        </div>
      </div>
    </div>
  );
};
