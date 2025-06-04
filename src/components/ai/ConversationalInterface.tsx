
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Välkommen till Lexigo AI</h2>
        <p className="text-gray-600">
          Din intelligenta juridiska assistent som hjälper dig navigera svenskt rättssystem
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Konversation
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Förslag
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Insikter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <AIChat 
            context={context}
            onSuggestionClick={(suggestion) => {
              console.log('Suggestion clicked:', suggestion);
            }}
          />
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <Card className="p-6">
            <SmartSuggestions 
              onSuggestionClick={handleSuggestionClick}
              context={context}
            />
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card className="p-6">
            <AIInsights />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConversationalInterface;
