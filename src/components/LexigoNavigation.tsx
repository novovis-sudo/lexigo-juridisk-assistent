
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Scale, Camera, BookOpen, Bot } from 'lucide-react';

interface LexigoNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const LexigoNavigation = ({ activeTab, onTabChange }: LexigoNavigationProps) => {
  return (
    <div className="bg-white border-b border-parchment-300 px-8 py-6 shadow-soft">
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-5 bg-parchment-200/50 p-2 rounded-xl border border-parchment-300 shadow-premium">
            <TabsTrigger 
              value="assistant" 
              className="flex items-center gap-3 px-6 py-4 rounded-lg font-medium text-sm transition-all duration-200 data-[state=active]:bg-gold-600 data-[state=active]:text-ebony-950 data-[state=active]:shadow-gold-glow hover:bg-parchment-100"
            >
              <Bot className="h-4 w-4" />
              AI-Assistent
            </TabsTrigger>
            <TabsTrigger 
              value="analys" 
              className="flex items-center gap-3 px-6 py-4 rounded-lg font-medium text-sm transition-all duration-200 data-[state=active]:bg-gold-600 data-[state=active]:text-ebony-950 data-[state=active]:shadow-gold-glow hover:bg-parchment-100"
            >
              <FileText className="h-4 w-4" />
              Analys
            </TabsTrigger>
            <TabsTrigger 
              value="jamforelse" 
              className="flex items-center gap-3 px-6 py-4 rounded-lg font-medium text-sm transition-all duration-200 data-[state=active]:bg-gold-600 data-[state=active]:text-ebony-950 data-[state=active]:shadow-gold-glow hover:bg-parchment-100"
            >
              <Scale className="h-4 w-4" />
              Jämförelse
            </TabsTrigger>
            <TabsTrigger 
              value="bild-till-text" 
              className="flex items-center gap-3 px-6 py-4 rounded-lg font-medium text-sm transition-all duration-200 data-[state=active]:bg-gold-600 data-[state=active]:text-ebony-950 data-[state=active]:shadow-gold-glow hover:bg-parchment-100"
            >
              <Camera className="h-4 w-4" />
              Bild till Text
            </TabsTrigger>
            <TabsTrigger 
              value="bibliotek" 
              className="flex items-center gap-3 px-6 py-4 rounded-lg font-medium text-sm transition-all duration-200 data-[state=active]:bg-gold-600 data-[state=active]:text-ebony-950 data-[state=active]:shadow-gold-glow hover:bg-parchment-100"
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
