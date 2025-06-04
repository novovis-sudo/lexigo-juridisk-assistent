
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import LexigoHeader from './LexigoHeader';
import LexigoNavigation from './LexigoNavigation';
import AIAssistantView from './views/AIAssistantView';
import AnalysView from './views/AnalysView';
import ComparisonView from './views/ComparisonView';
import OCRView from './views/OCRView';
import LibraryView from './views/LibraryView';

const LexigoApp = () => {
  const [activeTab, setActiveTab] = useState('assistant');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'assistant':
        return <AIAssistantView onNavigate={setActiveTab} />;
      case 'analys':
        return <AnalysView />;
      case 'jamforelse':
        return <ComparisonView />;
      case 'bild-till-text':
        return <OCRView />;
      case 'bibliotek':
        return <LibraryView />;
      default:
        return <AIAssistantView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen premium-gradient">
      <LexigoHeader />
      <LexigoNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pb-12 animate-premium-fade-in">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default LexigoApp;
