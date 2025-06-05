
import React from 'react';
import { BookOpen } from 'lucide-react';

const LibraryHeader = () => {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl mb-8 accent-glow">
        <BookOpen className="h-10 w-10 text-white" />
      </div>
      <h2 className="text-5xl font-serif font-semibold text-white mb-6 tracking-tight text-gradient">
        Juridiskt Bibliotek
      </h2>
      <p className="text-xl text-dark-300 font-sans max-w-3xl mx-auto leading-relaxed">
        Användbara juridiska länkar och resurser för svenska rättsprocesser
      </p>
    </div>
  );
};

export default LibraryHeader;
