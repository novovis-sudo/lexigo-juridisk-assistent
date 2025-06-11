
import React from 'react';
import { Scale } from 'lucide-react';

const LexigoHeader = () => {
  return (
    <header className="bg-background border-b border-border shadow-professional">
      <div className="professional-container">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg shadow-professional">
                <Scale className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-semibold text-foreground legal-gradient">
                  Lexigo
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  Juridisk AI-assistent för svenska rättsprocesser
                </p>
              </div>
            </div>
          </div>
          
          {/* Optional: Add user menu or settings */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">Välkommen</p>
              <p className="text-xs text-muted-foreground">Juridisk expert</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LexigoHeader;
