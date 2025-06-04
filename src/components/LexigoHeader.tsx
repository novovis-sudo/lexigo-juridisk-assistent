
import React from 'react';
import { Scale } from 'lucide-react';

const LexigoHeader = () => {
  return (
    <header className="bg-gradient-to-r from-ebony-950 to-charcoal-950 border-b border-gold-600/20 px-8 py-6 shadow-premium">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-gold-500 to-gold-700 p-3 rounded-xl shadow-gold-glow">
            <Scale className="h-7 w-7 text-ebony-950" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-semibold text-parchment-100 tracking-tight">
              Lexigo
            </h1>
            <p className="text-sm text-parchment-300 font-sans tracking-wide">
              Premium Juridisk AI-assistent
            </p>
          </div>
        </div>
        <div className="text-sm text-parchment-400 bg-ebony-900/50 px-4 py-2 rounded-lg border border-gold-600/30">
          <span className="text-gold-400">●</span> Testversion aktiv
        </div>
      </div>
    </header>
  );
};

export default LexigoHeader;
