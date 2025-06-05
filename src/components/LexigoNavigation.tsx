
import React from 'react';
import { FileText, MessageSquare, Scale, BookOpen, Camera } from 'lucide-react';

interface LexigoNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const LexigoNavigation: React.FC<LexigoNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'assistant', label: 'AI-assistent', icon: MessageSquare },
    { id: 'analys', label: 'Analys', icon: FileText },
    { id: 'jamforelse', label: 'Jämförelse', icon: Scale },
    { id: 'bild-till-text', label: 'OCR', icon: Camera },
    { id: 'bibliotek', label: 'Bibliotek', icon: BookOpen },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default LexigoNavigation;
