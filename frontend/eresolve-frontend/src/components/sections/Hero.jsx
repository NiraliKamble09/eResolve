import React from 'react';
import { Shield, Users, BarChart3, Smartphone, Upload, Phone, Info } from 'lucide-react';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    { icon: Shield, text: t('heroFeatureSecure') },
    { icon: Users, text: t('featureTeamCollab') },
    { icon: BarChart3, text: t('featureAnalytics') },
    { icon: Smartphone, text: t('featureMobileFriendly') },
    { icon: Upload, text: t('featureFileUpload') }
  ];

  const stats = [
    { number: '156', label: t('heroStatResolved') },
    { number: '92%', label: t('heroStatSatisfaction') },
    { number: '1.8d', label: t('heroStatAvgResolution') }
  ];

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 bg-opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500 bg-opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Text */}
          <div className="text-white space-y-8">
            <h1 className="text-5xl lg:text-6xl font-black leading-tight">
              {t('heroTitle1')}
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"> {t('brandName')}</span> {t('heroTitle2')}
            </h1>

            <div className="space-y-6 text-lg text-gray-300">
              <p>{t('heroDesc1')}</p>
              <p>{t('heroDesc2')}</p>
            </div>

            {/* Features List */}
            <ul className="space-y-4">
              {features.map((item, index) => (
                <li key={index} className="flex items-center gap-4 text-gray-300">
                  <item.icon className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => scrollToSection('contact')}>
                <Phone className="w-5 h-5" />
                {t('contactUs')}
              </Button>
              <Button variant="secondary" onClick={() => scrollToSection('features')}>
                <Info className="w-5 h-5" />
                {t('learnMore')}
              </Button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20 max-w-md w-full">
              {/* Mockup Header */}
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>

              {/* Mockup Content */}
              <div className="bg-white bg-opacity-5 rounded-lg p-6 mb-4">
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t('dashboardTitle')}
                </h3>
                <div className="space-y-2">
                  <div className="h-2 bg-blue-400 rounded-full w-3/4"></div>
                  <div className="h-2 bg-green-400 rounded-full w-1/2"></div>
                  <div className="h-2 bg-yellow-400 rounded-full w-5/6"></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
