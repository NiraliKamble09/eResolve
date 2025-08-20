import React from 'react';
import { Users, Upload, BarChart3, ThumbsUp, Smartphone, Shield, Settings, Database } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';

const Features = () => {

  const { isDark } = useTheme();
  const { t } = useTranslation();

  const features = [
    {
      icon: Users,
      title: t('featureTeamCollab'),
      description: t('featureTeamCollabDesc')
    },
    {
      icon: Upload,
      title: t('featureFileUpload'),
      description: t('featureFileUploadDesc')
    },
    {
      icon: BarChart3,
      title: t('featureAnalytics'),
      description: t('featureAnalyticsDesc')
    },
    {
      icon: ThumbsUp,
      title: t('featureCustomerSatisfaction'),
      description: t('featureCustomerSatisfactionDesc')
    },
    {
      icon: Smartphone,
      title: t('featureMobileFriendly'),
      description: t('featureMobileFriendlyDesc')
    },
    {
      icon: Shield,
      title: t('featureSecurity'),
      description: t('featureSecurityDesc')
    },
    {
      icon: Settings,
      title: t('featureCustomWorkflows'),
      description: t('featureCustomWorkflowsDesc')
    },
    {
      icon: Smartphone,
      title: t('featurePushNotifications'),
      description: t('featurePushNotificationsDesc')
    },
    {
      icon: Database,
      title: t('featureDataExport'),
      description: t('featureDataExportDesc')
    }
  ];

  return (
    <section id="features" className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('featuresSectionTitle')}</h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('featuresSectionDesc')}</p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {feature.title}
              </h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
