
import React from 'react';
import ConversationalInterface from '../ai/ConversationalInterface';

interface AIAssistantViewProps {
  onNavigate?: (view: string) => void;
}

const AIAssistantView: React.FC<AIAssistantViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-50 via-parchment-100 to-parchment-200 relative">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-30 wood-texture pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <ConversationalInterface onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default AIAssistantView;
