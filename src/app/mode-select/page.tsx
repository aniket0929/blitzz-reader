'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useReaderContext } from '@/context/ReaderContext';
import { ReaderMode } from '@/hooks/useReaderEngine';
import { Zap, Waves, BookOpen } from 'lucide-react';

export default function ModeSelectPage() {
  const { words, setMode } = useReaderContext();
  const router = useRouter();

  // Redirect if no words loaded
  useEffect(() => {
    if (!words || words.length === 0) {
      router.push('/upload');
    }
  }, [words, router]);

  const handleModeSelect = (selectedMode: ReaderMode) => {
    setMode(selectedMode);
    router.push('/reader');
  };

  if (!words || words.length === 0) return null;

  return (
    <main className="page-full">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="page-center relative"
      >
        <button onClick={() => router.push('/upload')} className="back-button btn">
          ← Back
        </button>

        <div className="section-header">
          <h2 className="section-title">Choose Your <span className="text-gradient-primary">Mode</span></h2>
          <p className="section-subtitle">
            Pick your reading style. Each mode is designed to keep you in flow.
          </p>
        </div>

        <div className="mode-grid">
          {/* Flash Mode */}
          <div onClick={() => handleModeSelect('word')} className="glass-panel mode-card group">
            <div className="mode-icon-box">
              <Zap size={32} className="text-primary" />
            </div>
            <h3 className="mode-title">Flash Mode</h3>
            <p className="mode-subtitle">RSVP Technology</p>
            <p className="mode-desc">Words flash one at a time for maximum speed. Best for articles and short content.</p>
          </div>

          {/* Flow Mode */}
          <div onClick={() => handleModeSelect('line')} className="glass-panel mode-card group">
            <div className="mode-icon-box">
              <Waves size={32} className="text-primary" />
            </div>
            <h3 className="mode-title">Flow Mode</h3>
            <p className="mode-subtitle">River Reading</p>
            <p className="mode-desc">Smooth scrolling text stream. Read naturally at a controlled, guided pace.</p>
          </div>

          {/* Book Mode */}
          <div onClick={() => handleModeSelect('page')} className="glass-panel mode-card group">
            <div className="mode-icon-box">
              <BookOpen size={32} className="text-primary" />
            </div>
            <h3 className="mode-title">Book Mode</h3>
            <p className="mode-subtitle">Page Flow</p>
            <p className="mode-desc">Full page view with word highlighting. Best for books and long-form content.</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
