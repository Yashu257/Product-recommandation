import React, { useState } from 'react';
import { Sparkles, Send, Lightbulb, TrendingUp, Hash } from 'lucide-react';

export const AIAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');

  const suggestions = [
    {
      icon: Lightbulb,
      title: 'Content Ideas',
      description: 'Get AI-powered content suggestions for your niche',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: TrendingUp,
      title: 'Optimize Engagement',
      description: 'Improve your posts for better engagement',
      color: 'from-green-500 to-blue-500',
    },
    {
      icon: Hash,
      title: 'Smart Hashtags',
      description: 'Generate trending hashtags for your content',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`AI Processing: ${prompt}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
        </div>
        <p className="text-gray-600">Let AI help you create better social media content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Chat Messages */}
            <div className="h-96 p-6 overflow-y-auto bg-gray-50">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="p-4 bg-white rounded-2xl shadow-lg mb-4">
                  <Sparkles className="w-12 h-12 text-purple-500 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  How can I help you today?
                </h3>
                <p className="text-gray-600 max-w-md">
                  Ask me anything about content creation, hashtags, captions, or social media strategy.
                </p>
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask AI anything..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Suggestions Sidebar */}
        <div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {suggestions.map((suggestion) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={suggestion.title}
                    className={`w-full p-4 bg-gradient-to-br ${suggestion.color} rounded-xl text-white hover:shadow-lg transition-all text-left`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">{suggestion.title}</h4>
                        <p className="text-sm text-white/90">{suggestion.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
