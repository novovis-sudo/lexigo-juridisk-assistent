
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Scale, Camera, BookOpen } from 'lucide-react';

interface LexigoNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const LexigoNavigation = ({ activeTab, onTabChange }: LexigoNavigationProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-100">
            <TabsTrigger value="analys" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Analys
            </TabsTrigger>
            <TabsTrigger value="jamforelse" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Jämförelse
            </TabsTrigger>
            <TabsTrigger value="bild-till-text" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Bild till Text
            </TabsTrigger>
            <TabsTrigger value="bibliotek" className="flex items-center gap-2">
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
