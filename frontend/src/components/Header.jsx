import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { useFocusTrap } from '../hooks/useFocusTrap';
import Logo from './Logo';

const Header = () => {
  const { language, switchLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useFocusTrap(mobileMenuOpen);
  const menuButtonRef = React.useRef(null);

  const legalPaths = ['/legal', '/privacidad', '/accesibilidad', '/en/legal', '/en/privacy', '/en/accessibility'];
  const isLegalPage = legalPaths.includes(location.pathname);

  const navItems = [
    { href: '#sobre-mi', label: t.nav.about },
    { href: '#servicios', label: t.nav.services },
    { href: '#experiencia', label: t.nav.experience },
    { href: '#habilidades', label: t.nav.skills },
    { href: '#contacto', label: t.nav.contact }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (isLegalPage) {
      const homePath = language === 'es' ? '/' : '/en';
      navigate(homePath, { state: { scrollTo: href } });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleLanguage = () => {
    switchLanguage(language === 'es' ? 'en' : 'es');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Construct absolute URL for the CV
  const cvDownloadUrl = useMemo(() => {
    return `${window.location.origin}/CV_Accesibilidad_Jesus_Fernandez.pdf`;
  }, []);

  return (
    <header className="header" role="banner">
      <div className="container">
        <nav className="nav" role="navigation" aria-label="Main navigation">
          <div className="nav-brand">
            <Logo />
          </div>

          <ul className="nav-menu desktop-only" role="menubar">
            {navItems.map((item, index) => (
              <li key={index} role="none">
                <a
                  href={item.href}
                  className="nav-link"
                  onClick={(e) => handleNavClick(e, item.href)}
                  role="menuitem"
                  aria-label={language === 'es'
                    ? `Ir a sección ${item.label}`
                    : `Go to ${item.label} section`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              aria-label={language === 'es'
                ? `Idioma actual: Español. Cambiar a Inglés`
                : `Current language: English. Switch to Spanish`}
              className="lang-button"
            >
              <Globe className="icon" aria-hidden="true" />
              <span className="sr-only">{language === 'es' ? 'ES' : 'EN'}</span>
              <span aria-hidden="true" className="lang-text">{language === 'es' ? 'ES' : 'EN'}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.menu}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              className="mobile-menu-button mobile-only"
              ref={menuButtonRef}
            >
              {mobileMenuOpen ? (
                <X className="icon" aria-hidden="true" />
              ) : (
                <Menu className="icon" aria-hidden="true" />
              )}
            </Button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <>
            <div
              className="mobile-menu-overlay"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
            <div
              ref={menuRef}
              id="mobile-menu"
              className="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={t.nav.menu}
            >
              <ul className="mobile-nav-list" role="menu">
                {navItems.map((item, index) => (
                  <li key={index} role="none">
                    <a
                      href={item.href}
                      className="mobile-nav-link"
                      onClick={(e) => handleNavClick(e, item.href)}
                      role="menuitem"
                      aria-label={language === 'es'
                        ? `Ir a sección ${item.label}`
                        : `Go to ${item.label} section`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li role="none" className="mobile-nav-cv">
                  <a
                    href={cvDownloadUrl}
                    download="CV_Accesibilidad_Jesus_Fernandez.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    type="application/pdf"
                    className="mobile-nav-link download-cv-link"
                    // We remove onClick={closeMobileMenu} to prevent the component from
                    // unmounting immediately, which can block the download trigger on mobile browsers.
                    // The menu can be closed by tapping the overlay or the sections above.
                    role="menuitem"
                    aria-label={language === 'es'
                      ? 'Descargar CV en formato PDF'
                      : 'Download CV in PDF format'}
                  >
                    {language === 'es' ? 'Descargar CV' : 'Download CV'}
                  </a>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;