# API Contracts - Landing Page Jesús Fernández Abeledo

## Resumen de Integración

Este documento detalla los contratos de API entre frontend y backend para la landing page de accesibilidad.

---

## Endpoints Implementados

### 1. **POST /api/contact**
**Propósito:** Enviar formulario de contacto

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "phone": "string (optional)",
  "service": "string (required)",
  "message": "string (required)"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Mensaje enviado correctamente. Te contactaré pronto."
}
```

**Response Error (500):**
```json
{
  "detail": "Error al enviar el mensaje"
}
```

**Funcionalidad:**
- Guarda el mensaje en MongoDB (colección: `contact_messages`)
- Envía email a: s.fernandezabeledo@gmail.com
- Si no hay credenciales SMTP configuradas, solo registra en logs

**Frontend Integration:**
- Componente: `/app/frontend/src/components/Contact.jsx`
- Llamada: `fetch(${BACKEND_URL}/api/contact, { method: 'POST', ... })`
- Validación del formulario antes de enviar
- Muestra toast con resultado

---

### 2. **GET /api/download-cv**
**Propósito:** Descargar CV en formato PDF

**Response Success (200):**
- Content-Type: `application/pdf`
- Filename: `CV_Jesus_Fernandez_Abeledo.pdf`
- Binary file stream

**Response Error (404):**
```json
{
  "detail": "CV not found"
}
```

**Funcionalidad:**
- Descarga el archivo desde: `/app/backend/static/CV_Jesus_Fernandez.pdf`
- Establece headers apropiados para descarga

**Frontend Integration:**
- Componente: `/app/frontend/src/components/Hero.jsx`
- Llamada: `fetch(${BACKEND_URL}/api/download-cv)`
- Convierte response a blob
- Crea link de descarga temporal
- Trigger download automático

---

## Configuración de Email

### Variables de Entorno (Backend .env)

Para habilitar el envío de emails, agregar en `/app/backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASSWORD=tu_app_password
```

**Nota:** Si no se configuran estas variables, el sistema funcionará pero los emails se registrarán en logs en lugar de enviarse.

### Gmail App Password

Si usas Gmail:
1. Habilita 2FA en tu cuenta
2. Ve a: https://myaccount.google.com/apppasswords
3. Genera una contraseña de aplicación
4. Usa esa contraseña en `SMTP_PASSWORD`

---

## Base de Datos MongoDB

### Colección: `contact_messages`

**Schema:**
```javascript
{
  id: String (UUID),
  name: String,
  email: String,
  phone: String (optional),
  service: String,
  message: String,
  timestamp: DateTime (UTC)
}
```

**Índices sugeridos:**
- `timestamp` (descendente) - para ordenar mensajes
- `email` - para búsqueda por contacto

---

## Datos Mock Eliminados

Los siguientes datos mock fueron reemplazados con integraciones reales:

1. ~~Mock data en Contact.jsx~~ → API real `/api/contact`
2. ~~Mock download en Hero.jsx~~ → API real `/api/download-cv`

---

## Testing

### Backend Tests (curl)

**Test Contact Form:**
```bash
curl -X POST http://localhost:8001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+34 600 000 000",
    "service": "auditoria",
    "message": "Este es un mensaje de prueba"
  }'
```

**Test CV Download:**
```bash
curl -O -J http://localhost:8001/api/download-cv
```

### Frontend Tests

1. Llenar formulario de contacto y enviar
2. Verificar mensaje de éxito
3. Verificar en MongoDB que se guardó el mensaje
4. Verificar logs del backend para email
5. Click en botón "Descargar CV"
6. Verificar que se descarga el PDF

---

## Características de Accesibilidad Implementadas

✅ WCAG 2.1/2.2 Level AA Compliant
✅ Form validation con mensajes accesibles
✅ ARIA labels en todos los campos
✅ Focus management en errores
✅ Error announcements para lectores de pantalla
✅ Keyboard navigation completa
✅ Touch targets ≥ 44px

---

## Próximos Pasos Opcionales

1. **Configurar SMTP real** - Para envío de emails
2. **Rate limiting** - Prevenir spam en formulario
3. **Captcha** - Protección adicional
4. **Admin panel** - Ver mensajes recibidos
5. **Email templates** - HTML email mejorado
6. **Notificaciones** - Telegram/Slack cuando llega mensaje

---

## Soporte Multiidioma

- Español: `/` 
- Inglés: `/en`
- Todos los endpoints funcionan independientemente del idioma
- Los mensajes se guardan en el idioma enviado por el usuario
