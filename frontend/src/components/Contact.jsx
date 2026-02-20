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

// CRA: variables deben empezar por REACT_APP_ y requieren reinicio del dev server
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

    // Nombre
    if (!data.name.trim() || data.name.trim().length < 2) {
      newErrors.name = t.contact.form.nameRequired;
    }

    // Email
    if (!data.email.trim()) {
      newErrors.email = t.contact.form.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = t.contact.form.emailInvalid;
    }

    // Teléfono (opcional)
    if (data.phone.trim()) {
      const phoneRegex =
        /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        newErrors.phone = t.contact.form.phoneInvalid;
      }
    }

    // Servicio
    if (!data.service) {
      newErrors.service = t.contact.form.serviceRequired;
    }

    // Mensaje
    if (!data.message.trim() || data.message.trim().length < 10) {
      newErrors.message = t.contact.form.messageRequired;
    }

    setErrors(newErrors);
    return newErrors;
  };

  const focusFirstError = (newErrors) => {
    const firstErrorField = Object.keys(newErrors)[0];
    if (!firstErrorField) return;

    // 1) intentamos enfocar el input por id (name, email, phone, message)
    const byId = document.getElementById(firstErrorField);
    if (byId && typeof byId.focus === 'function') {
      byId.focus();
      return;
    }

    // 2) Radix Select: el trigger tiene id="service"
    if (firstErrorField === 'service') {
      const trigger = document.getElementById('service');
      if (trigger && typeof trigger.focus === 'function') trigger.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus(null);

    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      focusFirstError(newErrors);
      return;
    }

    // Si no hay backend configurado, fallará siempre: mejor avisar claro
    if (!BACKEND_URL) {
      setFormStatus('error');
      toast({
        title: 'Backend no configurado: REACT_APP_BACKEND_URL',
        variant: 'destructive'
      });
      console.error('Missing REACT_APP_BACKEND_URL env var');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error('Contact API error:', response.status, payload);
        throw new Error(payload?.error || payload?.message || `HTTP ${response.status}`);
      }

      setFormStatus('success');
      toast({
        title: payload?.message || t.contact.form.success,
        variant: 'default'
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });

      setErrors({});
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
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <section id="contacto" className="section" aria-labelledby="contact-heading">
      <div className="container">
        <h2 id="contact-heading" className="section-title">
          {t.contact.title}
        </h2>
        <p className="contact-description">{t.contact.description}</p>

        <div className="contact-wrapper">
          <div className="contact-info">
            <h3 className="contact-info-title">{t.contact.cta}</h3>
            <ul className="contact-info-list">
              <li>
                <a
                  href={`mailto:${t.contact.info.email}`}
                  className="contact-info-link"
                  aria-label={
                    language === 'es'
                      ? `Correo electrónico: ${t.contact.info.email}`
                      : `Email: ${t.contact.info.email}`
                  }
                >
                  <Mail className="contact-icon" aria-hidden="true" />
                  <span>{t.contact.info.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${t.contact.info.phone.replace(/\s/g, '')}`}
                  className="contact-info-link"
                  aria-label={
                    language === 'es'
                      ? `Teléfono: ${t.contact.info.phone}`
                      : `Phone: ${t.contact.info.phone}`
                  }
                >
                  <Phone className="contact-icon" aria-hidden="true" />
                  <span>{t.contact.info.phone}</span>
                </a>
              </li>
              <li>
                <div className="contact-info-text">
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
                  aria-label={
                    language === 'es'
                      ? 'LinkedIn, se abre en una nueva ventana'
                      : 'LinkedIn, opens in a new window'
                  }
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
                <span className="required" aria-label="required">
                  *
                </span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                disabled={isSubmitting}
                autoComplete="name"
              />
              {!!errors.name && (
                <span id="name-error" className="error-message" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <Label htmlFor="email">
                {t.contact.form.email}
                <span className="required" aria-label="required">
                  *
                </span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                disabled={isSubmitting}
                autoComplete="email"
              />
              {!!errors.email && (
                <span id="email-error" className="error-message" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <Label htmlFor="phone">{t.contact.form.phone}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                disabled={isSubmitting}
                placeholder="+34 600 000 000"
                autoComplete="tel"
              />
              {!!errors.phone && (
                <span id="phone-error" className="error-message" role="alert">
                  {errors.phone}
                </span>
              )}
            </div>

            <div className="form-group">
              <Label htmlFor="service">
                {t.contact.form.service}
                <span className="required" aria-label="required">
                  *
                </span>
              </Label>

              {/* Radix Select no es nativo: añadimos input hidden para integraciones y consistencia */}
              <input type="hidden" name="service" value={formData.service} />

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

              {!!errors.service && (
                <span id="service-error" className="error-message" role="alert">
                  {errors.service}
                </span>
              )}
            </div>

            <div className="form-group">
              <Label htmlFor="message">
                {t.contact.form.message}
                <span className="required" aria-label="required">
                  *
                </span>
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
                disabled={isSubmitting}
              />
              {!!errors.message && (
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
