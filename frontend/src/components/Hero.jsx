import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Download, Mail } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const RAW_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const BACKEND_URL = (RAW_BACKEND_URL || '').replace(/\/$/, '');

const Hero = () => {
  const { language, t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const handleContactClick = () => {
    const contactSection = document.querySelector('#contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  // handleDownloadCV no longer needed
  return (
    <section id="hero" className="hero" aria-label={t.hero.title}>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">{t.hero.title}</h1>
          <h2 className="hero-subtitle">{t.hero.subtitle}</h2>
          <p className="hero-location">{t.hero.location}</p>
          <p className="hero-description">{t.hero.description}</p>

          <div className="hero-cta">
            <Button
              size="lg"
              onClick={handleContactClick}
              className="cta-primary"
              aria-label={language === 'es'
                ? 'Solicitar auditoría, ir al formulario de contacto'
                : 'Request audit, go to contact form'}
            >
              <Mail className="button-icon" aria-hidden="true" />
              {t.hero.cta1}
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="cta-secondary"
            >
              <a
                href="/CV_Accesibilidad_Jesus_Fernandez.pdf"
                download="CV_Accesibilidad_Jesus_Fernandez.pdf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={language === 'es'
                  ? 'Descargar CV en formato PDF'
                  : 'Download CV in PDF format'}
              >
                <Download className="button-icon" aria-hidden="true" />
                {t.hero.cta2}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;