import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Download, Mail } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getBackendUrl } from '../utils/api';

const Hero = () => {
  const { language, t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const handleContactClick = () => {
    const contactSection = document.querySelector('#contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  // Determine the CV download URL dynamically
  // Using the backend endpoint is much more reliable on mobile devices
  const cvDownloadUrl = useMemo(() => {
    const backendUrl = getBackendUrl();
    return `${backendUrl}/api/download-cv`;
  }, []);

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

            <a
              href={cvDownloadUrl}
              download="CV_Accesibilidad_Jesus_Fernandez.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-[#364559] text-[#364559] shadow-sm hover:bg-[#364559] hover:text-white h-11 px-8 cta-secondary"
              aria-label={language === 'es'
                ? 'Descargar CV en formato PDF'
                : 'Download CV in PDF format'}
            >
              <Download className="button-icon" aria-hidden="true" />
              {t.hero.cta2}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;