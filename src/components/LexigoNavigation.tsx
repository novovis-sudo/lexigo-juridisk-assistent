
import React from 'react';
import { FileText, MessageSquare, Scale, BookOpen, Camera } from 'lucide-react';

interface LexigoNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const LexigoNavigation: React.FC<LexigoNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'assistant', label: 'AI-assistent', icon: MessageSquare, color: 'mint' },
    { id: 'analys', label: 'Analys', icon: FileText, color: 'peach' },
    { id: 'jamforelse', label: 'Jämförelse', icon: Scale, color: 'yellow' },
    { id: 'bild-till-text', label: 'OCR', icon: Camera, color: 'turquoise' },
    { id: 'bibliotek', label: 'Bibliotek', icon: BookOpen, color: 'mint' },
  ];

  const getTabStyles = (tab: any, isActive: boolean) => {
    const baseStyles = "flex items-center gap-3 px-6 py-4 text-base font-medium rounded-2xl transition-all duration-300 whitespace-nowrap";
    
    if (isActive) {
      switch (tab.color) {
        case 'mint':
          return `${baseStyles} bg-[#a1eacf] text-black shadow-md`;
        case 'peach':
          return `${baseStyles} bg-[#ffbfa3] text-black shadow-md`;
        case 'yellow':
          return `${baseStyles} bg-[#ffe663] text-black shadow-md`;
        case 'turquoise':
          return `${baseStyles} bg-[#4ed7e5] text-black shadow-md`;
        default:
          return `${baseStyles} bg-[#a1eacf] text-black shadow-md`;
      }
    }
    
    return `${baseStyles} text-gray-700 hover:bg-gray-100 hover:text-black`;
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="luxury-container">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={getTabStyles(tab, activeTab === tab.id)}
              >
                <Icon className="h-5 w-5" />
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
