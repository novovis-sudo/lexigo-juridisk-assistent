
import React from 'react';
import EnhancedLexigoChat from '../ai/EnhancedLexigoChat';

interface AIAssistantViewProps {
  onNavigate?: (view: string) => void;
}

const AIAssistantView: React.FC<AIAssistantViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="professional-container section-spacing">
        <div className="content-container">
          <div className="premium-card-elevated animate-professional-fade-in">
            <EnhancedLexigoChat onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantView;
