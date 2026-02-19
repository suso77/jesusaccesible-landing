import React from 'react';

const Logo = () => {
  const handleClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <a 
      href="/" 
      className="nav-logo notranslate" 
      translate="no"
      onClick={handleClick}
      aria-label="Ir al inicio de la página"
      data-content="JFA"
    >
      <span className="notranslate" translate="no">JFA</span>
    </a>
  );
};

export default Logo;
