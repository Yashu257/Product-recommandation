import React from 'react';
import { Post } from '../../types';
import { PlatformIcon } from '../common/PlatformIcon';

interface RecentPostsProps {
  posts: Post[];
}

const statusConfig = {
  draft: { color: 'bg-gray-100 text-gray-700', label: 'Draft' },
  scheduled: { color: 'bg-purple-100 text-purple-700', label: 'Scheduled' },
  published: { color: 'bg-green-100 text-green-700', label: 'Published' },
};

export const RecentPosts: React.FC<RecentPostsProps> = ({ posts }) => {
  const recentPosts = posts
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 6);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Posts</h2>
      <div className="space-y-3">
        {recentPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-sm flex-1">{post.title}</h3>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig[post.status].color}`}>
                {statusConfig[post.status].label}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.content}</p>
            <div className="flex items-center gap-1">
              {post.platforms.map((platform) => (
                <PlatformIcon key={platform} platform={platform} size="sm" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
