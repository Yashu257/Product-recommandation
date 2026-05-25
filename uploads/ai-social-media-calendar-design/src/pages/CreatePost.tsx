import React, { useState } from 'react';
import { Platform } from '../types';
import { PostForm } from '../components/CreatePost/PostForm';
import { AITools } from '../components/CreatePost/AITools';
import { LivePreview } from '../components/CreatePost/LivePreview';
import { Save, Send } from 'lucide-react';

export const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleGenerateCaption = () => {
    const sampleCaptions = [
      "🚀 Exciting news! We're thrilled to announce our latest feature that will revolutionize your workflow. Stay tuned for updates! #Innovation #ProductLaunch",
      "💡 Pro tip: Consistency is key to building a strong social media presence. Plan ahead and let automation work for you! #SocialMediaTips #Marketing",
      "✨ Transform your content strategy with AI-powered insights. Schedule smarter, not harder! #ContentMarketing #AI",
    ];
    const randomCaption = sampleCaptions[Math.floor(Math.random() * sampleCaptions.length)];
    setContent(randomCaption);
  };

  const handleGenerateHashtags = () => {
    const hashtags = " #SocialMedia #Marketing #ContentCreation #DigitalMarketing #GrowthHacking";
    setContent(content + hashtags);
  };

  const handleRewriteContent = () => {
    if (!content) return;
    const rewritten = content
      .split('.')
      .reverse()
      .join('. ')
      .trim();
    setContent(rewritten);
  };

  const handleImproveEngagement = () => {
    if (!content) return;
    const improved = `🎯 ${content}\n\n💭 What do you think? Share your thoughts in the comments!`;
    setContent(improved);
  };

  const handleSaveDraft = () => {
    alert('Post saved as draft!');
  };

  const handleSchedule = () => {
    alert('Post scheduled successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Post</h1>
        <p className="text-gray-600">Create and schedule your social media content</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <PostForm
              title={title}
              content={content}
              platforms={platforms}
              date={date}
              time={time}
              onTitleChange={setTitle}
              onContentChange={setContent}
              onPlatformsChange={setPlatforms}
              onDateChange={setDate}
              onTimeChange={setTime}
            />
          </div>

          {/* AI Tools */}
          <AITools
            onGenerateCaption={handleGenerateCaption}
            onGenerateHashtags={handleGenerateHashtags}
            onRewriteContent={handleRewriteContent}
            onImproveEngagement={handleImproveEngagement}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSaveDraft}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <Save className="w-5 h-5" />
              Save as Draft
            </button>
            <button
              onClick={handleSchedule}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Send className="w-5 h-5" />
              Schedule Post
            </button>
          </div>
        </div>

        {/* Right Column - Preview (1/3) */}
        <div>
          <LivePreview
            title={title}
            content={content}
            platforms={platforms}
            date={date}
            time={time}
          />
        </div>
      </div>
    </div>
  );
};
