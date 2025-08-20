import React from 'react';
import { 
  Shield, Home, Star, Users, HelpCircle, Book, Code, GraduationCap,
  Mail, Phone, MapPin, Clock, Facebook, Twitter, Linkedin, Github, Instagram 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: Facebook, href: '#facebook', label: t('facebook') },
    { icon: Twitter, href: '#twitter', label: t('twitter') },
    { icon: Linkedin, href: '#linkedin', label: t('linkedin') },
    { icon: Github, href: '#github', label: t('github') },
    { icon: Instagram, href: '#instagram', label: t('instagram') }
  ];

  const quickLinks = [
    { icon: Home, text: t('home'), href: '#home' },
    { icon: Star, text: t('features'), href: '#features' },
    { icon: Users, text: t('about'), href: '#about' }
  ];

  const supportLinks = [
    { icon: HelpCircle, text: t('helpCenter'), href: '#help' },
    { icon: Book, text: t('documentation'), href: '#docs' },
    { icon: Code, text: t('apiReference'), href: '#api' },
    { icon: GraduationCap, text: t('tutorials'), href: '#tutorials' }
  ];

  const contactInfo = [
    { icon: Mail, text: t('supportEmail') },
    { icon: Phone, text: t('supportPhone') },
    { icon: MapPin, text: t('supportAddress') },
    { icon: Clock, text: t('supportHours') }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8" />
              <span className="text-2xl font-bold">eResolve</span>
            </div>
            <p className="text-gray-300 mb-8 max-w-md leading-relaxed">
              {t('footerDescription')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">{t('quickLinks')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">{t('support')}</h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-800 rounded-xl p-8 mb-12 border-l-4 border-blue-500">
          <h4 className="text-lg font-bold mb-6">{t('contactInformation')}</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((contact, index) => (
              <div key={index} className="flex items-center gap-3">
                <contact.icon className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">{contact.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-center md:text-left">
            <p>&copy; 2025 eResolve. Built with Spring Boot & ReactJS. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#privacy" className="text-gray-400 hover:text-white transition-colors">
              {t('privacyPolicy')}
            </a>
            <a href="#terms" className="text-gray-400 hover:text-white transition-colors">
              {t('termsOfService')}
            </a>
            <a href="#security" className="text-gray-400 hover:text-white transition-colors">
              {t('security')}
            </a>
            <a href="#cookies" className="text-gray-400 hover:text-white transition-colors">
              {t('cookiePolicy')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
