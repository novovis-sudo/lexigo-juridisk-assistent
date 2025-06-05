
import React from 'react';
import { BookOpen } from 'lucide-react';

const LibraryHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 rounded-xl mb-6 shadow-gold-glow">
        <BookOpen className="h-8 w-8 text-ebony-950" />
      </div>
      <h2 className="text-4xl font-serif font-semibold text-ebony-950 mb-4 tracking-tight">
        Juridiskt Bibliotek
      </h2>
      <p className="text-lg text-charcoal-600 font-legal max-w-2xl mx-auto">
        Användbara juridiska länkar och resurser för svenska rättsprocesser
      </p>
    </div>
  );
};

export default LibraryHeader;
