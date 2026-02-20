import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';

const LegalPage = () => {
  const { language, t } = useLanguage();
  const location = useLocation();

  const h1Ref = useRef(null);

  // Extract page type from URL path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageType = pathParts[pathParts.length - 1]; // legal, privacy, accessibility

  const pageData = t.legalPages?.[pageType];

  useEffect(() => {
    window.scrollTo(0, 0);

    if (pageData?.title) {
      document.title = `${pageData.title} | Jesús Fernández Abeledo`;
    }

    // Focus H1 for SPA a11y
    window.setTimeout(() => {
      h1Ref.current?.focus();
    }, 0);
  }, [pageData, location.pathname]);

  if (!pageData) {
    return (
      <div className="legal-page">
        <div className="container">
          <p>{language === 'es' ? 'Página no encontrada' : 'Page not found'}</p>
          <Link to={language === 'es' ? '/' : '/en'} className="back-link">
            <ArrowLeft className="back-icon" aria-hidden="true" />
            {t.legalPages?.backToHome || 'Volver al inicio'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="legal-page">
      <div className="container">
        <Link
          to={language === 'es' ? '/' : '/en'}
          className="back-link"
          aria-label={language === 'es' ? 'Volver a la página principal' : 'Back to main page'}
        >
          <ArrowLeft className="back-icon" aria-hidden="true" />
          {t.legalPages.backToHome}
        </Link>

        <article className="legal-content">
          <header>
            <h1 ref={h1Ref} tabIndex="-1" className="legal-title">
              {pageData.title}
            </h1>
            <p className="legal-updated">
              {t.legalPages.lastUpdated}: {language === 'es' ? '1 de enero de 2025' : 'January 1, 2025'}
            </p>
          </header>

          {pageData.sections.map((section, index) => (
            <section key={index} className="legal-section" aria-labelledby={`section-${index}`}>
              <h2 id={`section-${index}`} className="legal-section-title">
                {section.title}
              </h2>
              <div className="legal-section-content">
                {section.content.split('\n\n').map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
};

export default LegalPage;
