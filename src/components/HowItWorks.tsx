'use client';

import { motion } from 'framer-motion';
import { Upload, MousePointer, Gauge, BookOpen } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload',
    description: 'Drop any PDF or paste text. No account needed.',
  },
  {
    icon: MousePointer,
    step: '02',
    title: 'Choose Mode',
    description: 'Flash, Flow, or Book — pick your style.',
  },
  {
    icon: Gauge,
    step: '03',
    title: 'Set Speed',
    description: 'Start slow, build up to 1000 WPM.',
  },
  {
    icon: BookOpen,
    step: '04',
    title: 'Read',
    description: 'Focus deeply. Finish faster.',
  },
];

export default function HowItWorks() {
  return (
    <section id="features" className="section howitworks-section">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="section-header"
      >
        <h2 className="section-title">
          How It <span className="text-gradient-primary">Works</span>
        </h2>
        <p className="section-subtitle section-subtitle-narrow">
          Start reading better in under 30 seconds.
        </p>
      </motion.div>

      {/* Steps Grid */}
      <div className="howitworks-grid">
        {steps.map((step, index) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="howitworks-step"
          >
            {/* Connector Line (hidden on mobile) */}
            {index < steps.length - 1 && (
              <div className="howitworks-connector" />
            )}
            
            {/* Icon */}
            <div className="howitworks-icon">
              <step.icon size={28} className="text-primary" />
              <span className="howitworks-badge">
                {index + 1}
              </span>
            </div>
            
            {/* Content */}
            <h3 className="howitworks-title">{step.title}</h3>
            <p className="howitworks-desc">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
