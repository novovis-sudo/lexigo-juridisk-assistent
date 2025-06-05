
import React, { useState } from 'react';
import LexigoHeader from './LexigoHeader';
import LexigoNavigation from './LexigoNavigation';
import LexigoHomepage from './LexigoHomepage';
import AnalysView from './views/AnalysView';
import ComparisonView from './views/ComparisonView';
import OCRView from './views/OCRView';
import LibraryView from './views/LibraryView';

const LexigoApp = () => {
  const [activeTab, setActiveTab] = useState('assistant');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'assistant':
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
        return <LexigoHomepage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LexigoHeader />
      <LexigoNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderActiveView()}
      </main>
    </div>
  );
};

export default LexigoApp;
