import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Award } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const Skills = () => {
  const { t } = useLanguage();

  return (
    <section id="habilidades" className="section section-alt" aria-labelledby="skills-heading">
      <div className="container">
        <h2 id="skills-heading" className="section-title">{t.skills.title}</h2>
        
        <div className="skills-grid">
          {t.skills.categories.map((category, index) => (
            <div key={index} className="skill-category">
              <h3 className="skill-category-title">{category.title}</h3>
              <div className="skill-tags">
                {category.items.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="skill-badge">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="certifications">
          <h3 className="section-subtitle">{t.skills.certifications.title}</h3>
          <div className="certifications-grid">
            {t.skills.certifications.list.map((cert, index) => (
              <Card key={index} className="certification-card">
                <CardHeader>
                  <div className="certification-icon" aria-hidden="true">
                    <Award className="icon" />
                  </div>
                  <CardTitle className="certification-title">{cert.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="certification-issuer">{cert.issuer}</p>
                  <p className="certification-year">{cert.year}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;