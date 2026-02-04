'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { Book } from 'lucide-react';
import { getLibrary, deleteBook, StoredBook } from '@/lib/storage';
import { useReaderContext } from '@/context/ReaderContext';
import LibraryBookCard from '@/components/LibraryBookCard';

export default function LibraryPage() {
  const [books, setBooks] = useState<StoredBook[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();
  const { setWords, setCurrentBookId, setMode } = useReaderContext();

  useEffect(() => {
    setBooks(getLibrary());
  }, []);

  const handleOpenBook = (book: StoredBook) => {
    setWords(book.words);
    setCurrentBookId(book.id);
    setMode(null);
    router.push('/mode-select');
  };

  const handleDelete = (id: string) => {
    deleteBook(id);
    setBooks(books.filter(b => b.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <main className="page-full">
      <button 
        onClick={() => router.push('/upload')} 
        className="back-button btn"
        style={{ position: 'absolute', top: '2rem', left: '2rem' }}
      >
        ← Back
      </button>

      <div className="library-page-inner">
        <header className="library-header">
          <h1 className="library-title">Library</h1>
          <p className="library-subtitle">Continue where you left off.</p>
        </header>

        {books.length === 0 ? (
          <div className="glass-panel library-empty">
            <Book size={48} className="library-empty-icon" />
            <p className="library-empty-text">No books yet. Upload your first book to get started.</p>
            <button onClick={() => router.push('/upload')} className="btn btn-primary">
              Upload Book
            </button>
          </div>
        ) : (
          <section className="library-body">
            <div className="library-grid">
              <AnimatePresence>
                {books.map((book) => (
                  <LibraryBookCard
                    key={book.id}
                    book={book}
                    onOpen={handleOpenBook}
                    onDeleteRequest={setDeleteConfirm}
                    onDeleteConfirm={handleDelete}
                    onDeleteCancel={() => setDeleteConfirm(null)}
                    isDeleteConfirmVisible={deleteConfirm === book.id}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
