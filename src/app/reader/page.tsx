'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useReaderContext } from '@/context/ReaderContext';
import { useReaderEngine } from '@/hooks/useReaderEngine';
import { updateReadPosition, getBook } from '@/lib/storage';
import OneWordReader from '@/components/Reader/OneWordReader';
import OneLineReader from '@/components/Reader/OneLineReader';
import SnakeReader from '@/components/Reader/SnakeReader';
import ReaderControls from '@/components/Reader/ReaderControls';
import BookmarksPanel from '@/components/BookmarksPanel';

export default function ReaderPage() {
  const router = useRouter();
  const { words, mode, currentBookId, setWords, setCurrentBookId } = useReaderContext();
  const [fontSize, setFontSize] = useState(mode === 'line' ? 48 : 64);
  const [showBookmarks, setShowBookmarks] = useState(false);

  // Initialize engine passing words and mode directly
  const {
    currentIndex,
    isPlaying,
    wpm,
    setWpm,
    play,
    pause,
    togglePlay,
    next,
    prev,
    reset,
    setCurrentIndex,
  } = useReaderEngine(words, mode);

  // Load book from storage if we have an ID but no words (refresh scenario)
  useEffect(() => {
    if ((!words || words.length === 0) && currentBookId) {
      const book = getBook(currentBookId);
      if (book) {
        setWords(book.words);
        // Optionally resume from last position
        if (book.lastPosition > 0) {
          setCurrentIndex(book.lastPosition);
        }
        return;
      }
    }
    
    if (!words || words.length === 0) {
      router.push('/');
    }
  }, [words, currentBookId, router, setWords, setCurrentIndex]);

  // Auto-save reading position
  useEffect(() => {
    if (currentBookId && currentIndex > 0) {
      // Debounce saves to avoid too frequent writes
      const timeout = setTimeout(() => {
        updateReadPosition(currentBookId, currentIndex);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentBookId, currentIndex]);

  // Jump to bookmark position
  const handleJumpTo = useCallback((index: number) => {
    pause();
    setCurrentIndex(index);
  }, [pause, setCurrentIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement) return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setWpm((prev) => Math.min(prev + 50, 1000));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setWpm((prev) => Math.max(prev - 50, 100));
      } else if (e.code === 'KeyB') {
        e.preventDefault();
        setShowBookmarks(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, next, prev, setWpm]);

  // Track line reader position for bookmarks
  const [lineReaderIndex, setLineReaderIndex] = useState(0);

  // Handle line reader index updates
  const handleLineIndexChange = useCallback((index: number) => {
    setLineReaderIndex(index);
  }, []);

  // Get the effective current index (word mode uses engine, line mode uses local state)
  const effectiveCurrentIndex = mode === 'line' ? lineReaderIndex : currentIndex;

  if (!words || words.length === 0) return null;

  return (
    <main className="reader-page">
      <div className={`reader-content ${mode === 'word' ? 'flex-center' : ''}`}>
        {mode === 'word' ? (
          <OneWordReader word={words[currentIndex] || ''} fontSize={fontSize} />
        ) : mode === 'line' ? (
          <OneLineReader 
            words={words} 
            isPlaying={isPlaying} 
            wpm={wpm} 
            fontSize={fontSize} 
            startIndex={currentIndex}
            onIndexChange={handleLineIndexChange}
          />
        ) : mode === 'page' ? (
          <SnakeReader 
            words={words} 
            isPlaying={isPlaying} 
            wpm={wpm} 
            fontSize={fontSize} 
            startIndex={currentIndex}
            onIndexChange={handleLineIndexChange}
          />
        ) : null}
      </div>

      <ReaderControls
        isPlaying={isPlaying}
        wpm={wpm}
        fontSize={fontSize}
        onTogglePlay={togglePlay}
        onReset={reset}
        onPrev={prev}
        onNext={next}
        onWpmChange={setWpm}
        onFontSizeChange={setFontSize}
        onChangeMode={() => router.push('/mode-select')}
        onOpenBookmarks={() => setShowBookmarks(true)}
        hasBookmarks={!!currentBookId}
      />

      {/* Bookmarks Panel */}
      <AnimatePresence>
        {showBookmarks && currentBookId && (
          <BookmarksPanel
            bookId={currentBookId}
            currentWordIndex={effectiveCurrentIndex}
            onJumpTo={handleJumpTo}
            onClose={() => setShowBookmarks(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
