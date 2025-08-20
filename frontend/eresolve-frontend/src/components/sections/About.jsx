import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  return (
    <section id="about" className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* About Text */}
          <div>
            <h2 className={`text-4xl lg:text-5xl font-black mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('aboutSectionTitle')}</h2>
            <div className={`space-y-6 text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>{t('aboutSectionDesc1')}</p>
              <p>{t('aboutSectionDesc2')}</p>
              <p>{t('aboutSectionDesc3')}</p>
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              {[
                { number: '95%', label: t('userSatisfaction') },
                { number: '48hrs', label: t('averageResponse') },
                { number: '100%', label: t('issueTracking') },
                { number: '24/7', label: t('platformAccess') }
              ].map((stat, index) => (
                <div key={index} className={`text-center p-6 rounded-xl border-l-4 border-blue-500 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Workflow Diagram */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white bg-opacity-10 rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-400 bg-opacity-20 rounded-full transform -translate-x-4 translate-y-4"></div>
            <h3 className="text-xl font-bold mb-8">{t('workflowTitle')}</h3>
            <div className="space-y-6">
              {[
                { number: '1', title: t('step1Title'), desc: t('step1Desc') },
                { number: '2', title: t('step2Title'), desc: t('step2Desc') },
                { number: '3', title: t('step3Title'), desc: t('step3Desc') },
                { number: '4', title: t('step4Title'), desc: t('step4Desc') }
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{step.number}</div>
                  <div>
                    <h4 className="font-semibold mb-1">{step.title}</h4>
                    <p className="text-sm text-gray-300">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Progress indicator */}
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((dot, index) => (
                  <div 
                    key={index} 
                    className={`w-2 h-2 rounded-full ${index < 3 ? 'bg-blue-400' : 'bg-gray-600'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
