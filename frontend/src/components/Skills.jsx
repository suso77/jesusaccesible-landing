import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Award, Code, Shield, BarChart3, Search, Users } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const iconMap = {
  accessibility: Shield,
  standards: Award,
  analytics: BarChart3,
  seo: Search,
  productivity: Users,
  technical: Code
};

const Skills = () => {
  const { t } = useLanguage();

  const getCategoryIcon = (index) => {
    const icons = ['accessibility', 'standards', 'analytics', 'seo', 'productivity', 'technical'];
    return iconMap[icons[index]] || Code;
  };

  return (
    <section id="habilidades" className="section section-alt" aria-labelledby="skills-heading">
      <div className="container">
        <h2 id="skills-heading" className="section-title">{t.skills.title}</h2>
        
        <div className="skills-grid-cards">
          {t.skills.categories.map((category, index) => {
            const IconComponent = getCategoryIcon(index);
            return (
              <Card key={index} className="skill-card">
                <CardHeader>
                  <div className="skill-card-icon" aria-hidden="true">
                    <IconComponent className="icon" />
                  </div>
                  <CardTitle className="skill-card-title">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="skill-tags">
                    {category.items.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="skill-badge">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="certifications">
          <h2 className="section-title certifications-title">{t.skills.certifications.title}</h2>
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