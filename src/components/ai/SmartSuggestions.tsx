
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
    
    if (context.includes('uppsägning')) {
      return suggestions.filter(s => s.category === 'analysis' || s.category === 'library');
    }
    
    return suggestions;
  };

  return (
    <div className="space-y-6 bg-white rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">Smarta förslag</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getContextualSuggestions().map((suggestion) => (
          <Card 
            key={suggestion.id}
            className="p-6 hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300 group"
            onClick={() => onSuggestionClick(suggestion.action, suggestion.category)}
          >
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-lg flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                <div className="text-blue-600">
                  {suggestion.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {suggestion.title}
                </h4>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {suggestion.description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                >
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
