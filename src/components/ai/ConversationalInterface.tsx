
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIChat from './AIChat';
import SmartSuggestions from './SmartSuggestions';
import AIInsights from './AIInsights';
import { MessageSquare, Lightbulb, Target } from 'lucide-react';

interface ConversationalInterfaceProps {
  onNavigate?: (view: string) => void;
  context?: string;
}

const ConversationalInterface: React.FC<ConversationalInterfaceProps> = ({ 
  onNavigate, 
  context 
}) => {
  const [activeTab, setActiveTab] = useState('chat');

  const handleSuggestionClick = (action: string, category: string) => {
    if (onNavigate) {
      switch (category) {
        case 'analysis':
          onNavigate('analys');
          break;
        case 'comparison':
          onNavigate('jamforelse');
          break;
        case 'ocr':
          onNavigate('bild-till-text');
          break;
        case 'library':
          onNavigate('bibliotek');
          break;
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-serif font-semibold text-white mb-6 tracking-tight text-gradient">
          Välkommen till Lexigo AI
        </h2>
        <p className="text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed font-sans">
          Din intelligenta juridiska assistent som hjälper dig navigera svenskt rättssystem med precision och elegans
        </p>
      </div>

      {/* Premium Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-12 glass-effect p-2 rounded-xl">
          <TabsTrigger 
            value="chat" 
            className="flex items-center gap-3 px-8 py-5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-accent-600 data-[state=active]:text-white data-[state=active]:accent-glow text-dark-300"
          >
            <MessageSquare className="h-5 w-5" />
            Konversation
          </TabsTrigger>
          <TabsTrigger 
            value="suggestions" 
            className="flex items-center gap-3 px-8 py-5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-accent-600 data-[state=active]:text-white data-[state=active]:accent-glow text-dark-300"
          >
            <Lightbulb className="h-5 w-5" />
            Förslag
          </TabsTrigger>
          <TabsTrigger 
            value="insights" 
            className="flex items-center gap-3 px-8 py-5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-accent-600 data-[state=active]:text-white data-[state=active]:accent-glow text-dark-300"
          >
            <Target className="h-5 w-5" />
            Insikter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="premium-card p-10 rounded-xl">
            <AIChat 
              context={context}
              onSuggestionClick={(suggestion) => {
                console.log('Suggestion clicked:', suggestion);
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <div className="premium-card p-10 rounded-xl">
            <SmartSuggestions 
              onSuggestionClick={handleSuggestionClick}
              context={context}
            />
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="premium-card p-10 rounded-xl">
            <AIInsights />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConversationalInterface;
