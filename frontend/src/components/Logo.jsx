import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Logo = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const isLegalPage = ['/legal', '/privacy', '/accessibility', '/en/legal', '/en/privacy', '/en/accessibility'].includes(location.pathname);
  const homePath = language === 'es' ? '/' : '/en';

  const handleClick = (e) => {
    if (!isLegalPage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Link
      to={homePath}
      className="nav-logo notranslate"
      translate="no"
      onClick={handleClick}
      aria-label={language === 'es' ? 'JFA, Jesús Fernández Abeledo, ir al inicio de la página' : 'JFA, Jesús Fernández Abeledo, go to home page'}
      data-content="JFA"
    >
      <span className="notranslate" translate="no">JFA</span>
    </Link>
  );
};

export default Logo;
