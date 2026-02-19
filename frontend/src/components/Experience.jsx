import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Briefcase } from 'lucide-react';

const Experience = () => {
  const { t } = useLanguage();

  return (
    <section id="experiencia" className="section" aria-labelledby="experience-heading">
      <div className="container">
        <h2 id="experience-heading" className="section-title">{t.experience.title}</h2>
        <div className="experience-timeline">
          {t.experience.jobs.map((job, index) => (
            <article key={index} className="experience-item">
              <div className="experience-icon" aria-hidden="true">
                <Briefcase className="icon" />
              </div>
              <div className="experience-content">
                <h3 className="experience-role">{job.role}</h3>
                <p className="experience-company">{job.company}</p>
                <p className="experience-period">
                  <time>{job.period}</time>
                </p>
                <ul className="experience-description">
                  {job.description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;