import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

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
      
      // If navigating to contact section, focus on name input
      if (href === '#contacto') {
        setTimeout(() => {
          const nameInput = document.querySelector('#name');
          if (nameInput) {
            nameInput.focus();
          }
        }, 800);
      }
    }
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h2 className="footer-title">Jesús Fernández Abeledo</h2>
            <p className="footer-subtitle">{t.hero.subtitle}</p>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">{t.footer.navigation}</h3>
            <ul className="footer-links">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href} 
                    className="footer-link"
                    onClick={(e) => handleNavClick(e, item.href)}
                    aria-label={language === 'es'
                      ? `Ir a sección ${item.label}`
                      : `Go to ${item.label} section`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">{t.nav.contact}</h3>
            <ul className="footer-links">
              <li>
                <a 
                  href={`mailto:${t.contact.info.email}`} 
                  className="footer-link"
                  aria-label={language === 'es' 
                    ? `Correo electrónico: ${t.contact.info.email}` 
                    : `Email: ${t.contact.info.email}`}
                >
                  <Mail className="footer-icon" aria-hidden="true" />
                  {t.contact.info.email}
                </a>
              </li>
              <li>
                <a 
                  href={`tel:${t.contact.info.phone.replace(/\s/g, '')}`} 
                  className="footer-link"
                  aria-label={language === 'es' 
                    ? `Teléfono: ${t.contact.info.phone}` 
                    : `Phone: ${t.contact.info.phone}`}
                >
                  <Phone className="footer-icon" aria-hidden="true" />
                  {t.contact.info.phone}
                </a>
              </li>
              <li>
                <span className="footer-text">
                  <MapPin className="footer-icon" aria-hidden="true" />
                  {t.contact.info.location}
                </span>
              </li>
              <li>
                <a 
                  href={`https://${t.contact.info.linkedin}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-link"
                  aria-label={language === 'es' 
                    ? 'LinkedIn, se abre en una nueva ventana' 
                    : 'LinkedIn, opens in a new window'}
                >
                  <Linkedin className="footer-icon" aria-hidden="true" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">{t.footer.copyright}</p>
          <p className="footer-wcag">{t.footer.wcag}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;