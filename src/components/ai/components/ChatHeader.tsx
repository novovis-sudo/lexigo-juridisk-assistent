
import React from 'react';
import { Scale } from 'lucide-react';

const ChatHeader: React.FC = () => {
  return (
    <div className="p-6 border-b border-border bg-gradient-to-r from-background to-muted/30">
      <div className="flex items-center gap-4">
        <div className="bg-primary p-3 rounded-xl shadow-professional">
          <Scale className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-foreground legal-gradient">
            Lexigo - Juridisk AI-assistent
          </h3>
          <p className="text-caption">
            Specialiserad på svensk lagstiftning och rättsprocesser
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
