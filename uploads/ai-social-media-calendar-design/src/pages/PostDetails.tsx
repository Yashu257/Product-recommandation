import React from 'react';
import { Post } from '../types';
import { PlatformIcon } from '../components/common/PlatformIcon';
import { Calendar, Clock, Edit, Trash2, Copy, RefreshCw, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

interface PostDetailsProps {
  post: Post;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onReschedule: () => void;
}

const statusConfig = {
  draft: { color: 'bg-gray-100 text-gray-700', label: 'Draft' },
  scheduled: { color: 'bg-purple-100 text-purple-700', label: 'Scheduled' },
  published: { color: 'bg-green-100 text-green-700', label: 'Published' },
};

export const PostDetails: React.FC<PostDetailsProps> = ({
  post,
  onBack,
  onEdit,
  onDelete,
  onDuplicate,
  onReschedule,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusConfig[post.status].color}`}>
                {statusConfig[post.status].label}
              </span>
              <div className="flex items-center gap-2">
                {post.platforms.map((platform) => (
                  <PlatformIcon key={platform} platform={platform} size="md" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Content */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Post Content</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            </div>
          </div>

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Hashtags</h2>
              <div className="flex flex-wrap gap-2">
                {post.hashtags.map((hashtag) => (
                  <span
                    key={hashtag}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium"
                  >
                    #{hashtag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Platforms */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Platforms</h2>
            <div className="grid grid-cols-2 gap-3">
              {post.platforms.map((platform) => (
                <div
                  key={platform}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <PlatformIcon platform={platform} size="md" />
                  <span className="font-medium text-gray-900 capitalize">{platform}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Schedule Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Schedule</h2>
            <div className="space-y-3">
              {post.scheduledDate && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Date</p>
                    <p className="font-medium text-gray-900">
                      {format(post.scheduledDate, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              )}
              {post.scheduledTime && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Time</p>
                    <p className="font-medium text-gray-900">{post.scheduledTime}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-2">
              <button
                onClick={onEdit}
                className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-xl font-medium hover:bg-purple-100 transition-colors"
              >
                <Edit className="w-5 h-5" />
                Edit Post
              </button>
              <button
                onClick={onDuplicate}
                className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors"
              >
                <Copy className="w-5 h-5" />
                Duplicate Post
              </button>
              <button
                onClick={onReschedule}
                className="w-full flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl font-medium hover:bg-orange-100 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Reschedule
              </button>
              <button
                onClick={onDelete}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-700 rounded-xl font-medium hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Delete Post
              </button>
            </div>
          </div>

          {/* Meta Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Created</p>
                <p className="font-medium text-gray-900">
                  {format(post.createdAt, 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {format(post.updatedAt, 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
