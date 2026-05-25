import React from 'react';
import { User, Bell, Shield, CreditCard, Palette, Globe } from 'lucide-react';

export const Settings: React.FC = () => {
  const sections = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your account information and preferences',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure your notification preferences',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Control your privacy and security settings',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: CreditCard,
      title: 'Billing',
      description: 'Manage your subscription and payment methods',
      color: 'bg-pink-50 text-pink-600',
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize the look and feel of your dashboard',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      icon: Globe,
      title: 'Connected Accounts',
      description: 'Manage your connected social media accounts',
      color: 'bg-indigo-50 text-indigo-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${section.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Account Information</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">sarah.johnson@example.com</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="font-medium text-gray-900">Pro Plan</p>
            </div>
            <button className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors">
              Upgrade
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium text-gray-900">January 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
