import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Linkedin, Send, AlertTriangle, CheckCircle } from 'lucide-react';
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
import { getBackendUrl, checkBackendHealth } from '../utils/api';

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
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking' | 'online' | 'offline'

  const BACKEND_URL = useMemo(() => getBackendUrl(), []);

  // Check API connectivity on mount
  useEffect(() => {
    const runHealthCheck = async () => {
      const isOnline = await checkBackendHealth();
      setApiStatus(isOnline ? 'online' : 'offline');
    };
    runHealthCheck();
  }, []);

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
      const phoneDigits = data.phone.replace(/\D/g, '');
      if (phoneDigits && phoneDigits.length < 9) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      toast({
        title: language === 'es' ? 'Error en el formulario' : 'Form error',
        description: language === 'es' ? 'Revisa los campos marcados.' : 'Check the highlighted fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    const apiUrl = `${BACKEND_URL}/api/contact`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        mode: 'cors',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.detail || payload?.message || `HTTP ${response.status}`);
      }

      toast({ title: t.contact.form.success });
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      setErrors({});
      setApiStatus('online');
    } catch (error) {
      console.error('[CRITICAL] Contact form submission failed:', error);
      setApiStatus('offline');

      let errorMessage = error.message;
      if (error.name === 'AbortError') {
        errorMessage = language === 'es' ? 'Timeout: Servidor lento' : 'Timeout: Slow server';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = language === 'es' ? 'Fallo de conexión (Red/CORS)' : 'Connection failed (Network/CORS)';
      }

      toast({
        title: t.contact.form.error,
        description: errorMessage,
        variant: 'destructive'
      });

      // Forensic alert for mobile debugging
      if (/iPhone|Android|iPad/i.test(navigator.userAgent)) {
        alert(
          `DEBUG REPORT\n` +
          `-------------\n` +
          `Error: ${error.name}: ${error.message}\n` +
          `Origin: ${window.location.origin}\n` +
          `Target: ${apiUrl}\n` +
          `Protocol Match: ${window.location.protocol === new URL(apiUrl).protocol ? 'YES' : 'NO'}\n` +
          `Check: Ensure uvicorn has --host 0.0.0.0`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const isDevelopmentHost = useMemo(() => {
    const { hostname } = window.location;
    return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname) ||
      ['localhost', '127.0.0.1'].some(h => hostname.includes(h));
  }, []);

  return (
    <section id="contacto" className="section" aria-labelledby="contact-heading">
      <div className="container">
        <h2 id="contact-heading" className="section-title">{t.contact.title}</h2>
        <p className="contact-description">{t.contact.description}</p>

        <div className="contact-wrapper">
          <div className="contact-info">
            <h3 className="contact-info-title">{t.contact.cta}</h3>

            {/* API Status Indicator */}
            {isDevelopmentHost && (
              <div className={`api-status-badge ${apiStatus}`} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                {apiStatus === 'checking' && <div className="spinner-small" style={{ width: '12px', height: '12px', border: '2px solid #ccc', borderTopColor: '#333', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
                {apiStatus === 'online' && <CheckCircle size={16} color="#22c55e" />}
                {apiStatus === 'offline' && <AlertTriangle size={16} color="#ef4444" />}
                <span style={{ color: apiStatus === 'offline' ? '#ef4444' : 'inherit', fontWeight: 'bold' }}>
                  {apiStatus === 'checking' && (language === 'es' ? 'CONEXIÓN: COMPROBANDO...' : 'API: CHECKING...')}
                  {apiStatus === 'online' && (language === 'es' ? 'CONEXIÓN: OK √' : 'API: CONNECTED √')}
                  {apiStatus === 'offline' && (language === 'es' ? 'CONEXIÓN: FALLIDA X' : 'API: UNREACHABLE X')}
                </span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

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
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                aria-invalid={!!errors.name}
                disabled={isSubmitting}
                autoComplete="name"
              />
              {!!errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <Label htmlFor="email">{t.contact.form.email} <span className="required">*</span></Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                aria-invalid={!!errors.email}
                disabled={isSubmitting}
                autoComplete="email"
              />
              {!!errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <Label htmlFor="phone">{t.contact.form.phone}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={isSubmitting}
                placeholder="+34 600 000 000"
                autoComplete="tel"
              />
              {!!errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <Label htmlFor="service">{t.contact.form.service} <span className="required">*</span></Label>
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
              <Textarea
                id="message"
                rows={6}
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                aria-invalid={!!errors.message}
                disabled={isSubmitting}
              />
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

            {isDevelopmentHost && (
              <p style={{ marginTop: '1rem', fontSize: '0.65rem', color: '#888', textAlign: 'center' }}>
                Endpoint: {BACKEND_URL}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
