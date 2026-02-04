'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h4 className="footer-title">Blitz Reader.</h4>
          <p className="footer-subtitle">Reach flowstate while reading.</p>
        </div>
        
        <div className="footer-links">
          <Link href="#" className="footer-link">Twitter</Link>
          <Link href="#" className="footer-link">GitHub</Link>
          <Link href="#" className="footer-link">Contact</Link>
        </div>

        <div className="footer-meta">
          Made by <a href="https://aniketgprofile.vercel.app/" target="_blank" rel="noopener noreferrer">@aniket</a> · © {new Date().getFullYear()} Blitz Reader
        </div>
      </div>
    </footer>
  );
}
