
import React from 'react';
import { Shield, Users, Upload, BarChart3, ThumbsUp, Smartphone, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';


const Marquee = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const items = [
    { icon: Shield, text: t('marqueeIssueTracking') },
    { icon: Users, text: t('marqueeMultiRole') },
    { icon: Upload, text: t('marqueeMediaUpload') },
    { icon: BarChart3, text: t('marqueeRealtimeAnalytics') },
    { icon: ThumbsUp, text: t('marqueeVoting') },
    { icon: Smartphone, text: t('marqueeCrossPlatform') },
    { icon: Shield, text: t('marqueeEnterpriseSecurity') },
    { icon: Clock, text: t('marqueeAvailability') }
  ];

  return (
    <div className={`py-6 overflow-hidden border-t border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-gray-300'}`}>
      <div className="flex whitespace-nowrap animate-scroll">
        {/* Duplicate items for seamless loop */}
        {[...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center gap-3 mx-8 flex-shrink-0">
            <item.icon className="w-5 h-5 text-blue-600" />
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
