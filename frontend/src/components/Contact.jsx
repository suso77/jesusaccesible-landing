import React, { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Linkedin, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { toast } from '../hooks/use-toast';
import { serviceOptions } from '../data/mockData';

const RAW_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const normalizeBaseUrl = (url) => {
  const u = (url ?? '').trim();
  if (!u) return '';
  return u.endsWith('/') ? u.slice(0, -1) : u;
};

const Contact = () => {
  const { language, t } = useLanguage();
  const BACKEND_URL = useMemo(() => normalizeBaseUrl(RAW_BACKEND_URL), []);

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

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.name.trim() || data.name.trim().length < 2) {
      newErrors.name = t.contact.form.nameRequired;
    }
    if (!data.email.trim()) {
      newErrors.email = t.contact.form.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = t.contact.form.emailInvalid;
    }
    if (data.phone.trim()) {
      const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        newErrors.phone = t.contact.form.phoneInvalid;
      }
    }
    if (!data.service) {
      newErrors.service = t.contact.form.serviceRequired;
    }
    if (!data.message.trim() || data.message.trim().length < 10) {
      newErrors.message = t.contact.form.messageRequired;
    }
    setErrors(newErrors);
    return newErrors;
  };

  const focusFirstError = (newErrors) => {
    const firstErrorField = Object.keys(newErrors)[0];
    if (!firstErrorField) return;

    const elById = document.getElementById(firstErrorField);
    if (elById && typeof elById.focus === 'function') {
      elById.focus();
    } else if (firstErrorField === 'service') {
      const trigger = document.getElementById('service');
      if (trigger && typeof trigger.focus === 'function') {
        trigger.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus(null);

    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      focusFirstError(newErrors);
      toast({
        title: language === 'es' ? 'Error en el formulario' : 'Form error',
        description: language === 'es'
          ? 'Por favor, revisa los errores en el formulario.'
          : 'Please review the errors in the form.',
        variant: 'destructive'
      });
      return;
    }

    // Double check BACKEND_URL
    let effectiveBackendUrl = BACKEND_URL || '';

    // If we're in development and no backend URL is set, try to guess it based on current host
    // This helps mobile testing on same network (e.g. http://192.168.x.x:3000 -> :8000)
    if (!effectiveBackendUrl && process.env.NODE_ENV === 'development') {
      const { protocol, hostname } = window.location;
      effectiveBackendUrl = `${protocol}//${hostname}:8000`;
      console.log('Development mode: Guessed backend URL:', effectiveBackendUrl);
    }

    if (!effectiveBackendUrl && process.env.NODE_ENV === 'production') {
      // Try relative as a last resort if it's likely served from the same domain
      effectiveBackendUrl = window.location.origin;
      console.warn('Production mode: No BACKEND_URL found, falling back to origin:', effectiveBackendUrl);
    }

    setIsSubmitting(true);
    try {
      const url = `${effectiveBackendUrl}/api/contact`;
      console.log('Sending request to:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      }).catch(err => {
        console.error('Fetch network error:', err);
        throw new Error(language === 'es' ? 'Error de red. ¿Está el servidor encendido?' : 'Network error. Is the server running?');
      });

      let payload = {};
      try {
        payload = await response.json();
      } catch (e) {
        console.error('Invalid JSON response');
      }

      if (!response.ok) {
        console.error('Response NOT OK:', response.status, payload);
        throw new Error(payload?.message || (language === 'es' ? 'Error en el servidor' : 'Server error'));
      }

      setFormStatus('success');
      toast({ title: t.contact.form.success });
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      setErrors({});
    } catch (error) {
      console.error('Submission error:', error);
      setFormStatus('error');
      toast({
        title: t.contact.form.error,
        description: error.message || 'Error de conexión con el servidor',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
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
                  <Mail className="contact-icon" /> <span>{t.contact.info.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${t.contact.info.phone.replace(/\s/g, '')}`} className="contact-info-link">
                  <Phone className="contact-icon" /> <span>{t.contact.info.phone}</span>
                </a>
              </li>
              <li>
                <div className="contact-info-text">
                  <MapPin className="contact-icon" /> <span>{t.contact.info.location}</span>
                </div>
              </li>
              <li>
                <a href={`https://${t.contact.info.linkedin}`} target="_blank" rel="noopener noreferrer" className="contact-info-link">
                  <Linkedin className="contact-icon" /> <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="contact-form" noValidate>
            <div className="form-group">
              <Label htmlFor="name">{t.contact.form.name} <span className="required">*</span></Label>
              <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} aria-invalid={!!errors.name} disabled={isSubmitting} />
              {!!errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <Label htmlFor="email">{t.contact.form.email} <span className="required">*</span></Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} aria-invalid={!!errors.email} disabled={isSubmitting} />
              {!!errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <Label htmlFor="phone">{t.contact.form.phone}</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} disabled={isSubmitting} placeholder="+34 600 000 000" />
            </div>

            <div className="form-group">
              <Label htmlFor="service">{t.contact.form.service} <span className="required">*</span></Label>
              <input type="hidden" name="service" value={formData.service} />
              <Select value={formData.service} onValueChange={(v) => handleChange('service', v)} disabled={isSubmitting}>
                <SelectTrigger id="service" aria-invalid={!!errors.service}>
                  <SelectValue placeholder={t.contact.form.servicePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {serviceOptions[language].map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!!errors.service && <span className="error-message">{errors.service}</span>}
            </div>

            <div className="form-group">
              <Label htmlFor="message">{t.contact.form.message} <span className="required">*</span></Label>
              <Textarea id="message" rows={6} value={formData.message} onChange={(e) => handleChange('message', e.target.value)} aria-invalid={!!errors.message} disabled={isSubmitting} />
              {!!errors.message && <span className="error-message">{errors.message}</span>}
            </div>

            <Button type="submit" size="lg" disabled={isSubmitting} className="submit-button">
              {isSubmitting ? (
                <span>{t.contact.form.sending}</span>
              ) : (
                <>
                  <Send className="button-icon" /> {t.contact.form.submit}
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
