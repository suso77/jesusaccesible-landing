# PRD - Portfolio Jesús Fernández Abeledo

## Última Actualización: Diciembre 2025

## Declaración del Problema Original
El usuario, un Consultor de Accesibilidad Digital, solicitó la creación de un portfolio/landing page profesional desde su CV.

## Requisitos del Producto
- **Diseño:** Minimalista, profesional, mobile-first
- **Secciones:** Sobre Mí, Servicios, Experiencia, Habilidades, Contacto
- **Funcionalidad:**
  - Soporte bilingüe (Español: `/`, Inglés: `/en/`)
  - Formulario de contacto que envía a `s.fernandezabeledo@gmail.com`
  - Botón para descargar CV
- **Requisito Core (No negociable):** Cumplimiento estricto de WCAG 2.1 y 2.2 Nivel A & AA

## Arquitectura
```
/app
├── backend
│   ├── server.py (FastAPI)
│   ├── .env (SMTP credentials)
│   └── CV_Jesus_Fernandez.pdf
└── frontend
    ├── src/components/ (React components)
    ├── src/context/LanguageContext.jsx (i18n)
    ├── src/data/mockData.js (contenido)
    └── src/index.css (TailwindCSS)
```

## Estado Actual: ✅ Sitio Funcionando

### Bug Crítico Resuelto (P0)
**Fecha:** Diciembre 2025
**Problema:** El sitio web no funcionaba después de añadir aria-labels para lectores de pantalla.
**Causa:** En `Footer.jsx` se usaba la variable `language` sin haberla extraído del hook `useLanguage()`.
**Solución:** Se cambió `const { t } = useLanguage()` a `const { language, t } = useLanguage()` en línea 6.
**Estado:** ✅ RESUELTO Y VERIFICADO

## Completado
- [x] Full-Stack Application (React + FastAPI)
- [x] Soporte bilingüe (ES/EN)
- [x] Backend: CV download y envío de emails SMTP
- [x] Diseño profesional minimalista
- [x] Cumplimiento WCAG AA/AAA contrast
- [x] Focus outlines visibles
- [x] Logo protegido contra Google Translate
- [x] Aria-labels para lectores de pantalla
- [x] Navegación en Footer

## Tareas Pendientes

### P1 - Próximas
- [ ] Implementación SEO: sitemap.xml, robots.txt, Schema.org

### P2 - Futuras
- [ ] Verificación avanzada de accesibilidad (teclado, lectores de pantalla, zoom 200%/400%)
- [ ] Sección FAQ
- [ ] Funcionalidad "Agendar consulta" (Calendly)

## Endpoints API
- `POST /api/contact` - Envía formulario de contacto por email
- `GET /api/download-cv` - Descarga el CV en PDF

## Integraciones 3rd Party
- **Google SMTP:** Configurado y funcionando para envío de emails
