
import React, { useState } from 'react';
import LexigoHeader from './LexigoHeader';
import LexigoNavigation from './LexigoNavigation';
import LexigoHomepage from './LexigoHomepage';
import AnalysView from './views/AnalysView';
import ComparisonView from './views/ComparisonView';
import OCRView from './views/OCRView';
import LibraryView from './views/LibraryView';
import AIAssistantView from './views/AIAssistantView';

const LexigoApp = () => {
  const [activeTab, setActiveTab] = useState('assistant');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'assistant':
        return <AIAssistantView onNavigate={setActiveTab} />;
      case 'hem':
        return <LexigoHomepage />;
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
    <div className="min-h-screen bg-dark-bg">
      <LexigoHeader />
      <LexigoNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="bg-dark-bg">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default LexigoApp;
