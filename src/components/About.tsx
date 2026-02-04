'use client';

import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="section about-section">
      <div className="about-grid">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="about-badge">
            OUR PHILOSOPHY
          </div>
          <h2 className="about-title">
            Designed for the <br /> Information Age
          </h2>
          <div className="about-body">
            <p>
              We consume more text than ever before, but our tools haven't evolved. 
              The static page is inefficient for the modern digital reader.
            </p>
            <p>
              <strong className="text-white">Blitz Reader</strong> uses scientifically backed 
              methods like RSVP (Rapid Serial Visual Presentation) to reduce eye movement 
              and increase retention.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="about-visual glass-panel"
        >
           {/* Abstract visual */}
           <div className="about-visual-overlay" />
           <div className="about-visual-text">
             <div className="about-visual-line dim-1">FOCUS</div>
             <div className="about-visual-line dim-2">SPEED</div>
             <div className="about-visual-line dim-2">FLOW</div>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
