'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft, ArrowRight, Settings, X, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReaderControlsProps {
  isPlaying: boolean;
  wpm: number;
  fontSize: number;
  onTogglePlay: () => void;
  onReset: () => void;
  onPrev: () => void;
  onNext: () => void;
  onWpmChange: (wpm: number) => void;
  onFontSizeChange: (size: number) => void;
  onChangeMode: () => void;
  onOpenBookmarks?: () => void;
  hasBookmarks?: boolean;
}

export default function ReaderControls({
  isPlaying,
  wpm,
  fontSize,
  onTogglePlay,
  onReset,
  onPrev,
  onNext,
  onWpmChange,
  onFontSizeChange,
  onChangeMode,
  onOpenBookmarks,
  hasBookmarks,
}: ReaderControlsProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      {/* Toggle Button (Visible when controls hidden) */}
      <AnimatePresence>
        {!isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsVisible(true)}
            className="toggle-btn"
          >
            <Settings size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="controls-container"
          >
            <div className="controls-panel relative">
              
              {/* Close Button */}
              <button 
                onClick={() => setIsVisible(false)}
                className="controls-close-btn"
                title="Hide Controls"
              >
                <X size={20} />
              </button>

              {/* Playback Controls */}
              <div className="controls-group">
                <button onClick={onReset} className="btn-control" title="Reset">
                  <RotateCcw size={20} />
                </button>
                <button onClick={onPrev} className="btn-control" title="Previous">
                  <ArrowLeft size={24} />
                </button>
                
                <button onClick={onTogglePlay} className="btn-play-lg">
                  {isPlaying ? <Pause fill="white" /> : <Play fill="white" className="ml-1" />}
                </button>

                <button onClick={onNext} className="btn-control" title="Next">
                  <ArrowRight size={24} />
                </button>

                {/* Bookmark Button */}
                {hasBookmarks && onOpenBookmarks && (
                  <button onClick={onOpenBookmarks} className="btn-control" title="Bookmarks (B)">
                    <Bookmark size={20} />
                  </button>
                )}
              </div>

                <div className="controls-sliders">
                  <div className="controls-group">
                    <span className="text-muted text-xs font-semibold w-12">SPEED</span>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="50"
                      value={wpm}
                      onChange={(e) => onWpmChange(Number(e.target.value))}
                    />
                    <span className="text-primary font-mono w-10 text-right">{wpm}</span>
                  </div>
                  
                  <div className="controls-group">
                    <span className="text-muted text-xs font-semibold w-12">SIZE</span>
                    <input
                      type="range"
                      min="24"
                      max="128"
                      step="4"
                      value={fontSize}
                      onChange={(e) => onFontSizeChange(Number(e.target.value))}
                    />
                    <span className="text-primary font-mono w-10 text-right">{fontSize}</span>
                  </div>
                </div>

                <button 
                  onClick={onChangeMode} 
                  className="btn btn-change-mode"
                >
                  Change Mode
                </button>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
