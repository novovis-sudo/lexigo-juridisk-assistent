
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, FileText, Scale, Camera, BookOpen } from 'lucide-react';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  category: 'analysis' | 'comparison' | 'ocr' | 'library';
}

interface SmartSuggestionsProps {
  onSuggestionClick: (action: string, category: string) => void;
  context?: string;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ onSuggestionClick, context }) => {
  const suggestions: Suggestion[] = [
    {
      id: '1',
      title: 'Analysera juridiskt dokument',
      description: 'Ladda upp ett dokument för djupgående AI-analys',
      icon: <FileText className="h-5 w-5" />,
      action: 'analyze-document',
      category: 'analysis'
    },
    {
      id: '2',
      title: 'Jämför dokument',
      description: 'Identifiera skillnader och konflikter mellan dokument',
      icon: <Scale className="h-5 w-5" />,
      action: 'compare-documents',
      category: 'comparison'
    },
    {
      id: '3',
      title: 'Extrahera text från bild',
      description: 'Konvertera juridiska dokument från bilder till text',
      icon: <Camera className="h-5 w-5" />,
      action: 'extract-text',
      category: 'ocr'
    },
    {
      id: '4',
      title: 'Utforska juridisk bibliotek',
      description: 'Sök i databas med prejudikat och juridiska resurser',
      icon: <BookOpen className="h-5 w-5" />,
      action: 'browse-library',
      category: 'library'
    }
  ];

  const getContextualSuggestions = (): Suggestion[] => {
    if (!context) return suggestions;
    
    // Return suggestions based on context
    if (context.includes('uppsägning')) {
      return suggestions.filter(s => s.category === 'analysis' || s.category === 'library');
    }
    
    return suggestions;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <h3 className="font-semibold text-gray-900">Smarta förslag</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getContextualSuggestions().map((suggestion) => (
          <Card 
            key={suggestion.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-200"
            onClick={() => onSuggestionClick(suggestion.action, suggestion.category)}
          >
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                {suggestion.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 mb-1">{suggestion.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  Kom igång
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SmartSuggestions;
