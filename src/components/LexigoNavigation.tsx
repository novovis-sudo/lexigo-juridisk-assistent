
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Scale, Camera, BookOpen, Bot } from 'lucide-react';

interface LexigoNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const LexigoNavigation = ({ activeTab, onTabChange }: LexigoNavigationProps) => {
  return (
    <div className="bg-[#151517] border-b border-[#232329] px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-5 glass-effect p-2 rounded-xl">
            <TabsTrigger 
              value="assistant" 
              className="flex items-center gap-3 px-6 py-4 rounded-lg font-medium text-sm transition-all duration-200 data-[state=active]:bg-accent-600 data-[state=active]:text-white data-[state=active]:accent-glow hover:bg-[#1a1a1d] text-dark-300 data-[state=active]:shadow-md"
            >
              <Bot className="h-4 w-4" />
              AI-Assistent
            </TabsTrigger>
            <TabsTrigger 
              value="analys" 
              className="flex items-center gap-3 px-6 py-4 rounded-lg font-medium text-sm transition-all duration-200 data-[state=active]:bg-accent-600 data-[state=active]:text-white data-[state=active]:accent-glow hover:bg-[#1a1a1d] text-dark-300 data-[state=active]:shadow-md"
            >
              <FileText className="h-4 w-4" />
              Analys
            </TabsTrigger>
            <TabsTrigger 
              value="jamforelse" 
              className="flex items-center gap-3 px-6 py-4 rounded-lg font-medium text-sm transition-all duration-200 data-[state=active]:bg-accent-600 data-[state=active]:text-white data-[state=active]:accent-glow hover:bg-[#1a1a1d] text-dark-300 data-[state=active]:shadow-md"
            >
              <Scale className="h-4 w-4" />
              Jämförelse
            </TabsTrigger>
            <TabsTrigger 
              value="bild-till-text" 
              className="flex items-center gap-3 px-6 py-4 rounded-lg font-medium text-sm transition-all duration-200 data-[state=active]:bg-accent-600 data-[state=active]:text-white data-[state=active]:accent-glow hover:bg-[#1a1a1d] text-dark-300 data-[state=active]:shadow-md"
            >
              <Camera className="h-4 w-4" />
              Bild till Text
            </TabsTrigger>
            <TabsTrigger 
              value="bibliotek" 
              className="flex items-center gap-3 px-6 py-4 rounded-lg font-medium text-sm transition-all duration-200 data-[state=active]:bg-accent-600 data-[state=active]:text-white data-[state=active]:accent-glow hover:bg-[#1a1a1d] text-dark-300 data-[state=active]:shadow-md"
            >
              <BookOpen className="h-4 w-4" />
              Bibliotek
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default LexigoNavigation;
