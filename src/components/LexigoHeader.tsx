
import React from 'react';
import { Scale } from 'lucide-react';

const LexigoHeader = () => {
  return (
    <header className="bg-dark-surface border-b border-dark-border shadow-dark-lg">
      <div className="cyber-container">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 cyber-gradient-blue rounded-xl shadow-cyber-blue">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 cyber-text-gradient">
                Lexigo
              </h1>
              <p className="text-base text-muted-foreground font-medium">
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
