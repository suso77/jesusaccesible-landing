import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Download, Mail } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const Hero = () => {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const handleContactClick = () => {
    const contactSection = document.querySelector('#contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  const handleDownloadCV = () => {
    // Mock download - will be replaced with actual download in backend integration
    console.log('Download CV clicked');
    alert(t.nav.downloadCV);
  };

  return (
    <section id="hero" className="hero" aria-label={t.hero.title}>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">{t.hero.title}</h1>
          <p className="hero-subtitle">{t.hero.subtitle}</p>
          <p className="hero-location">{t.hero.location}</p>
          <p className="hero-description">{t.hero.description}</p>
          
          <div className="hero-cta">
            <Button
              size="lg"
              onClick={handleContactClick}
              className="cta-primary"
            >
              <Mail className="button-icon" aria-hidden="true" />
              {t.hero.cta1}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleDownloadCV}
              className="cta-secondary"
            >
              <Download className="button-icon" aria-hidden="true" />
              {t.hero.cta2}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;