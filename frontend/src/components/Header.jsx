import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { useFocusTrap } from '../hooks/useFocusTrap';

const Header = () => {
  const { language, switchLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useFocusTrap(mobileMenuOpen);
  const menuButtonRef = React.useRef(null);

  const navItems = [
    { href: '#sobre-mi', label: t.nav.about },
    { href: '#servicios', label: t.nav.services },
    { href: '#experiencia', label: t.nav.experience },
    { href: '#habilidades', label: t.nav.skills },
    { href: '#contacto', label: t.nav.contact }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
      
      // If navigating to contact section, focus on name input
      if (href === '#contacto') {
        setTimeout(() => {
          const nameInput = document.querySelector('#name');
          if (nameInput) {
            nameInput.focus();
          }
        }, 800); // Wait for smooth scroll to complete
      }
    }
  };

  const toggleLanguage = () => {
    switchLanguage(language === 'es' ? 'en' : 'es');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    // Return focus to menu button when closing
    setTimeout(() => {
      menuButtonRef.current?.focus();
    }, 100);
  };

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="header" role="banner">
      <div className="container">
        <nav className="nav" role="navigation" aria-label="Main navigation">
          <div className="nav-brand">
            <a 
              href="/" 
              className="nav-logo" 
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(e, '#hero');
              }}
              aria-label="Ir al inicio de la página"
            >
              JFA
            </a>
          </div>

          {/* Desktop Navigation */}
          <ul className="nav-menu desktop-only" role="menubar">
            {navItems.map((item, index) => (
              <li key={index} role="none">
                <a
                  href={item.href}
                  className="nav-link"
                  onClick={(e) => handleNavClick(e, item.href)}
                  role="menuitem"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Language Switcher & Mobile Menu Button */}
          <div className="nav-actions">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
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

        {/* Mobile Menu */}
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
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;