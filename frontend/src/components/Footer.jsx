import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h2 className="footer-title">Jesús Fernández Abeledo</h2>
            <p className="footer-subtitle">{t.hero.subtitle}</p>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">{t.nav.contact}</h3>
            <ul className="footer-links">
              <li>
                <a href={`mailto:${t.contact.info.email}`} className="footer-link">
                  <Mail className="footer-icon" aria-hidden="true" />
                  {t.contact.info.email}
                </a>
              </li>
              <li>
                <a href={`tel:${t.contact.info.phone.replace(/\s/g, '')}`} className="footer-link">
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