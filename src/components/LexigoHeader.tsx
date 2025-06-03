
import React from 'react';
import { Scale } from 'lucide-react';

const LexigoHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Scale className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lexigo</h1>
            <p className="text-sm text-gray-600">Juridisk AI-assistent</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Testversion - Ingen inloggning krävs
        </div>
      </div>
    </header>
  );
};

export default LexigoHeader;
