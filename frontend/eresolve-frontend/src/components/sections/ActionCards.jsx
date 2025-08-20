import React from 'react';
import { UserPlus, Search, Headset, ArrowRight, HelpCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';

const ActionCards = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const actions = [
    {
      icon: UserPlus,
      title: t('actionRegisterTitle'),
      description: t('actionRegisterDesc'),
      buttonText: t('getStarted'),
      gradient: 'from-green-500 to-green-600',
      action: () => alert(t('registerActionAlert'))
    },
    {
      icon: HelpCircle,
      title: t('actionFAQTitle'),
      description: t('actionFAQDesc'),
      buttonText: t('actionFAQButton', 'View FAQ'),
      gradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'from-emerald-600 to-emerald-700',
      action: () => alert('FAQ action clicked!')
    },
    {
      icon: Headset,
      title: t('actionSupportTitle'),
      description: t('actionSupportDesc'),
      buttonText: t('contactSupport'),
      gradient: 'from-purple-500 to-purple-600',
      action: () => {
        const element = document.getElementById('contact');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  ];

  return (
    <section className={`py-20 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('actionSectionTitle')}</h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('actionSectionDesc')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {actions.map((action, index) => {
            return (
              <Card key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <action.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {action.title}
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8 leading-relaxed`}>
                  {action.description}
                </p>
                <button
                  onClick={action.action}
                  className={
                    'bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 mx-auto hover:transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg'
                  }
                >
                  {action.title === t('actionFAQTitle') ? (
                    <a href="/faq" className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      {action.buttonText}
                    </a>
                  ) : action.title === t('actionRegisterTitle') ? (
                    <a href="/register" className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      {action.buttonText}
                    </a>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      {action.buttonText}
                    </>
                  )}
                </button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ActionCards;
