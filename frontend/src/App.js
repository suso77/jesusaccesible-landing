import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from './components/ui/toaster';
import SkipLink from './components/SkipLink';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    // Set page title and lang attribute based on route
    const isEnglish = location.pathname.startsWith('/en');
    const lang = isEnglish ? 'en' : 'es';
    document.documentElement.lang = lang;
    
    const title = isEnglish 
      ? 'Jesús Fernández Abeledo | Digital Accessibility Consultant'
      : 'Jesús Fernández Abeledo | Consultor de Accesibilidad Digital';
    document.title = title;

    // Set hreflang meta tags
    const existingHreflangs = document.querySelectorAll('link[rel="alternate"]');
    existingHreflangs.forEach(link => link.remove());

    const hreflangs = [
      { hreflang: 'es-ES', href: window.location.origin + '/' },
      { hreflang: 'en', href: window.location.origin + '/en' },
      { hreflang: 'x-default', href: window.location.origin + '/' }
    ];

    hreflangs.forEach(({ hreflang, href }) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = hreflang;
      link.href = href;
      document.head.appendChild(link);
    });

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    const description = isEnglish
      ? 'Digital accessibility consultant and auditor specialized in WCAG 2.2 compliance. Web analytics expert. Pontevedra · Galicia · Spain.'
      : 'Consultor y auditor de accesibilidad digital especializado en cumplimiento WCAG 2.2. Experto en analítica web. Pontevedra · Galicia · España.';
    
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Canonical URL
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.href = window.location.href;
    } else {
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = window.location.href;
      document.head.appendChild(canonical);
    }
  }, [location.pathname]);

  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex="-1">
        <Hero />
        <About />
        <Services />
        <Experience />
        <Skills />
        <Contact />
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
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/en" element={<MainLayout />} />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
