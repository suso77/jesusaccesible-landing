import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <section id="sobre-mi" className="section" aria-labelledby="about-heading">
      <div className="container">
        <h2 id="about-heading" className="section-title">{t.about.title}</h2>
        <div className="about-content">
          {t.about.content.map((paragraph, index) => (
            <p key={index} className="about-text">{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;