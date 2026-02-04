'use client';

import { motion } from 'framer-motion';
import { Zap, Waves, BookOpen, Gauge, Bookmark, Moon } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Flash Mode',
    subtitle: 'RSVP Technology',
    description: 'Words flash one at a time, eliminating eye movement and maximizing reading velocity. Perfect for articles and short content.',
  },
  {
    icon: Waves,
    title: 'Flow Mode',
    subtitle: 'River Reading',
    description: 'Text streams smoothly across your screen. Read naturally while maintaining a controlled, guided pace.',
  },
  {
    icon: BookOpen,
    title: 'Book Mode',
    subtitle: 'Page Flow',
    description: 'Full page view with word-by-word highlighting. Great for long-form content like books and research papers.',
  },
  {
    icon: Gauge,
    title: 'Speed Control',
    subtitle: '100-1000+ WPM',
    description: 'Dial in your perfect pace. Start slow, build up to 1000+ words per minute as you train.',
  },
  {
    icon: Bookmark,
    title: 'Smart Library',
    subtitle: 'Auto-Save Progress',
    description: 'Upload once, read anywhere. Your position is saved automatically so you never lose your place.',
  },
  {
    icon: Moon,
    title: 'Focus Interface',
    subtitle: 'Zero Distractions',
    description: 'Dark, minimal design engineered to keep your attention on what matters: the words.',
  },
];

export default function Features() {
  return (
    <section className="section features-section">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="section-header"
      >
        <h2 className="section-title">
          Three Ways to <span className="text-gradient-primary">Focus</span>
        </h2>
        <p className="section-subtitle">
          Pick the mode that matches your content. Each one is designed to keep you locked in.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="features-grid">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-panel feature-card"
          >
            {/* Icon */}
            <div className="feature-icon">
              <feature.icon size={24} className="text-primary" />
            </div>
            
            {/* Content */}
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-subtitle">{feature.subtitle}</p>
            <p className="feature-desc">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
