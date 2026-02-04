'use client';

import { useRouter } from 'next/navigation';
import { useReaderContext } from '@/context/ReaderContext';
import { processText } from '@/lib/text-utils';
import { parsePDF } from '@/lib/pdf-utils';
import { addBook } from '@/lib/storage';
import FileUploader from '@/components/FileUploader';

export default function UploadPage() {
  const { setWords, setCurrentBookId } = useReaderContext();
  const router = useRouter();

  const handleFileLoaded = async (uploadedFile: File) => {
    try {
      let text = '';
      if (uploadedFile.name.endsWith('.pdf')) {
        text = await parsePDF(uploadedFile);
      } else {
        text = await uploadedFile.text();
      }
      
      const processedWords = processText(text);
      
      // Save to library and get the book ID
      const savedBook = addBook(uploadedFile.name, processedWords);
      
      setWords(processedWords);
      setCurrentBookId(savedBook.id);
      router.push('/mode-select');
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Failed to parse file. Please try another.');
    }
  };

  return (
    <main className="page-full">
      <FileUploader 
        onFileLoaded={handleFileLoaded} 
        onBack={() => router.push('/')} 
        onViewLibrary={() => router.push('/library')}
      />
    </main>
  );
}
