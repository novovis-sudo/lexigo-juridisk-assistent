
import React from 'react';
import { Scale } from 'lucide-react';

const ChatHeader: React.FC = () => {
  return (
    <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-full">
          <Scale className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Lexigo - Juridisk AI-assistent</h3>
          <p className="text-sm text-gray-600">Specialiserad på svensk lagstiftning</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
