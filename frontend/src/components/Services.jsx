import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ClipboardCheck, Users, Wrench, BarChart3, GraduationCap, Monitor } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const iconMap = {
  ClipboardCheck,
  Users,
  Wrench,
  BarChart3,
  GraduationCap,
  Monitor
};

const Services = () => {
  const { t } = useLanguage();

  return (
    <section id="servicios" className="section section-alt" aria-labelledby="services-heading">
      <div className="container">
        <h2 id="services-heading" className="section-title">{t.services.title}</h2>
        <div className="services-grid">
          {t.services.list.map((service, index) => {
            const IconComponent = iconMap[service.icon];
            return (
              <Card key={index} className="service-card">
                <CardHeader>
                  <div className="service-icon" aria-hidden="true">
                    <IconComponent className="icon" />
                  </div>
                  <CardTitle className="service-title">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="service-description">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;