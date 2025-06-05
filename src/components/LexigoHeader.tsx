
import React from 'react';
import { Scale } from 'lucide-react';

const LexigoHeader = () => {
  return (
    <header className="bg-[#0f0f11] border-b border-[#232329] px-8 py-6 premium-shadow relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f11] via-[#151517] to-[#0f0f11]"></div>
      <div className="relative z-10 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-accent-500 to-accent-600 p-3 rounded-xl accent-glow">
            <Scale className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-semibold text-white tracking-tight">
              Lexigo
            </h1>
            <p className="text-sm text-dark-300 font-sans tracking-wide">
              Premium Juridisk AI-assistent
            </p>
          </div>
        </div>
        <div className="text-sm text-dark-400 glass-effect px-4 py-2 rounded-lg">
          <span className="text-accent-400">●</span> Testversion aktiv
        </div>
      </div>
    </header>
  );
};

export default LexigoHeader;
