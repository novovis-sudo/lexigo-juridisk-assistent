
import React from 'react';
import EnhancedLexigoChat from '../ai/EnhancedLexigoChat';

interface AIAssistantViewProps {
  onNavigate?: (view: string) => void;
}

const AIAssistantView: React.FC<AIAssistantViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f11] via-[#151517] to-[#1a1a1d] relative">
      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }}>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            <EnhancedLexigoChat onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantView;
