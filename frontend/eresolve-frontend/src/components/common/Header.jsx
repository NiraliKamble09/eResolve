import React, { useState, useEffect } from 'react';
import { ChevronDown, Shield, Users, Settings, Menu, Sun, Moon, UserPlus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(!isHome);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu after navigation
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <header
      className={`
        fixed top-0 w-full z-50 transition-all duration-300 py-4
        ${isScrolled 
          ? `${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl shadow-lg` 
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
         <a href='/'> {/* Logo */}
          <div className="flex items-center gap-3">
            <Shield className={`w-8 h-8 ${isScrolled && !isDark ? 'text-gray-900' : 'text-white'}`} />
            <span className={`text-2xl font-bold ${isScrolled && !isDark ? 'text-gray-900' : 'text-white'}`}>
              {t('brandName')}
            </span>
          </div></a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {['home', 'features', 'about', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`font-medium transition-colors hover:text-blue-500 capitalize ${
                  isScrolled && !isDark ? 'text-gray-900' : 'text-white'
                }`}
              >
                {t(section)}
              </button>
            ))}

            {/* Login Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={handleDropdownToggle}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all
                  ${isScrolled 
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                    : 'bg-white bg-opacity-10 text-white border-white border-opacity-30 hover:bg-blue-600 hover:border-blue-600'
                  }
                `}
              >
                {t('login')}
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className={`
                  absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg z-10 border py-2
                  ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                `}>
                  <a href="/login/user" className={`block px-4 py-2 text-sm hover:bg-gray-100 ${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900'}`}>
                    <Users className="w-4 h-4 inline mr-2" />
                    {t('userLogin')}
                  </a>
                  <a href="/login/staff" className={`block px-4 py-2 text-sm hover:bg-gray-100 ${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900'}`}>
                    <Settings className="w-4 h-4 inline mr-2" />
                    {t('staffLogin')}
                  </a>
                  <a href="/login/Admin" className={`block px-4 py-2 text-sm hover:bg-gray-100 ${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900'}`}>
                    <Shield className="w-4 h-4 inline mr-2" />
                    {t('adminLogin')}
                  </a>
                </div>
              )}
            </div>
            <a href="/register">

            <Button size="sm">
              <UserPlus className="w-4 h-4" />
              {t('register')}
            </Button></a>

            {/* Language Switcher */}
            <select
              value={i18n.language}
              onChange={e => i18n.changeLanguage(e.target.value)}
              className={`ml-4 px-2 py-1 rounded border ${isScrolled && !isDark ? 'bg-white text-gray-900 border-gray-300' : 'bg-gray-800 text-white border-gray-600'}`}
              aria-label="Switch language"
            >
              <option value="en">EN</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
            </select>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`
                p-2 rounded-full transition-colors
                ${isScrolled && !isDark ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white hover:bg-opacity-10'}
              `}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isScrolled && !isDark ? 'text-gray-900' : 'text-white'}`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 ${isScrolled && !isDark ? 'text-gray-900' : 'text-white'}`}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 rounded-lg mt-2 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex flex-col gap-4">
              {['home', 'features', 'about', 'contact'].map((section) => (
                <button 
                  key={section}
                  onClick={() => scrollToSection(section)} 
                  className={`text-left px-4 py-2 capitalize hover:bg-gray-100 rounded ${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900'}`}
                >
                  {t(section)}
                </button>
              ))}
              <div className="px-4 py-2">
                <Button size="sm" className="w-full">{t('login')}</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
