
import React from 'react';
import ConversationalInterface from '../ai/ConversationalInterface';

interface AIAssistantViewProps {
  onNavigate?: (view: string) => void;
}

const AIAssistantView: React.FC<AIAssistantViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ConversationalInterface onNavigate={onNavigate} />
    </div>
  );
};

export default AIAssistantView;
