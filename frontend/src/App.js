import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { Toaster } from "./components/ui/toaster";
import SkipLink from "./components/SkipLink";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Footer from "./components/Footer";

// Lazy load components below the fold for better initial TTI and reduced unused JS
const LegalPage = React.lazy(() => import("./components/LegalPage"));
const Experience = React.lazy(() => import("./components/Experience"));
const Skills = React.lazy(() => import("./components/Skills"));
const Contact = React.lazy(() => import("./components/Contact"));

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    const isEnglish = location.pathname.startsWith("/en");
    const lang = isEnglish ? "en" : "es";
    document.documentElement.lang = lang;

    const title = isEnglish
      ? "Jesús Fernández Abeledo | Digital Accessibility Consultant"
      : "Jesús Fernández Abeledo | Consultor de Accesibilidad Digital";
    document.title = title;

    // hreflang dinámico según ruta
    const existingHreflangs = document.querySelectorAll('link[rel="alternate"]');
    existingHreflangs.forEach((link) => link.remove());

    const path = location.pathname;
    const isEnPath = path.startsWith("/en");
    const pathWithoutLang = isEnPath ? path.replace(/^\/en/, "") || "/" : path;

    const esHref = window.location.origin + pathWithoutLang;
    const enHref =
      window.location.origin + (pathWithoutLang === "/" ? "/en" : "/en" + pathWithoutLang);

    const hreflangs = [
      { hreflang: "es-ES", href: esHref },
      { hreflang: "en", href: enHref },
      { hreflang: "x-default", href: esHref },
    ];

    hreflangs.forEach(({ hreflang, href }) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = hreflang;
      link.href = href;
      document.head.appendChild(link);
    });

    // meta description (genérica)
    const metaDescription = document.querySelector('meta[name="description"]');
    const description = isEnglish
      ? "Digital accessibility consultant and auditor specialized in WCAG 2.2 compliance. Web analytics expert. Pontevedra · Galicia · Spain."
      : "Consultor y auditor de accesibilidad digital especializado en cumplimiento WCAG 2.2. Experto en analítica web. Pontevedra · Galicia · España.";

    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // canonical limpio
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    const canonicalUrl = window.location.origin + location.pathname;

    if (existingCanonical) {
      existingCanonical.href = canonicalUrl;
    } else {
      const canonical = document.createElement("link");
      canonical.rel = "canonical";
      canonical.href = canonicalUrl;
      document.head.appendChild(canonical);
    }
  }, [location.pathname]);

  // Handle scroll to section when navigating from legal pages
  useEffect(() => {
    const scrollTarget = location.state?.scrollTo || location.hash;
    if (scrollTarget) {
      // Wait for React to render all sections before scrolling
      const timer = setTimeout(() => {
        const element = document.querySelector(scrollTarget);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          // Focus on name input if navigating to contact - use requestAnimationFrame to avoid thrashing
          if (scrollTarget === '#contacto') {
            requestAnimationFrame(() => {
              const timer2 = setTimeout(() => {
                const nameInput = document.querySelector('#name');
                if (nameInput) nameInput.focus({ preventScroll: true });
              }, 1000); // Slightly more delay to ensure scroll is done
            });
          }
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.state, location.hash]);

  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex="-1">
        <Hero />
        <About />
        <Services />
        <React.Suspense fallback={<div className="min-h-[200px]" />}>
          <Experience />
          <Skills />
          <Contact />
        </React.Suspense>
      </main>
      <Footer />
      <Toaster />
    </>
  );
};

const LegalLayout = () => {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex="-1">
        <React.Suspense fallback={<div className="h-screen bg-slate-950" />}>
          <LegalPage />
        </React.Suspense>
      </main>
      <Footer />
      <Toaster />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <React.Suspense fallback={<div className="h-screen bg-slate-950" />}>
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/en" element={<MainLayout />} />

            <Route path="/legal" element={<LegalLayout />} />
            <Route path="/privacidad" element={<LegalLayout />} />
            <Route path="/accesibilidad" element={<LegalLayout />} />

            <Route path="/en/legal" element={<LegalLayout />} />
            <Route path="/en/privacy" element={<LegalLayout />} />
            <Route path="/en/accessibility" element={<LegalLayout />} />
          </Routes>
        </React.Suspense>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
