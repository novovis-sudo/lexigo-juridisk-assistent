
import React from 'react';
import { Scale } from 'lucide-react';

const LexigoHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Lexigo – din juridiska AI-assistent
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Få hjälp att förstå juridik baserat på svenska rättskällor och AI
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LexigoHeader;
