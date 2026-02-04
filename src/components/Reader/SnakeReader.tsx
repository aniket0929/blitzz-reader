'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface SnakeReaderProps {
  words: string[];
  isPlaying: boolean;
  wpm: number;
  fontSize: number;
  startIndex?: number;
  onIndexChange?: (index: number) => void;
}

interface LineData {
  words: { word: string; globalIndex: number; isParagraphBreak?: boolean }[];
  startIndex: number;
  endIndex: number;
}

// Paragraph marker token (must match text-utils.ts)
const PARA_MARKER = '¶PARA¶';

export default function SnakeReader({
  words,
  isPlaying,
  wpm,
  fontSize,
  startIndex = 0,
  onIndexChange,
}: SnakeReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  
  // Current word position (fractional for smooth animation)
  const positionRef = useRef(startIndex);
  const [currentWordIndex, setCurrentWordIndex] = useState(startIndex);
  
  // Layout calculation
  const [lines, setLines] = useState<LineData[]>([]);
  const lineHeight = fontSize * 2.2;
  const paragraphSpacing = fontSize * 1.5;
  
  // Calculate how many words fit per line based on container width
  const calculateLines = useCallback(() => {
    if (!containerRef.current || words.length === 0) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    // Use 680px max-width or container width, whichever is smaller
    const maxWidth = Math.min(680, containerRect.width - 64);
    // More conservative character width estimate to account for wrapping
    const avgCharWidth = fontSize * 0.6;
    const spaceWidth = fontSize * 0.3;
    // Add buffer for flex gap and wrapping
    const bufferWidth = fontSize * 0.5;
    
    const newLines: LineData[] = [];
    let currentLine: { word: string; globalIndex: number; isParagraphBreak?: boolean }[] = [];
    let currentLineWidth = 0;
    let lineStartIndex = 0;
    
    words.forEach((word, index) => {
      // Check for paragraph break marker
      if (word === PARA_MARKER) {
        // End current line if it has content
        if (currentLine.length > 0) {
          newLines.push({
            words: currentLine,
            startIndex: lineStartIndex,
            endIndex: index - 1,
          });
          currentLine = [];
          currentLineWidth = 0;
        }
        // Add empty line for paragraph break visual spacing
        newLines.push({
          words: [{ word: '', globalIndex: index, isParagraphBreak: true }],
          startIndex: index,
          endIndex: index,
        });
        lineStartIndex = index + 1;
        return;
      }
      
      const wordWidth = word.length * avgCharWidth + spaceWidth;
      
      // More conservative line breaking to prevent wrapping
      if (currentLineWidth + wordWidth + bufferWidth > maxWidth && currentLine.length > 0) {
        // Line is full, push it and start a new one
        newLines.push({
          words: currentLine,
          startIndex: lineStartIndex,
          endIndex: index - 1,
        });
        currentLine = [];
        currentLineWidth = 0;
        lineStartIndex = index;
      }
      
      currentLine.push({ word, globalIndex: index });
      currentLineWidth += wordWidth;
    });
    
    // Push the last line
    if (currentLine.length > 0) {
      newLines.push({
        words: currentLine,
        startIndex: lineStartIndex,
        endIndex: words.length - 1,
      });
    }
    
    setLines(newLines);
  }, [words, fontSize]);

  // Recalculate on resize or word/font changes
  useEffect(() => {
    calculateLines();
    
    const handleResize = () => calculateLines();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateLines]);

  // Find which line contains a given word index
  const getLineForWordIndex = useCallback((wordIndex: number): number => {
    for (let i = 0; i < lines.length; i++) {
      if (wordIndex >= lines[i].startIndex && wordIndex <= lines[i].endIndex) {
        return i;
      }
    }
    return Math.max(0, lines.length - 1);
  }, [lines]);

  // Animation loop
  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = Math.min(time - lastTimeRef.current, 100);
    lastTimeRef.current = time;

    // Words per second
    const wordsPerSecond = wpm / 60;
    const increment = (wordsPerSecond * deltaTime) / 1000;
    
    positionRef.current += increment;
    
    // Skip paragraph markers when calculating position
    let effectiveIndex = Math.floor(positionRef.current);
    while (effectiveIndex < words.length && words[effectiveIndex] === PARA_MARKER) {
      positionRef.current += 1;
      effectiveIndex = Math.floor(positionRef.current);
    }
    
    // Clamp to bounds
    if (positionRef.current >= words.length) {
      positionRef.current = words.length - 1;
    }
    
    const newIndex = Math.floor(positionRef.current);
    if (newIndex !== currentWordIndex) {
      setCurrentWordIndex(newIndex);
      if (onIndexChange) {
        onIndexChange(newIndex);
      }
    }
    
    requestRef.current = requestAnimationFrame(animate);
  }, [wpm, words, currentWordIndex, onIndexChange]);

  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, animate]);

  // Handle external startIndex changes (bookmarks)
  useEffect(() => {
    positionRef.current = startIndex;
    setCurrentWordIndex(startIndex);
  }, [startIndex]);

  // Calculate current line and scroll offset
  const currentLineIndex = getLineForWordIndex(currentWordIndex);
  // Keep 3 lines above the current line visible
  const scrollOffset = Math.max(0, currentLineIndex - 3) * lineHeight;

  // Adjust scroll offset to keep highlight in viewport
  const containerHeight = containerRef.current?.clientHeight || 0;
  const maxScrollOffset = Math.max(0, lines.length * lineHeight - containerHeight + 8 * fontSize);
  const adjustedScrollOffset = Math.min(scrollOffset, maxScrollOffset);

  // Check if a line is a paragraph break
  const isParagraphBreakLine = (line: LineData) => {
    return line.words.length === 1 && line.words[0].isParagraphBreak;
  };

  return (
    <div 
      ref={containerRef}
      className="snake-reader-container"
    >
      <div 
        ref={contentRef}
        className="snake-reader-content"
        style={{
          transform: `translateY(-${adjustedScrollOffset}px)`,
          transition: isPlaying ? 'transform 0.15s linear' : 'none',
        }}
      >
        {lines.map((line, lineIdx) => {
          const isCurrentLine = lineIdx === currentLineIndex;
          const isPastLine = lineIdx < currentLineIndex;
          const isParaBreak = isParagraphBreakLine(line);
          
          // Render paragraph break as visual spacing
          if (isParaBreak) {
            return (
              <div 
                key={lineIdx}
                className="snake-reader-paragraph-break"
                style={{ height: `${paragraphSpacing}px` }}
              />
            );
          }
          
          return (
            <div 
              key={lineIdx}
              className="snake-reader-line"
              style={{ 
                minHeight: `${lineHeight}px`,
                fontSize: `${fontSize}px`,
                opacity: isCurrentLine ? 1 : isPastLine ? 0.35 : 0.6,
              }}
            >
              {line.words.map((item) => {
                const isCurrentWord = item.globalIndex === currentWordIndex;
                const isPast = item.globalIndex < currentWordIndex;
                
                return (
                  <span
                    key={item.globalIndex}
                    className={`snake-reader-word ${isCurrentWord ? 'active' : ''} ${isPast ? 'past' : ''}`}
                  >
                    {item.word}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
      
      {/* Reading Progress Indicator */}
      <div className="snake-reader-progress">
        <div 
          className="snake-reader-progress-bar"
          style={{ width: `${(currentWordIndex / Math.max(1, words.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
