'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Features', id: 'features' },
    { name: 'About', id: 'about' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offsetTop = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'about'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}
          className="navbar-logo"
        >
          <div className="navbar-logo-box">
            <img src="/assets/logo.svg" alt="Blitz Reader" className="navbar-logo-img" />
          </div>
        </div>

        {/* Links */}
        <div className="navbar-links-container">
          <div className="navbar-links">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.id)}
                className={`navbar-link ${activeSection === link.id ? 'active' : ''}`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push('/upload')}
          className="navbar-cta"
        >
          START READING
        </button>
      </div>
    </nav>
  );
}
