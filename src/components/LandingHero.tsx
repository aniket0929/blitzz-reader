'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface LandingHeroProps {
  onStart: () => void;
}

// Demo words for the animated preview
const demoWords = ['Stop', 'skimming.', 'Start', 'absorbing.', 'Read', '3x', 'faster', 'with', 'guided', 'focus.'];

export default function LandingHero({ onStart }: LandingHeroProps) {
  const router = useRouter();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Animated word display for hero preview
  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % demoWords.length);
    }, 400);
    
    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <section id="home" className="section hero">
      
      {/* Background Gradients */}
      <div className="hero-bg bg-gradient-hero" />
      <div className="hero-glow" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="hero-title">
          <img src="/assets/logo.svg" alt="BLITZ" className="hero-title-logo" />
          <br className="hero-title-break" />
          <span className="text-gradient-primary">READER</span>
        </h1>

        <p className="hero-subtitle text-muted">
          Reach flowstate while reading. Read <span className="text-primary hero-highlight">better</span> and <span className="text-primary hero-highlight">faster</span>.
        </p>
        
        <p className="hero-meta">
          Speed reading reimagined for students, professionals, and lifelong learners.
        </p>

        <div className="hero-actions">
          <button
            onClick={onStart}
            className="btn btn-primary hero-primary-btn"
          >
            Start Reading Free
            <ArrowRight size={20} className="hero-primary-icon" />
          </button>
          
          <button 
             onClick={() => router.push('/library')}
             className="btn hero-secondary-btn"
          >
            <Play size={20} className="text-primary" />
            My Library
          </button>
        </div>
      </motion.div>

      {/* Animated Reader Preview */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="hero-preview"
      >
        <div className="hero-preview-overlay" />
        
        {/* Mode Labels */}
        <div className="hero-mode-labels">
          <span className="hero-mode-label active">Flash Mode</span>
          <span className="hero-mode-label inactive">Flow Mode</span>
          <span className="hero-mode-label inactive">Book Mode</span>
        </div>
        
        {/* Animated Word Display */}
        <div 
          className="hero-demo"
          onClick={() => setIsAnimating(!isAnimating)}
        >
          <motion.div 
            key={currentWordIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.15 }}
            className="hero-demo-word"
          >
            {demoWords[currentWordIndex]}
          </motion.div>
          
          {/* Speed indicator */}
          <div className="hero-demo-indicator">
            <span className="text-primary font-mono">150 WPM</span>
            <span>·</span>
            <span>{isAnimating ? 'Click to pause' : 'Click to play'}</span>
          </div>
           
          {/* Fake UI Elements */}
          <div className="hero-demo-dots">
            <div className="hero-dot red" />
            <div className="hero-dot yellow" />
            <div className="hero-dot green" />
          </div>
        </div>
      </motion.div>

    </section>
  );
}
