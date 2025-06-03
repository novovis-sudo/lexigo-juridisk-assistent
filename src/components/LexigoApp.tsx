
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import LexigoHeader from './LexigoHeader';
import LexigoNavigation from './LexigoNavigation';
import AnalysView from './views/AnalysView';
import ComparisonView from './views/ComparisonView';
import OCRView from './views/OCRView';
import LibraryView from './views/LibraryView';

const LexigoApp = () => {
  const [activeTab, setActiveTab] = useState('analys');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'analys':
        return <AnalysView />;
      case 'jamforelse':
        return <ComparisonView />;
      case 'bild-till-text':
        return <OCRView />;
      case 'bibliotek':
        return <LibraryView />;
      default:
        return <AnalysView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LexigoHeader />
      <LexigoNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pb-8">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default LexigoApp;
