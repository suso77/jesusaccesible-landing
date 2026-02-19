import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { content } from '../data/mockData';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/en')) {
      setLanguage('en');
    } else {
      setLanguage('es');
    }
  }, [location.pathname]);

  const switchLanguage = (newLang) => {
    if (newLang === 'en') {
      navigate('/en');
    } else {
      navigate('/');
    }
  };

  const t = content[language];

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};