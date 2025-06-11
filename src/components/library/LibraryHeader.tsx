
import React from 'react';
import { BookOpen } from 'lucide-react';

const LibraryHeader = () => {
  return (
    <div className="text-center mb-16 animate-professional-fade-in">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-legal-teal rounded-xl mb-6 shadow-professional-md">
        <BookOpen className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-hero font-heading mb-4 legal-gradient">
        Juridiskt Bibliotek
      </h1>
      <p className="text-subtitle max-w-2xl mx-auto">
        Kurerade resurser och kontakter för svenska juridiska processer
      </p>
    </div>
  );
};

export default LibraryHeader;
