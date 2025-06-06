
import React from 'react';
import { Scale } from 'lucide-react';

const LexigoHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 luxury-shadow">
      <div className="luxury-container">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 mint-gradient rounded-2xl luxury-shadow">
              <Scale className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                Lexigo
              </h1>
              <p className="text-base text-gray-700 font-medium">
                Din juridiska AI-assistent för svenska rättsprocesser
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LexigoHeader;
