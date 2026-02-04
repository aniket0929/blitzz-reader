'use client';

import { motion } from 'framer-motion';
import { Trash2, Clock } from 'lucide-react';
import { StoredBook } from '@/lib/storage';

interface LibraryBookCardProps {
  book: StoredBook;
  onOpen: (book: StoredBook) => void;
  onDeleteRequest: (id: string) => void;
  onDeleteConfirm: (id: string) => void;
  onDeleteCancel: () => void;
  isDeleteConfirmVisible: boolean;
}

export default function LibraryBookCard({
  book,
  onOpen,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
  isDeleteConfirmVisible,
}: LibraryBookCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getProgress = () => {
    if (book.words.length === 0) return 0;
    return Math.round((book.lastPosition / book.words.length) * 100);
  };

  const progress = getProgress();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-panel library-card"
      onClick={() => onOpen(book)}
    >
      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="library-card-content">
        <div className="library-card-main">
          <h3 className="library-card-title">
            {book.name}
          </h3>
          <div className="library-card-meta">
            <span><Clock size={14} /> {formatDate(book.uploadedAt)}</span>
            <span>{book.words.length.toLocaleString()} words</span>
            <span>{progress}% complete</span>
          </div>
          {book.bookmarks.length > 0 && (
            <div className="library-card-bookmarks">
              📑 {book.bookmarks.length} bookmark{book.bookmarks.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRequest(book.id);
          }}
          className="btn-control delete-btn"
          title="Delete book"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Delete confirmation overlay */}
      {isDeleteConfirmVisible && (
        <div className="delete-confirm" onClick={(e) => e.stopPropagation()}>
          <p className="font-semibold">Delete this book?</p>
          <div className="library-delete-actions">
            <button 
              onClick={() => onDeleteConfirm(book.id)} 
              className="btn btn-delete text-white py-1 px-4 text-sm"
            >
              Delete
            </button>
            <button 
              onClick={onDeleteCancel} 
              className="btn btn-cancel border border-border hover:bg-white/10 py-1 px-4 text-sm text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
