import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Linkedin, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from '../hooks/use-toast';
import { serviceOptions } from '../data/mockData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Contact = () => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t.contact.form.nameRequired;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.contact.form.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.contact.form.emailInvalid;
    }

    if (!formData.service) {
      newErrors.service = t.contact.form.serviceRequired;
    }

    if (!formData.message.trim()) {
      newErrors.message = t.contact.form.messageRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus(null);

    if (!validateForm()) {
      // Focus on first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error sending message');
      }

      const data = await response.json();
      
      setFormStatus('success');
      toast({
        title: data.message || t.contact.form.success,
        variant: 'default'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
      toast({
        title: t.contact.form.error,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <section id="contacto" className="section" aria-labelledby="contact-heading">
      <div className="container">
        <h2 id="contact-heading" className="section-title">{t.contact.title}</h2>
        <p className="contact-description">{t.contact.description}</p>

        <div className="contact-wrapper">
          <div className="contact-info">
            <h3 className="contact-info-title">{t.contact.cta}</h3>
            <ul className="contact-info-list">
              <li>
                <a href={`mailto:${t.contact.info.email}`} className="contact-info-link">
                  <Mail className="contact-icon" aria-hidden="true" />
                  <span>{t.contact.info.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${t.contact.info.phone.replace(/\s/g, '')}`} className="contact-info-link">
                  <Phone className="contact-icon" aria-hidden="true" />
                  <span>{t.contact.info.phone}</span>
                </a>
              </li>
              <li>
                <div className="contact-info-link">
                  <MapPin className="contact-icon" aria-hidden="true" />
                  <span>{t.contact.info.location}</span>
                </div>
              </li>
              <li>
                <a 
                  href={`https://${t.contact.info.linkedin}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-info-link"
                >
                  <Linkedin className="contact-icon" aria-hidden="true" />
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>

          <form 
            onSubmit={handleSubmit} 
            className="contact-form"
            noValidate
            aria-label={t.contact.title}
          >
            <div className="form-group">
              <Label htmlFor="name">
                {t.contact.form.name}
                <span className="required" aria-label="required">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                disabled={isSubmitting}
              />
              {errors.name && (
                <span id="name-error" className="error-message" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <Label htmlFor="email">
                {t.contact.form.email}
                <span className="required" aria-label="required">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                disabled={isSubmitting}
              />
              {errors.email && (
                <span id="email-error" className="error-message" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <Label htmlFor="phone">{t.contact.form.phone}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <Label htmlFor="service">
                {t.contact.form.service}
                <span className="required" aria-label="required">*</span>
              </Label>
              <Select
                value={formData.service}
                onValueChange={(value) => handleChange('service', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger 
                  id="service"
                  aria-required="true"
                  aria-invalid={!!errors.service}
                  aria-describedby={errors.service ? 'service-error' : undefined}
                >
                  <SelectValue placeholder={t.contact.form.servicePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {serviceOptions[language].map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.service && (
                <span id="service-error" className="error-message" role="alert">
                  {errors.service}
                </span>
              )}
            </div>

            <div className="form-group">
              <Label htmlFor="message">
                {t.contact.form.message}
                <span className="required" aria-label="required">*</span>
              </Label>
              <Textarea
                id="message"
                rows={6}
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
                disabled={isSubmitting}
              />
              {errors.message && (
                <span id="message-error" className="error-message" role="alert">
                  {errors.message}
                </span>
              )}
            </div>

            {formStatus === 'success' && (
              <div className="success-message" role="status" aria-live="polite">
                {t.contact.form.success}
              </div>
            )}

            {formStatus === 'error' && (
              <div className="error-message" role="alert" aria-live="assertive">
                {t.contact.form.error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? (
                <span>{t.contact.form.sending}</span>
              ) : (
                <>
                  <Send className="button-icon" aria-hidden="true" />
                  {t.contact.form.submit}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;