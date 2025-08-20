import React, { createContext, useContext, useState } from 'react';

// Language translations
const translations = {
  en: {
    login: 'Login',
    userLogin: 'User Login',
    staffLogin: 'Staff Login',
    adminLogin: 'Admin Login',
    register: 'Register',
    home: 'Home',
    features: 'Features',
    about: 'About',
    contact: 'Contact',
    // ...add more keys as needed
  },
  hi: {
    login: 'लॉगिन',
    userLogin: 'उपयोगकर्ता लॉगिन',
    staffLogin: 'स्टाफ लॉगिन',
    adminLogin: 'एडमिन लॉगिन',
    register: 'पंजीकरण',
    home: 'होम',
    features: 'विशेषताएं',
    about: 'के बारे में',
    contact: 'संपर्क',
    // ...add more keys as needed
  },
  te: {
    login: 'లాగిన్',
    userLogin: 'యూజర్ లాగిన్',
    staffLogin: 'స్టాఫ్ లాగిన్',
    adminLogin: 'అడ్మిన్ లాగిన్',
    register: 'రిజిస్టర్',
    home: 'హోమ్',
    features: 'ఫీచర్స్',
    about: 'గురించి',
    contact: 'సంప్రదించండి',
    // ...add more keys as needed
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
